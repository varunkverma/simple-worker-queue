const amqp = require("amqplib/callback_api");

// creating connection
amqp.connect("amqp://localhost", (err0, connection) => {
  if (err0) {
    throw err0;
  }

  // creating channel
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }

    // declare queue
    const queue = "task_queue";

    // This makes sure the queue is declared before attempting to consume from it
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.prefetch(1);

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      (msg) => {
        const secs = msg.content.toString().split(".").length - 1;

        console.log(`[<=] Received: ${msg.content.toString()}`);

        setTimeout(() => {
          console.log("[*] Task completed");
          // sending acknowledgement

          channel.ack(msg);
        }, secs * 1000);
      },
      {
        // automatic acknowldgement mode, in this case consumer doesn't send a manual acknowledgment to the queue
        // noAck: true,

        //manual acknowledgment mode, if you kill a worker using CTRL+C while it was processing a message, nothing will be lost.
        noAck: false,
      }
    );
  });
});
