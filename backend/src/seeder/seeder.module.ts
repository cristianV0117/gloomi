import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { HomePageSettings, HomePageSettingsSchema } from '../home/schemas/home-page-settings.schema';
import { AdminSeederService } from './admin-seeder.service';

const mongoUri =
  process.env.MONGODB_URI ??
  process.env.MONGO_URI ??
  'mongodb://127.0.0.1:27017/gloomi';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(mongoUri),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: HomePageSettings.name, schema: HomePageSettingsSchema },
    ]),
  ],
  providers: [AdminSeederService],
})
export class SeederModule {}
