import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

// import setConfig from './config/app.config';

// const configs = setConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors({
    // origin: 'http://localhost:3000',
    origin: true,
    credentials: true,
  }); // WARNING: fetch API requires 'PATCH' not 'patch'
  app.use(helmet());
  app.use(cookieParser()); // to handle refreshToken

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('VentilAR API')
    .setDescription('The VentilAR App Rest API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  const PORT = configService.get('API_SRV_PORT');

  await app.listen(PORT, async () => {
    if (configService.get('NODE_ENV') === 'development') {
      console.log(`Server listening at: ${await app.getUrl()}`);
      console.log(
        `Server listening in: "${configService.get('NODE_ENV')}" mode`,
      );
      console.log(
        `Database name [${configService.get(
          'DB_DRIVER',
        )}]: "${configService.get('DB_NAME')}"`,
      );
    }
  });
}

bootstrap();
