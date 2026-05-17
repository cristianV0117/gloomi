import { NestFactory } from '@nestjs/core';
import { AdminSeederService } from './seeder/admin-seeder.service';
import { SeederModule } from './seeder/seeder.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  try {
    await app.get(AdminSeederService).run();
  } finally {
    await app.close();
  }
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
