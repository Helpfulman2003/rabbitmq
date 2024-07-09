const amqp = require('amqplib')
const amqp_url_docker = 'amqp://localhost:5672'

const postMessage = async(msg) => {
   try {
     //1 create connect
     const conn = await amqp.connect(amqp_url_docker)
     // 2 create channel
     const channel = await conn.createChannel()
     // 3 create Exchange 
     const nameExchange = 'message'
     await channel.assertExchange(nameExchange, 'fanout', {
         durable: true
     })
     // 4 publish message
    channel.publish(nameExchange, '', Buffer.from(msg))
     // 5 close
    //  setTimeout(() => {
    //     conn.close()
    //     process.exit(0)
    //  }, 2000)
   } catch (error) {
        console.log(error);
   }
}

postMessage("Hello")