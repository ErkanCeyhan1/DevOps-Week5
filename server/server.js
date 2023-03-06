const express = require('express');
const amqp = require('amqplib');

async function start() {
    const app = express();
    const port = 3000;

    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();
    await channel.assertQueue('logs', { durable: true});


    app.get('/', (req, res) => {
        const message = { text: 'Hi there!'};

        channel.sendToQueue('logs', Buffer.from(JSON.stringify(message)), {
            contentType: 'application/json',
            persistent: true
        });

        console.log('Message has been send to Messagebus (v3)');
        res.json({ success: true});
    });


    app.listen(port, () => {
        console.log(`Revised Server APP (v2) is listening on http://localhost:${port}`);
    })


}

start();
