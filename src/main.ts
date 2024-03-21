import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  const port = process.env.PORT
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specified headers
  });
  await app.listen(port);
}
bootstrap();

