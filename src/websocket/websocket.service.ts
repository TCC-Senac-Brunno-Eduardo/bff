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

@WebSocketGateway()
export class WebsocketService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger('WebsocketService');

  //constructor(@Inject('MAIN_SERVICE') private readonly client: ClientProxy) {}

  afterInit(server: Server) {
    this.logger.log(server.path());
    this.logger.log('Init Socket');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);
    //this.client.emit('hello', `Client connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect ${client.id}`);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('messageToClient', payload);
  }
}
