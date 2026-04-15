import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseStatusInterceptor } from './Common/Interceptors/response-status.interceptor';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { i18nInit } from './Config/i18n.config';
import middleware from 'i18next-http-middleware';
import i18next from './Config/i18n.config';

async function bootstrap() {
  await i18nInit();
  const app = await NestFactory.create(AppModule);

  app.use(middleware.handle(i18next));
  app.use(helmet());

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalInterceptors(new ResponseStatusInterceptor());

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();