import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import sharp from 'sharp';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 78;

export const PHOTO_CONTENT_TYPE = 'image/webp';
export const PHOTO_EXTENSION = 'webp';

// Reads the real type from the first bytes. The browser's Content-Type and the
// file name are both caller-controlled and prove nothing about the content.
//
// SVG is absent on purpose: it is XML, it can carry script, and no hotel is
// photographed as a vector drawing.
const sniffImageType = (buffer: Buffer): string | null => {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpeg';
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'png';
  }

  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'webp';
  }

  if (buffer.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buffer.toString('ascii', 8, 12);

    if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(brand)) {
      return 'heif';
    }
  }

  return null;
};

// Turns whatever was uploaded into one predictable WebP.
//
// Re-encoding is the security control, not a nicety: the output is pixels that
// libvips produced, so anything smuggled inside the original container does not
// survive. It also drops EXIF, which on a phone photo carries GPS coordinates.
export const processPhoto = async (buffer: Buffer): Promise<Buffer> => {
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new PayloadTooLargeException('The image is too large');
  }

  if (!sniffImageType(buffer)) {
    throw new BadRequestException(
      'The file must be an image (JPG, PNG, WEBP or HEIC)',
    );
  }

  try {
    return await sharp(buffer)
      // Applies the EXIF orientation while it is still there: the tag that says
      // the photo was taken sideways is about to be stripped.
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch {
    throw new BadRequestException('The image could not be processed');
  }
};
