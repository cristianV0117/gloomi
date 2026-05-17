import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GloomiCustomizationDocument =
  HydratedDocument<GloomiCustomization>;

/** Diseños guardados desde «Personaliza tu Gloomi». */
@Schema({
  collection: 'gloomi_customizations',
  timestamps: true,
})
export class GloomiCustomization {
  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  note?: string;

  /** Misma forma que envía el front (creatureId, fabricByZone, etc.) */
  @Prop({ type: Object, required: true })
  config: Record<string, unknown>;
}

export const GloomiCustomizationSchema = SchemaFactory.createForClass(
  GloomiCustomization,
);
