import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandSettingsDocument = HydratedDocument<BrandSettings>;

@Schema({ timestamps: true, collection: 'brand_settings' })
export class BrandSettings {
  @Prop({ type: String, required: true, unique: true, default: 'default' })
  key: string;

  /** Ej: `/uploads/branding/logo.png` */
  @Prop({ type: String, default: null })
  logoRelativeUrl: string | null;
}

export const BrandSettingsSchema = SchemaFactory.createForClass(BrandSettings);
