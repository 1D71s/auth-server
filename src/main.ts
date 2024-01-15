import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as fileUpload from 'express-fileupload';

async function bootstrap() {
  const PORT = process.env.PORT || 5000 
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  //app.use(fileUpload());

  await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}

bootstrap();