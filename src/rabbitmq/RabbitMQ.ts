import { connect as amqplibConect, Connection } from 'amqplib/callback_api';
import { Consumer } from './Consumer';
import { Publisher } from './Publisher';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMQ {
  private url: string = process.env.CLOUDAMQP_URL;
  private conn: Connection;
  public consumer: Consumer;
  public publisher: Publisher;

  async connect(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      amqplibConect(this.url, async (err, conn) => {
        if (err) return reject(err);
        this.conn = conn;
        resolve(conn);
      });
    });
  }

  setConsumer(queue) {
    this.consumer = new Consumer(this.conn, queue);
  }
  setPublisher(queue) {
    this.publisher = new Publisher(this.conn, queue);
  }

  getConnection(): Connection {
    return this.conn;
  }
}
