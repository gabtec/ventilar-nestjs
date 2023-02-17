import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

// import setConfig from './config/app.config';

// const configs = setConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('VentilAR API')
    .setDescription('The VentilAR App Rest API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = configService.get('port');
  await app.listen(PORT, async () => {
    // console.log(`Server listening on PORT: ${PORT}`);
    console.log(`Server listening at: ${await app.getUrl()}`);
    console.log(`Server listening in: "${configService.get('mode')}" mode`);
  });
}

bootstrap();
