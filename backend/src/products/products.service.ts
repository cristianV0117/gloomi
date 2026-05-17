import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductBodyDto } from './dto/create-product.dto';
import { UpdateProductBodyDto } from './dto/update-product.dto';
import {
  Product,
  ProductColor,
  ProductDocument,
  ProductSize,
  ProductStyle,
} from './schemas/product.schema';
import { tryUnlinkManyRelative } from '../uploads/delete-upload.utils';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async onModuleInit() {
    await this.migrateLegacyProducts();
  }

  /** Migra documentos antiguos (`price`, `image`) al nuevo esquema. */
  async migrateLegacyProducts(): Promise<void> {
    const docs = await this.productModel.find().exec();
    for (const doc of docs) {
      const d = doc.toObject() as unknown as Record<string, unknown>;
      const hasNew =
        typeof d['priceUsd'] === 'number' &&
        typeof d['priceCop'] === 'number' &&
        Array.isArray(d['images']) &&
        (d['images'] as unknown[]).length > 0;
      if (hasNew) continue;
      let images: string[] = [];
      if (Array.isArray(d['images']) && (d['images'] as string[]).length) {
        images = (d['images'] as string[]).filter((x) => typeof x === 'string');
      } else if (typeof d['image'] === 'string' && d['image']) {
        images = [d['image']];
      }
      const priceUsd =
        typeof d['priceUsd'] === 'number'
          ? d['priceUsd']
          : typeof d['price'] === 'number'
            ? d['price']
            : 0;
      const priceCop =
        typeof d['priceCop'] === 'number'
          ? d['priceCop']
          : Math.round(Number(priceUsd) * 4200);
      await this.productModel.collection.updateOne(
        { _id: doc._id },
        {
          $set: { images, priceUsd: Number(priceUsd), priceCop: Number(priceCop) },
          $unset: { price: '', image: '' },
        },
      );
    }
  }

  async findAll() {
    const items = await this.productModel.find().sort({ createdAt: -1 }).lean().exec();
    return items.map((doc) =>
      this.toResponse(doc as unknown as Record<string, unknown>),
    );
  }

  async findBySlug(slug: string) {
    const doc = await this.productModel
      .findOne({ slug: slug.toLowerCase().trim() })
      .lean()
      .exec();
    if (!doc) {
      throw new NotFoundException('Producto no encontrado');
    }
    return this.toResponse(doc as unknown as Record<string, unknown>);
  }

  async create(body: CreateProductBodyDto, imageRelativePaths: string[]) {
    if (!imageRelativePaths.length) {
      throw new ConflictException('Añade al menos una imagen');
    }
    const slug = body.slug.toLowerCase().trim();
    const exists = await this.productModel.exists({ slug }).exec();
    if (exists) {
      throw new ConflictException('Ya existe un Gloomi con ese slug');
    }
    const created = await this.productModel.create({
      slug,
      name: body.name,
      editionNumber: body.editionNumber,
      priceUsd: body.priceUsd,
      priceCop: body.priceCop,
      images: imageRelativePaths,
      story: body.story,
      materials: body.materials,
      sourceGarment: body.sourceGarment,
      care: body.care,
      color: body.color as ProductColor,
      style: body.style as ProductStyle,
      size: body.size as ProductSize,
    });
    return this.toResponse(created.toObject() as unknown as Record<string, unknown>);
  }

  async update(slug: string, body: UpdateProductBodyDto) {
    const doc = await this.productModel
      .findOne({ slug: slug.toLowerCase().trim() })
      .exec();
    if (!doc) {
      throw new NotFoundException('Producto no encontrado');
    }
    if (body.name !== undefined) doc.name = body.name;
    if (body.editionNumber !== undefined) doc.editionNumber = body.editionNumber;
    if (body.priceUsd !== undefined) doc.priceUsd = body.priceUsd;
    if (body.priceCop !== undefined) doc.priceCop = body.priceCop;
    if (body.story !== undefined) doc.story = body.story;
    if (body.materials !== undefined) doc.materials = body.materials;
    if (body.sourceGarment !== undefined) doc.sourceGarment = body.sourceGarment;
    if (body.care !== undefined) doc.care = body.care;
    if (body.color !== undefined) doc.color = body.color as ProductColor;
    if (body.style !== undefined) doc.style = body.style as ProductStyle;
    if (body.size !== undefined) doc.size = body.size as ProductSize;
    await doc.save();
    return this.toResponse(doc.toObject() as unknown as Record<string, unknown>);
  }

  async replaceImages(slug: string, newRelativePaths: string[]) {
    if (!newRelativePaths.length) {
      throw new ConflictException('Debe haber al menos una imagen');
    }
    const doc = await this.productModel
      .findOne({ slug: slug.toLowerCase().trim() })
      .exec();
    if (!doc) {
      throw new NotFoundException('Producto no encontrado');
    }
    const old = (doc.images ?? []).filter(
      (p) => typeof p === 'string' && p.startsWith('/uploads/products/'),
    );
    await tryUnlinkManyRelative(old);
    doc.images = newRelativePaths;
    await doc.save();
    return this.toResponse(doc.toObject() as unknown as Record<string, unknown>);
  }

  async remove(slug: string) {
    const doc = await this.productModel
      .findOne({ slug: slug.toLowerCase().trim() })
      .exec();
    if (!doc) {
      throw new NotFoundException('Producto no encontrado');
    }
    const paths = (doc.images ?? []).filter(
      (p) => typeof p === 'string' && p.startsWith('/uploads/products/'),
    );
    await tryUnlinkManyRelative(paths);
    await doc.deleteOne();
    return { ok: true };
  }

  toPublicJson(doc: Record<string, unknown>) {
    return this.toResponse(doc);
  }

  private toResponse(doc: Record<string, unknown>) {
    const normalized = this.normalizeFields(doc);
    const { _id, __v, ...rest } = normalized;
    return {
      id: String(_id ?? doc._id),
      ...rest,
    };
  }

  private normalizeFields(doc: Record<string, unknown>): Record<string, unknown> {
    const { price: _legacyPrice, image: _legacyImage, ...base } = doc;
    let images: string[] = [];
    const rawImg = doc['images'];
    if (Array.isArray(rawImg)) {
      images = (rawImg as unknown[]).filter((x) => typeof x === 'string') as string[];
    }
    if (!images.length && typeof doc['image'] === 'string') {
      images = [doc['image'] as string];
    }
    const priceUsd =
      typeof doc['priceUsd'] === 'number'
        ? doc['priceUsd']
        : typeof doc['price'] === 'number'
          ? doc['price']
          : 0;
    const priceCop =
      typeof doc['priceCop'] === 'number'
        ? doc['priceCop']
        : Math.round(Number(priceUsd) * 4200);
    return {
      ...base,
      images,
      priceUsd: Number(priceUsd),
      priceCop: Number(priceCop),
    };
  }
}
