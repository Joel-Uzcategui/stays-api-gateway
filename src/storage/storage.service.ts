import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  type GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';

import { envs } from '../config';

export interface StoredObject {
  stream: Readable;
  contentType: string;
  contentLength?: number;
}

// Object storage for the hotel photos.
//
// Talks S3, but the bucket lives on a self-hosted SeaweedFS reachable only over
// the private network. No browser ever reaches it: the gateway reads the bytes
// and streams them, which is the same access model the rest of this server
// already uses.
//
// Because it is plain S3, swapping SeaweedFS for R2, MinIO or AWS later is a
// change of environment variables, not of code.
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client | null;
  private readonly bucket: string;

  constructor() {
    this.bucket = envs.s3Bucket ?? '';

    // Storage is optional at boot on purpose. Cloning the repo and running the
    // stack locally should not require a SeaweedFS container just to browse
    // hotels. The service starts, says so, and only photo endpoints fail.
    if (
      !envs.s3Endpoint ||
      !envs.s3AccessKey ||
      !envs.s3SecretKey ||
      !this.bucket
    ) {
      this.client = null;

      return;
    }

    this.client = new S3Client({
      endpoint: envs.s3Endpoint,
      // SeaweedFS addresses buckets as host:port/bucket/key, not
      // bucket.host/key. Without this the SDK invents a subdomain per bucket
      // and every call dies in DNS.
      forcePathStyle: true,
      // SeaweedFS ignores the region, but the SDK refuses to sign without one.
      region: envs.s3Region,
      credentials: {
        accessKeyId: envs.s3AccessKey,
        secretAccessKey: envs.s3SecretKey,
      },
    });
  }

  onModuleInit() {
    if (this.isConfigured) {
      this.logger.log(`Storage ready on bucket "${this.bucket}"`);

      return;
    }

    this.logger.warn(
      'Storage is NOT configured (S3_ENDPOINT / S3_ACCESS_KEY / S3_SECRET_KEY / S3_BUCKET). Photo uploads will be rejected.',
    );
  }

  get isConfigured(): boolean {
    return this.client !== null;
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    const client = this.requireClient();

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to store ${key}`, error as Error);

      throw new InternalServerErrorException('Could not store the file');
    }
  }

  async get(key: string): Promise<StoredObject> {
    const client = this.requireClient();

    let response: GetObjectCommandOutput;

    try {
      response = await client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (error) {
      const name = (error as { name?: string }).name;

      if (name === 'NoSuchKey' || name === 'NotFound') {
        throw new NotFoundException('Photo not found');
      }

      this.logger.error(`Failed to read ${key}`, error as Error);

      throw new InternalServerErrorException('Could not read the file');
    }

    if (!response.Body) {
      throw new NotFoundException('Photo not found');
    }

    return {
      // In Node the SDK always hands back a Readable; the union only widens to
      // Blob/ReadableStream in browser builds, which this never is.
      stream: response.Body as Readable,
      contentType: response.ContentType ?? 'application/octet-stream',
      contentLength: response.ContentLength,
    };
  }

  async delete(key: string): Promise<void> {
    const client = this.requireClient();

    try {
      await client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (error) {
      // Best-effort cleanup: a failure here must never fail the caller.
      this.logger.warn(`Failed to delete ${key}: ${String(error)}`);
    }
  }

  private requireClient(): S3Client {
    if (!this.client) {
      throw new ServiceUnavailableException(
        'File storage is not configured on this server',
      );
    }

    return this.client;
  }
}
