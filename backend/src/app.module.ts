import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { CustomizationsModule } from './customizations/customizations.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { BrandingModule } from './branding/branding.module';
import { HomeModule } from './home/home.module';

const mongoUri =
  process.env.MONGODB_URI ??
  process.env.MONGO_URI ??
  'mongodb://127.0.0.1:27017/gloomi';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(mongoUri),
    AuthModule,
    ProductsModule,
    BrandingModule,
    HomeModule,
    ContactModule,
    CustomizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
