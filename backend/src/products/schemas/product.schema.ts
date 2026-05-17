import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

export const PRODUCT_COLORS = ['Negro', 'Gris', 'Hueso', 'Morado'] as const;
export const PRODUCT_STYLES = ['Nocturno', 'Vintage', 'Glitter', 'Minimal'] as const;
export const PRODUCT_SIZES = ['S', 'M', 'L'] as const;

export type ProductColor = (typeof PRODUCT_COLORS)[number];
export type ProductStyle = (typeof PRODUCT_STYLES)[number];
export type ProductSize = (typeof PRODUCT_SIZES)[number];

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 1 })
  editionNumber: number;

  @Prop({ required: true, min: 0 })
  priceUsd: number;

  @Prop({ required: true, min: 0 })
  priceCop: number;

  @Prop({ type: [String], required: true, default: [] })
  images: string[];

  @Prop({ required: true, trim: true })
  story: string;

  @Prop({ required: true, trim: true })
  materials: string;

  @Prop({ required: true, trim: true })
  sourceGarment: string;

  @Prop({ required: true, trim: true })
  care: string;

  @Prop({ type: String, enum: PRODUCT_COLORS, required: true })
  color: ProductColor;

  @Prop({ type: String, enum: PRODUCT_STYLES, required: true })
  style: ProductStyle;

  @Prop({ type: String, enum: PRODUCT_SIZES, required: true })
  size: ProductSize;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
