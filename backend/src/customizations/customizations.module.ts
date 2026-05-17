import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomizationsController } from './customizations.controller';
import { CustomizationsService } from './customizations.service';
import {
  GloomiCustomization,
  GloomiCustomizationSchema,
} from './schemas/gloomi-customization.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GloomiCustomization.name, schema: GloomiCustomizationSchema },
    ]),
  ],
  controllers: [CustomizationsController],
  providers: [CustomizationsService],
})
export class CustomizationsModule {}
