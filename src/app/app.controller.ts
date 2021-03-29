import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index() {
    return '/';
  }

  @MessagePattern('hello')
  getNotifications(@Payload() data: string, @Ctx() context: RmqContext) {
    console.log('Mensagem recebida do RabbitMQ:', data);
  }
}
