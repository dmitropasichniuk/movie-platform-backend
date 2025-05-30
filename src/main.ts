import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.BACKEND_PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);

  // serve static files
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
}
bootstrap();
