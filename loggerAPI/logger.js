const fs = require('fs');
const amqp = require('amqplib');

async function start() {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();
    await channel.assertQueue('logs', { durable: true});
    await channel.prefetch(1);

    channel.consume('logs', message => {
        console.log('Received message from messagebus');
        fs.appendFile('', message.content.toString() + '\n', err => channel.ack(message));
    })
}

start();
