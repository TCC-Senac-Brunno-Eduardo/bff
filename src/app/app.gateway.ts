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

@WebSocketGateway(3031)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger('AppGateway');

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
    this.server.emit('messageToClient', 'Hello from Client Server');
  }
}
