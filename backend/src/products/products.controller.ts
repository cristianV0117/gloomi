import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
import {
  ALLOWED_IMAGE_MIMETYPES,
  productImageMulterOptions,
} from '../uploads/multer-options';
import { CreateProductBodyDto } from './dto/create-product.dto';
import { UpdateProductBodyDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

const MAX_IMAGES = 16;

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  @UseInterceptors(FilesInterceptor('images', MAX_IMAGES, productImageMulterOptions))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateProductBodyDto,
  ) {
    if (!files?.length) {
      throw new BadRequestException('Adjunta al menos una imagen');
    }
    for (const f of files) {
      if (!ALLOWED_IMAGE_MIMETYPES.has(f.mimetype)) {
        throw new BadRequestException('Solo JPEG, PNG, WebP o GIF');
      }
    }
    const paths = files.map((f) => `/uploads/products/${f.filename}`);
    return this.productsService.create(body, paths);
  }

  @Patch(':slug')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  update(@Param('slug') slug: string, @Body() body: UpdateProductBodyDto) {
    return this.productsService.update(slug, body);
  }

  @Put(':slug/images')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  @UseInterceptors(FilesInterceptor('images', MAX_IMAGES, productImageMulterOptions))
  replaceImages(
    @Param('slug') slug: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files?.length) {
      throw new BadRequestException('Adjunta al menos una imagen');
    }
    for (const f of files) {
      if (!ALLOWED_IMAGE_MIMETYPES.has(f.mimetype)) {
        throw new BadRequestException('Solo JPEG, PNG, WebP o GIF');
      }
    }
    const paths = files.map((f) => `/uploads/products/${f.filename}`);
    return this.productsService.replaceImages(slug, paths);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  remove(@Param('slug') slug: string) {
    return this.productsService.remove(slug);
  }
}
