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
import { RabbitMQ } from 'src/rabbitmq/RabbitMQ';

@WebSocketGateway(3031)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;
  private logger: Logger = new Logger('AppGateway');
  private rabbitMQ: RabbitMQ;
  constructor(private readonly appService: AppService) {
    this.rabbitMQ = new RabbitMQ();
  }

  async afterInit() {
    this.logger.log('Server Webscoket UP');
    const connected = await this.rabbitMQ.connect();
    if (connected) {
      this.rabbitMQ.setConsumer('report_marker');
      this.rabbitMQ.consumer.consume((data) => {
        this.handleMarkerQueue(data);
      });
    }
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);
    client.emit(client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect ${client.id}`);
  }

  handleMarkerQueue(data: string) {
    const messageReceived = JSON.parse(data);
    switch (messageReceived.message) {
      case 'NEW_MARKER':
        this.server
          .to(messageReceived.report.city)
          .emit('newMarker', messageReceived.report);
        break;
      case 'DELETED_MARKER':
        messageReceived.city.forEach((marker) => {
          this.server.to(marker.city).emit('deletedMarker', marker.markersId);
        });
        break;
      default:
        console.log('MESSAGE NÃO CADASTRADA');
        break;
    }
  }

  @SubscribeMessage('userLocation')
  async userLocation(client: Socket, payload: string): Promise<void> {
    const userAddress = await this.appService.geocode(payload);
    client.emit('userAddress', userAddress);
  }

  @SubscribeMessage('room')
  async cityRoom(client: Socket, city: string): Promise<void> {
    client.join(city);
  }

  @SubscribeMessage('markerCity')
  async markerCity(client: Socket, city: string): Promise<void> {
    const markers = await this.appService.markersByCity(city);
    client.emit('markers', markers);
  }
}
