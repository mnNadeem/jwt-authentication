import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT || 8081);
  console.log(`Server is up on ${process.env.APP_PORT}`);
}
bootstrap();
