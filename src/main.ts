//main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  const port = process.env.PORT
  app.enableCors({
    origin: 'http://localhost:3000', 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  });
  await app.listen(port);
}
bootstrap();

