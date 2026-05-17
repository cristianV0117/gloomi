import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateGloomiCustomizationDto } from './dto/create-gloomi-customization.dto';
import {
  GloomiCustomization,
  GloomiCustomizationDocument,
} from './schemas/gloomi-customization.schema';

@Injectable()
export class CustomizationsService {
  constructor(
    @InjectModel(GloomiCustomization.name)
    private model: Model<GloomiCustomizationDocument>,
  ) {}

  async create(dto: CreateGloomiCustomizationDto) {
    const doc = await this.model.create({
      email: dto.email?.trim().toLowerCase() || undefined,
      name: dto.name?.trim() || undefined,
      note: dto.note?.trim() || undefined,
      config: {
        creatureId: dto.config.creatureId,
        fabricByZone: {
          head: dto.config.fabricByZone.head,
          body: dto.config.fabricByZone.body,
          limbs: dto.config.fabricByZone.limbs,
        },
        eyeId: dto.config.eyeId,
        hatId: dto.config.hatId,
        charmId: dto.config.charmId,
        wingKind: dto.config.wingKind,
        tailAccentKind: dto.config.tailAccentKind,
        previewMode: dto.config.previewMode ?? 'three_d',
      },
    });
    return { id: String(doc._id) };
  }

  async findAllAdmin() {
    const rows = await this.model
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return rows.map((r) => {
      const t = r as typeof r & { createdAt?: Date; updatedAt?: Date };
      return {
        id: String(r._id),
        email: r.email,
        name: r.name,
        note: r.note,
        config: r.config,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      };
    });
  }

  async findOneAdmin(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Diseño no encontrado');
    }
    const r = await this.model.findById(id).lean().exec();
    if (!r) {
      throw new NotFoundException('Diseño no encontrado');
    }
    const t = r as typeof r & { createdAt?: Date; updatedAt?: Date };
    return {
      id: String(r._id),
      email: r.email,
      name: r.name,
      note: r.note,
      config: r.config,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  }
}
