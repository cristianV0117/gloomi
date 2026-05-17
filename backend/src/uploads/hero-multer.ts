import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  ensureUploadSubdir,
} from './multer-options';

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

function safeExt(originalName: string): string {
  const e = extname(originalName).toLowerCase();
  if (ALLOWED_EXT.has(e)) return e;
  return '.png';
}

export const heroImageMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, ensureUploadSubdir('home'));
    },
    filename: (_req, _file, cb) => {
      cb(null, `hero-${randomUUID()}${safeExt(_file.originalname)}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
};
