import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  
  // Configuración de Swagger
  const config = new DocumentBuilder()
  .setTitle('Safereturn API')
  .setDescription('API for Safereturn')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const app: INestApplication = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  
  const cors = require('cors');
  app.use(cors());

  await app.listen(3000);
}
bootstrap();
