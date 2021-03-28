import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppGateway } from './app/app.gateway';
import { AppController } from './app/app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAIN_SERVICE',
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
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {}
