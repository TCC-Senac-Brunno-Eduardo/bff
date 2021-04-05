import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  await app.listen(process.env.PORT, () => {
    console.log(`App is listening on http://localhost:${process.env.PORT}`);
  });
}
bootstrap();
