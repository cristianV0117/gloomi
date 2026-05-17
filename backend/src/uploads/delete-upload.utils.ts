import { join } from 'path';
import { unlink } from 'fs/promises';

export async function tryUnlinkUploadRelative(rel: string | null | undefined): Promise<void> {
  if (!rel || typeof rel !== 'string' || !rel.startsWith('/uploads/')) return;
  const abs = join(process.cwd(), rel.replace(/^\//, ''));
  try {
    await unlink(abs);
  } catch {
    /* archivo ausente */
  }
}

export async function tryUnlinkManyRelative(paths: string[]): Promise<void> {
  await Promise.all(paths.map((p) => tryUnlinkUploadRelative(p)));
}
