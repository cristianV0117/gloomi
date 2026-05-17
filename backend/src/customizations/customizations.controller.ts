import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CustomizationsService } from './customizations.service';
import { CreateGloomiCustomizationDto } from './dto/create-gloomi-customization.dto';

@Controller('customizations')
export class CustomizationsController {
  constructor(private readonly customizationsService: CustomizationsService) {}

  /** Público: guardar diseño desde la web */
  @Post()
  create(@Body() dto: CreateGloomiCustomizationDto) {
    return this.customizationsService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  findAllAdmin() {
    return this.customizationsService.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  findOneAdmin(@Param('id') id: string) {
    return this.customizationsService.findOneAdmin(id);
  }
}
