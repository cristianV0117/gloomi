import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
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
import { ALLOWED_IMAGE_MIMETYPES } from '../uploads/multer-options';
import { heroImageMulterOptions } from '../uploads/hero-multer';
import { UpdateHomeSettingsDto } from './dto/update-home-settings.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getPublic() {
    return this.homeService.getPublicPayload();
  }

  @Get('settings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  getSettings() {
    return this.homeService.getAdminSettings();
  }

  @Patch('settings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  patchSettings(@Body() dto: UpdateHomeSettingsDto) {
    return this.homeService.updateAdminSettings({
      heroSource: dto.heroSource,
      heroProductSlug: dto.heroProductSlug,
      featuredSlugs: dto.featuredSlugs,
      clearCustomHero: dto.clearCustomHero,
    });
  }

  @Post('hero-image')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  @UseInterceptors(FileInterceptor('file', heroImageMulterOptions))
  async uploadHero(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Selecciona una imagen para el hero');
    }
    if (!ALLOWED_IMAGE_MIMETYPES.has(file.mimetype)) {
      throw new BadRequestException('Usa JPEG, PNG, WebP o GIF');
    }
    const rel = `/uploads/home/${file.filename}`;
    return this.homeService.setHeroCustomUrl(rel);
  }
}
