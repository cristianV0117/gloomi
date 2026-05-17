import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const UPLOAD_ROOT = join(process.cwd(), 'uploads');

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

export function ensureUploadSubdir(...segments: string[]): string {
  const dir = join(UPLOAD_ROOT, ...segments);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function safeExt(originalName: string): string {
  const e = extname(originalName).toLowerCase();
  if (ALLOWED_EXT.has(e)) return e;
  return '.png';
}

function productStorage() {
  return diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, ensureUploadSubdir('products'));
    },
    filename: (_req, file, cb) => {
      cb(null, `${randomUUID()}${safeExt(file.originalname)}`);
    },
  });
}

function brandingStorage() {
  return diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, ensureUploadSubdir('branding'));
    },
    filename: (_req, file, cb) => {
      cb(null, `logo${safeExt(file.originalname)}`);
    },
  });
}

export const productImageMulterOptions: MulterOptions = {
  storage: productStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
};

export const brandLogoMulterOptions: MulterOptions = {
  storage: brandingStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
};

export const ALLOWED_IMAGE_MIMETYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);
