import { Connection } from 'amqplib/callback_api';

export class Consumer {
  constructor(private conn: Connection = conn, private queue: string = queue) {}
  consume(cb) {
    const queue = this.queue;
    this.conn.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(queue, {
        durable: false,
      });

      console.log('[*] Waiting for messages in %s.', queue);

      channel.consume(
        queue,
        function (msg) {
          console.log('[x] Received %s', msg.content.toString());
          cb(msg.content.toString());
        },
        {
          noAck: true,
        },
      );
    });
  }

  getQueue(): string {
    return this.queue;
  }
}
