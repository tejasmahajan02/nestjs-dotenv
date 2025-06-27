import { loadEnvironmentConfig } from './config/environment.config';
loadEnvironmentConfig();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.NODE_PORT ?? 5000;
  await app.listen(port);
  Logger.log(`This application is running on: ${await app.getUrl()}`);
}
bootstrap();
