const amqplib = require('amqplib');
const {MESSAGE_BROKER_URL, EXCHANGE_NAME} = require('../config/server-config')
 
const createChannel = async() => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
         channel.assertExchange(EXCHANGE_NAME, 'direct', false);
        return channel;
    } catch (error) {
        throw error;
    }
}

const subscribeMessage = async(channel, service, binding_key) => {
    try {
        const applicationQueue = await channel.assertQueue(QUEUE_NAME);
        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);
        channel.consume(applicationQueue.queue, (message) => {
            console.log('recieved msg');
            console.log(message.content.toString());
            channel.ack(message);
        }) 
    } catch (error) {
        throw error;
    }
    
}

const publishMessage = async(channel, binding_key, message) => {
    try {
        await channel.assertQueue('QUEUE_NAME');
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (error) {
        
    }
}

module.exports = {
    createChannel, 
    publishMessage,
    subscribeMessage
}