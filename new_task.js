const amqp = require("amqplib/callback_api");

// creating a connection
amqp.connect("amqp://localhost", (err0, connection) => {
  if (err0) {
    throw err0;
  }

  // creating a channel
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }

    // declaring queue
    const queue = "task_queue";

    const msg = process.argv.slice(2).join(" ") || "Hello World!";

    // register queue
    channel.assertQueue(queue, {
      durable: true,
    });

    // sending message to queue
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });

    console.log(`[=>] send: '${msg}'`);
  });

  // closing the connection and exiting
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
