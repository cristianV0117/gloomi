import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
import {
  ALLOWED_IMAGE_MIMETYPES,
  brandLogoMulterOptions,
} from '../uploads/multer-options';
import { BrandingService } from './branding.service';

@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get('logo')
  async getLogo() {
    const url = await this.brandingService.getLogoRelativeUrl();
    return { url };
  }

  @Post('logo')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  @UseInterceptors(FileInterceptor('logo', brandLogoMulterOptions))
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Envía un archivo en el campo «logo»');
    }
    if (!ALLOWED_IMAGE_MIMETYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Formato no permitido. Usa JPEG, PNG, WebP o GIF.',
      );
    }
    const relative = `/uploads/branding/${file.filename}`;
    await this.brandingService.setLogoRelativeUrl(relative);
    return { url: relative };
  }
}
