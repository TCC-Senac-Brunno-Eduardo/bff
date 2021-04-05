import { Injectable } from '@nestjs/common';
import { RabbitMQ } from 'src/rabbitmq/RabbitMQ';
import { Publisher } from 'src/rabbitmq/Publisher';
import { Consumer } from 'src/rabbitmq/Consumer';

@Injectable()
export class AppService {
  private rabbitMQ: RabbitMQ;
  private rabbitMQPublisher: Publisher;
  private rabbitMQConsumer: Consumer;

  constructor() {
    this.rabbitMQ = new RabbitMQ('main_queue');
  }

  async hello(data: string) {
    this.rabbitMQPublisher = new Publisher(
      this.rabbitMQ.getConnection(),
      this.rabbitMQ.getQueue(),
    );

    this.rabbitMQConsumer = new Consumer(
      this.rabbitMQ.getConnection(),
      this.rabbitMQ.getQueue(),
    );

    this.rabbitMQPublisher.publisher(data);
    this.rabbitMQConsumer.consumer();
  }
}
