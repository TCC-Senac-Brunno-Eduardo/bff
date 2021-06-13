import { Connection } from 'amqplib/callback_api';

export class Publisher {
  private message: string;
  constructor(private conn: Connection = conn, private queue: string = queue) {}

  private openChannel(err, ch) {
    if (err != null) return console.log('err', err);
    ch.assertQueue(this.queue, { durable: true });
    ch.sendToQueue(this.queue, Buffer.from(this.message));
    console.log(' [x] Sent %s', this.message);
  }

  publish(message: string) {
    this.message = message;
    this.conn.createChannel((err, ch) => this.openChannel(err, ch));
  }

  getQueue(): string {
    return this.queue;
  }
}
