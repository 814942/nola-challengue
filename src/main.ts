import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { LoggerService } from './logger/logger.service';

import { HttpExceptionFilter } from './commons/filters/http-exception.filter';

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

  // Global filter
  const logger = await app.resolve(LoggerService);
  app.useGlobalFilters(new HttpExceptionFilter(logger));

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

  try {
    await app.listen(process.env.PORT || 3000);
    console.log(`App listening on port ${port}`);
  } catch (err) {
    console.error('💥 Error al levantar la app:', err);
  }
  // await app.listen(port!, () => console.log(`Application running on port ${port}`));
}
bootstrap();
