import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';

@WebSocketGateway(3031)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger('AppGateway');
  constructor(private readonly appService: AppService) {}

  afterInit(server: Server) {
    this.logger.log('Init Socket');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);
    client.emit(client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect ${client.id}`);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: string): void {
    console.log('Mensagem recebida WS: ', payload);
    this.appService.hello('Oi RabbitMQ');
    const msgResponseWS = 'Hello from Server';
    this.server.emit('messageToClient', msgResponseWS);
    console.log('Mensagem enviada pro WS: ', msgResponseWS);
  }
}
