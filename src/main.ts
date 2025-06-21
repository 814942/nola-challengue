import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Logger
  app.useLogger(new Logger());

  // env
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const whitelist = configService.get<string>('whitelist');

  // CORS config
  app.enableCors({
    origin: (origin, callback) => {
      const whitelistParsed = whitelist ? whitelist.split(',') : [];
      if (whitelistParsed.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, Access-Control-Allow-Origins',
    credentials: true
  });

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    enableDebugMessages: true,
    transform: true
  }));

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Nola challengue')
    .setDescription('Documentacion oficial de la API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'apiKey',
      in: 'header',
      name: 'Autorización',
      description: 'Agregar el access token generado en el Registro o Inicio de sesion.'
    })
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port!, () => console.log(`Application running on port ${port}`));
}
bootstrap();
