import { Injectable } from '@nestjs/common';
import { RabbitMQ } from 'src/rabbitmq/RabbitMQ';

@Injectable()
export class AppService {
  private rabbitMQ: RabbitMQ;
  private rabbitMQ2: RabbitMQ;

  constructor() {
    this.rabbitMQ = new RabbitMQ('main_queue');
    this.rabbitMQ2 = new RabbitMQ('main_queue2');
  }

  async hello(data: string) {
    this.rabbitMQ.publisher.publish(data);
    this.rabbitMQ.consumer.consume();
    this.rabbitMQ2.publisher.publish(data);
  }
}
