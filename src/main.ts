import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  /* The line `app.setGlobalPrefix('api');`
  in the provided TypeScript code is setting a global prefix
  for all routes in the NestJS application. In this case,
  the global prefix is set to 'api', which means that
  all routes defined in the application will be prefixed with '/api'. */

   // Establece el prefijo global
   const globalPrefix = 'api/v2';
   app.setGlobalPrefix(globalPrefix)

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Pokedex API')
    .setDescription('Documentación de la API de Pokedex')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Configura la ruta de Swagger para incluir el prefijo global
  SwaggerModule.setup(`${globalPrefix}/swagger`, app, document);

  // Configuración global de validaciones
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.enableCors();

  await app.listen(port);
  console.log(`APP RUNNING ON PORT: ${port}`);
  console.log(`Swagger is running on: http://localhost:${port}/${globalPrefix}/swagger`);
}
bootstrap();
