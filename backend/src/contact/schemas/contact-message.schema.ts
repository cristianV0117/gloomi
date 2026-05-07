import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactMessageDocument = HydratedDocument<ContactMessage>;

/** Mensajes del formulario «Contáctanos» en la colección `contacts`. */
@Schema({
  collection: 'contacts',
  timestamps: true,
})
export class ContactMessage {
  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  subject?: string;
}

export const ContactMessageSchema =
  SchemaFactory.createForClass(ContactMessage);
