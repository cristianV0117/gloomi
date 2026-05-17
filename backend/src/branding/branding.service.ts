import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BrandSettings, BrandSettingsDocument } from './schemas/brand-settings.schema';

@Injectable()
export class BrandingService {
  constructor(
    @InjectModel(BrandSettings.name)
    private brandModel: Model<BrandSettingsDocument>,
  ) {}

  async getLogoRelativeUrl(): Promise<string | null> {
    const doc = await this.brandModel.findOne({ key: 'default' }).lean().exec();
    return doc?.logoRelativeUrl ?? null;
  }

  async setLogoRelativeUrl(relativeUrl: string): Promise<void> {
    await this.brandModel
      .updateOne(
        { key: 'default' },
        {
          $set: { logoRelativeUrl: relativeUrl },
          $setOnInsert: { key: 'default' },
        },
        { upsert: true },
      )
      .exec();
  }
}
