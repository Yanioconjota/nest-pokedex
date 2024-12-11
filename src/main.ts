import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  /* The line `app.setGlobalPrefix('api');`
  in the provided TypeScript code is setting a global prefix
  for all routes in the NestJS application. In this case,
  the global prefix is set to 'api', which means that
  all routes defined in the application will be prefixed with '/api'. */

  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));

  app.enableCors();

  await app.listen(port);
  console.log(`APP RUNNING ON PORT: ${port}`, process.env.MONGODBDEV);
}
bootstrap();
