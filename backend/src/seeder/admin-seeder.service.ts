import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import {
  Product,
  ProductDocument,
  ProductColor,
  ProductSize,
  ProductStyle,
} from '../products/schemas/product.schema';
import {
  HomePageSettings,
  HomePageSettingsDocument,
} from '../home/schemas/home-page-settings.schema';
import * as bcrypt from 'bcrypt';

const INITIAL_GLOOMIS: Array<{
  slug: string;
  name: string;
  editionNumber: number;
  priceUsd: number;
  priceCop: number;
  images: string[];
  story: string;
  materials: string;
  sourceGarment: string;
  care: string;
  color: ProductColor;
  style: ProductStyle;
  size: ProductSize;
}> = [
  {
    slug: 'grimm',
    name: 'Grimm',
    editionNumber: 7,
    priceUsd: 15,
    priceCop: 63000,
    images: ['https://picsum.photos/seed/gloomi-grimm/800/800?grayscale'],
    story:
      'Grimm fue cosido bajo una luna menguante. Su mirada fija no es enojo: es la calma de quien ya vio demasiados sustos y decidió quedarse de todos modos.',
    materials: 'Terciopelo reciclado, relleno hipoalergénico, ojos de resina.',
    sourceGarment:
      'Upcycle desde gabardina negra desestructurada — cortes donados en taller.',
    care: 'Lavado en frío en bolsa de red. No usar secadora.',
    color: 'Negro',
    style: 'Nocturno',
    size: 'M',
  },
  {
    slug: 'luna',
    name: 'Luna',
    editionNumber: 3,
    priceUsd: 15,
    priceCop: 63000,
    images: ['https://picsum.photos/seed/gloomi-luna/800/800?grayscale'],
    story:
      'Luna colecciona silencios y sombras suaves. Ideal para quienes prefieren compañía sin ruido.',
    materials: 'Felpa de algodón orgánico, costuras reforzadas.',
    sourceGarment:
      'Base textil: jersey gris perla recuperado de stock muerto de confección local.',
    care: 'Superficie con paño húmedo o lavado suave a mano.',
    color: 'Gris',
    style: 'Minimal',
    size: 'S',
  },
  {
    slug: 'nyx',
    name: 'Nyx',
    editionNumber: 11,
    priceUsd: 15,
    priceCop: 63000,
    images: ['https://picsum.photos/seed/gloomi-nyx/800/800?grayscale'],
    story:
      'Nyx es nocturna de nacimiento. Brilla con poca luz y recuerda que la oscuridad también abraza.',
    materials: 'Mezcla de lanas, detalles bordados a mano.',
    sourceGarment:
      'Mezcla morada tejida a partir de bufandas y restos de punto donados.',
    care: 'Planchar con paño protector a baja temperatura.',
    color: 'Morado',
    style: 'Nocturno',
    size: 'M',
  },
  {
    slug: 'moth',
    name: 'Moth',
    editionNumber: 14,
    priceUsd: 18,
    priceCop: 75600,
    images: ['https://picsum.photos/seed/gloomi-moth/800/800?grayscale'],
    story:
      'Moth atrae la curiosidad como una llama suave. No quema: calienta el rincón más olvidado de la habitación.',
    materials: 'Telas upcycled, relleno de fibra reciclada.',
    sourceGarment:
      'Patchwork desde camisa vintage beige y panel de cortina natural.',
    care: 'Evitar remojar los bordados; limpiar con cuidado local.',
    color: 'Hueso',
    style: 'Glitter',
    size: 'L',
  },
];

@Injectable()
export class AdminSeederService {
  private readonly log = new Logger(AdminSeederService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(HomePageSettings.name)
    private homeModel: Model<HomePageSettingsDocument>,
  ) {}

  async run(): Promise<void> {
    const email = this.config.get<string>('ADMIN_EMAIL', 'admin@gloomi.local');
    const password = this.config.get<string>('ADMIN_PASSWORD', 'cambiar-en-prod');

    let user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await this.userModel.create({
        email: email.toLowerCase(),
        passwordHash,
        role: UserRole.Admin,
      });
      this.log.log(`Usuario admin creado: ${email}`);
    } else if (user.role !== UserRole.Admin) {
      user.role = UserRole.Admin;
      if (password && this.config.get<string>('ADMIN_RESET_PASSWORD') === '1') {
        user.passwordHash = await bcrypt.hash(password, 10);
        this.log.warn(`Contraseña admin actualizada (ADMIN_RESET_PASSWORD=1)`);
      }
      await user.save();
      this.log.log(`Usuario existente promovido a admin: ${email}`);
    } else {
      if (this.config.get<string>('ADMIN_RESET_PASSWORD') === '1') {
        user.passwordHash = await bcrypt.hash(password, 10);
        await user.save();
        this.log.warn(`Contraseña admin restablecida (ADMIN_RESET_PASSWORD=1)`);
      }
      this.log.log(`Admin ya existe: ${email} (no se modifica la contraseña)`);
    }

    const count = await this.productModel.estimatedDocumentCount().exec();
    if (count === 0) {
      await this.productModel.insertMany(INITIAL_GLOOMIS);
      this.log.log(`Insertados ${INITIAL_GLOOMIS.length} Gloomis iniciales.`);
    } else {
      this.log.log(`Colección products ya tiene datos (${count}); no se insertan semillas.`);
    }

    await this.homeModel.updateOne(
      { key: 'default' },
      {
        $setOnInsert: {
          key: 'default',
          heroSource: 'product',
          heroProductSlug: 'grimm',
          heroCustomRelativeUrl: null,
          featuredSlugs: ['grimm', 'luna', 'nyx'],
        },
      },
      { upsert: true },
    );
    this.log.log('Ajustes de home verificados (hero + destacados por defecto si era nuevo).');
  }
}
