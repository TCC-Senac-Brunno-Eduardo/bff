import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('MAIN_SERVICE') private readonly client: ClientProxy) {}
  async onApplicationBootstrap() {
    await this.client.connect();
  }

  hello(data: string) {
    console.log('Mensagem eviada para o RabbitMQ:', data);
    this.client.emit('hello', data);
  }
}
