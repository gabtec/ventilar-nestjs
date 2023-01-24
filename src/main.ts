import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import setConfig from './config/app.config';

const configs = setConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  await app.listen(configs.server.PORT);

  console.log(`Server listening on PORT: ${configs.server.PORT}`);
}

bootstrap();
