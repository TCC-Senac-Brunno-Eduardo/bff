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
  constructor(private queue: string = queue) {
    this.connect().then((conn) => {
      this.consumer = new Consumer(conn, queue);
      this.publisher = new Publisher(conn, queue);
    });
  }

  private async connect(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      amqplibConect(this.url, async (err, conn) => {
        if (err) return reject(err);
        this.conn = conn;
        resolve(conn);
      });
    });
  }

  getConnection(): Connection {
    return this.conn;
  }

  getQueue(): string {
    return this.queue;
  }
}
