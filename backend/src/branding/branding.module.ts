import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandSettings, BrandSettingsSchema } from './schemas/brand-settings.schema';
import { BrandingController } from './branding.controller';
import { BrandingService } from './branding.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BrandSettings.name, schema: BrandSettingsSchema },
    ]),
  ],
  controllers: [BrandingController],
  providers: [BrandingService],
  exports: [BrandingService],
})
export class BrandingModule {}
