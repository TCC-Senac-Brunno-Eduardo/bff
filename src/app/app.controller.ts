import { Controller, Get, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  Payload,
  MessagePattern,
  RmqContext,
} from '@nestjs/microservices';
@Controller()
export class AppController {
  constructor(@Inject('MAIN_SERVICE') private readonly client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  @Get()
  getHello(): string {
    this.client.emit('hello', 'Hello');
    return 'Hello';
  }

  @MessagePattern('hello')
  getNotifications(@Payload() data, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);
    console.log(`message: ${data}`);
  }
}
