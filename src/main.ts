import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`Listening on ${process.env.PORT}`);
  await app.listen(process.env.PORT);
}
bootstrap();
