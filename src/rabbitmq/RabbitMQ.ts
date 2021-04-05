import { connect as amqplibConect, Connection } from 'amqplib/callback_api';

export class RabbitMQ {
  private url: string;
  private conn: Connection;

  constructor(private queue: string = queue) {
    this.url = process.env.CLOUDAMQP_URL;
    this.connect();
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
