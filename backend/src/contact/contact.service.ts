import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import {
  ContactMessage,
  ContactMessageDocument,
} from './schemas/contact-message.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactMessage.name)
    private contactModel: Model<ContactMessageDocument>,
  ) {}

  async create(dto: CreateContactMessageDto) {
    const doc = await this.contactModel.create({
      email: dto.email,
      message: dto.message,
      name: dto.name?.trim() || undefined,
      subject: dto.subject?.trim() || undefined,
    });
    return {
      id: String(doc._id),
    };
  }
}
