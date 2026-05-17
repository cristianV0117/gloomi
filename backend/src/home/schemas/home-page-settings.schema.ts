import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HomePageSettingsDocument = HydratedDocument<HomePageSettings>;

export const HERO_SOURCES = ['custom', 'product'] as const;
export type HeroSource = (typeof HERO_SOURCES)[number];

@Schema({ timestamps: true, collection: 'home_page_settings' })
export class HomePageSettings {
  @Prop({ type: String, required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: String, enum: HERO_SOURCES, default: 'product' })
  heroSource: HeroSource;

  /** Slug del Gloomi cuya primera imagen se usa en el hero (si heroSource = product) */
  @Prop({ type: String, default: null })
  heroProductSlug: string | null;

  /** Ruta bajo /uploads/home/... si heroSource = custom */
  @Prop({ type: String, default: null })
  heroCustomRelativeUrl: string | null;

  /** Exactamente 3 entradas: slug o cadena vacía para dejar el cupo libre */
  @Prop({ type: [String], default: ['', '', ''] })
  featuredSlugs: string[];
}

export const HomePageSettingsSchema = SchemaFactory.createForClass(HomePageSettings);
