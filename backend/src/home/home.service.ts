import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { ProductsService } from '../products/products.service';
import {
  HeroSource,
  HomePageSettings,
  HomePageSettingsDocument,
} from './schemas/home-page-settings.schema';
import { tryUnlinkUploadRelative } from '../uploads/delete-upload.utils';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(HomePageSettings.name)
    private homeModel: Model<HomePageSettingsDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly productsService: ProductsService,
  ) {}

  private async getOrCreateSettings(): Promise<HomePageSettingsDocument> {
    let doc = await this.homeModel.findOne({ key: 'default' }).exec();
    if (!doc) {
      doc = await this.homeModel.create({
        key: 'default',
        heroSource: 'product',
        heroProductSlug: null,
        heroCustomRelativeUrl: null,
        featuredSlugs: ['', '', ''],
      });
    }
    return doc;
  }

  async getAdminSettings() {
    const s = await this.getOrCreateSettings();
    return {
      heroSource: s.heroSource,
      heroProductSlug: s.heroProductSlug,
      heroCustomRelativeUrl: s.heroCustomRelativeUrl,
      featuredSlugs: this.normalizeFeatured(s.featuredSlugs),
    };
  }

  async updateAdminSettings(patch: {
    heroSource?: HeroSource;
    heroProductSlug?: string | null;
    featuredSlugs?: string[];
    clearCustomHero?: boolean;
  }) {
    const s = await this.getOrCreateSettings();
    if (patch.clearCustomHero && s.heroCustomRelativeUrl) {
      await tryUnlinkUploadRelative(s.heroCustomRelativeUrl);
    }
    const featured = patch.featuredSlugs
      ? this.normalizeFeatured(patch.featuredSlugs)
      : undefined;
    if (patch.heroSource !== undefined) s.heroSource = patch.heroSource;
    if (patch.heroProductSlug !== undefined) {
      s.heroProductSlug = patch.heroProductSlug?.trim() || null;
    }
    if (patch.clearCustomHero) {
      s.heroCustomRelativeUrl = null;
    }
    if (featured) s.featuredSlugs = featured;
    await s.save();
    return this.getAdminSettings();
  }

  async setHeroCustomUrl(relativeUrl: string) {
    const s = await this.getOrCreateSettings();
    if (s.heroCustomRelativeUrl && s.heroCustomRelativeUrl !== relativeUrl) {
      await tryUnlinkUploadRelative(s.heroCustomRelativeUrl);
    }
    s.heroCustomRelativeUrl = relativeUrl;
    s.heroSource = 'custom';
    await s.save();
    return this.getAdminSettings();
  }

  /** Respuesta pública para armar la home */
  async getPublicPayload() {
    const s = await this.getOrCreateSettings();
    const featuredSlugs = this.normalizeFeatured(s.featuredSlugs);
    const featuredProducts = [];
    for (const slug of featuredSlugs) {
      if (!slug?.trim()) {
        featuredProducts.push(null);
        continue;
      }
      const p = await this.productModel
        .findOne({ slug: slug.toLowerCase().trim() })
        .lean()
        .exec();
      featuredProducts.push(
        p
          ? this.productsService.toPublicJson(p as unknown as Record<string, unknown>)
          : null,
      );
    }

    let heroImageRelative: string | null = null;
    if (s.heroSource === 'custom' && s.heroCustomRelativeUrl) {
      heroImageRelative = s.heroCustomRelativeUrl;
    } else if (s.heroSource === 'product' && s.heroProductSlug) {
      const p = await this.productModel
        .findOne({ slug: s.heroProductSlug.toLowerCase().trim() })
        .lean()
        .exec();
      if (p) {
        heroImageRelative = this.firstImageFromDoc(p as unknown as Record<string, unknown>);
      }
    }
    if (!heroImageRelative) {
      const first = await this.productModel.findOne().sort({ createdAt: -1 }).lean().exec();
      if (first) {
        heroImageRelative = this.firstImageFromDoc(first as unknown as Record<string, unknown>);
      }
    }

    return {
      heroImageUrl: heroImageRelative,
      featuredProducts,
    };
  }

  private normalizeFeatured(arr: string[] | undefined): [string, string, string] {
    const a = arr ?? ['', '', ''];
    return [
      (a[0] ?? '').trim(),
      (a[1] ?? '').trim(),
      (a[2] ?? '').trim(),
    ];
  }

  private firstImageFromDoc(doc: Record<string, unknown>): string | null {
    const images = doc['images'];
    if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'string') {
      return images[0];
    }
    const legacy = doc['image'];
    if (typeof legacy === 'string' && legacy) return legacy;
    return null;
  }
}
