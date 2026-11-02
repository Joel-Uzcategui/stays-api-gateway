import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  RABBITMQ_URL: string;
  AUTH_QUEUE: string;
  CATALOG_QUEUE: string;
  SEARCH_QUEUE: string;
  BOOKING_QUEUE: string;
  PAYMENT_QUEUE: string;
  JWT_PUBLIC_KEY: string;
  S3_ENDPOINT?: string;
  S3_ACCESS_KEY?: string;
  S3_SECRET_KEY?: string;
  S3_BUCKET?: string;
  S3_REGION: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    RABBITMQ_URL: joi.string().required(),
    AUTH_QUEUE: joi.string().required(),
    CATALOG_QUEUE: joi.string().required(),
    SEARCH_QUEUE: joi.string().required(),
    BOOKING_QUEUE: joi.string().required(),
    PAYMENT_QUEUE: joi.string().required(),
    JWT_PUBLIC_KEY: joi.string().base64().required(),
    S3_ENDPOINT: joi.string().uri().optional(),
    S3_ACCESS_KEY: joi.string().optional(),
    S3_SECRET_KEY: joi.string().optional(),
    S3_BUCKET: joi.string().optional(),
    S3_REGION: joi.string().default('us-east-1'),
  })
  .unknown(true);

const result = envsSchema.validate(process.env) as {
  error?: joi.ValidationError;
  value: EnvVars;
};

if (result.error) {
  throw new Error(`Config validation error: ${result.error.message}`);
}

const envVars = result.value;

export const envs = {
  port: envVars.PORT,
  rabbitmqUrl: envVars.RABBITMQ_URL,
  authQueue: envVars.AUTH_QUEUE,
  catalogQueue: envVars.CATALOG_QUEUE,
  searchQueue: envVars.SEARCH_QUEUE,
  bookingQueue: envVars.BOOKING_QUEUE,
  paymentQueue: envVars.PAYMENT_QUEUE,
  jwtPublicKey: Buffer.from(envVars.JWT_PUBLIC_KEY, 'base64').toString('utf8'),
  s3Endpoint: envVars.S3_ENDPOINT,
  s3AccessKey: envVars.S3_ACCESS_KEY,
  s3SecretKey: envVars.S3_SECRET_KEY,
  s3Bucket: envVars.S3_BUCKET,
  s3Region: envVars.S3_REGION,
};
