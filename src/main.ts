import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* The line `app.setGlobalPrefix('api');`
  in the provided TypeScript code is setting a global prefix
  for all routes in the NestJS application. In this case,
  the global prefix is set to 'api', which means that
  all routes defined in the application will be prefixed with '/api'. */

  app.setGlobalPrefix('api/v2');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
