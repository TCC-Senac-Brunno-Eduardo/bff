import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://ulhxpywr:sFPnMw18EKWZTceAKtt1V8Bd2E-rL81O@jackal.rmq.cloudamqp.com/ulhxpywr',
      ],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT, () => {
    console.log(`App is listening on http://localhost:${process.env.PORT}`);
  });
}
bootstrap();
