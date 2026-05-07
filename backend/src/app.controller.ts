import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly mongoose: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Comprueba que la API responde y el estado de MongoDB (para Compass / diagnóstico). */
  @Get('health')
  health() {
    const readyState = this.mongoose.readyState;
    const labels = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const mongo = labels[readyState] ?? 'unknown';
    return {
      ok: true,
      mongo,
      mongoReadyState: readyState,
      database: this.mongoose.db?.databaseName ?? null,
    };
  }
}
