const amqp = require("amqplib");
const amqp_url_docker = "amqp://localhost:5672";

const sendMessage = async () => {
  try {
    // 1 create connect
     const conn = await amqp.connect(amqp_url_docker);
    // 2 create channel
    const channel = await conn.createChannel();
    // 3 create Exchange
    const nameExchange = "message";
        await channel.assertExchange(nameExchange, "fanout", { // '' là tên của queue
            durable: true,
        });
    // 4 create queue để nhận message từ bên kia publish qua
    const { queue } = await channel.assertQueue("", { exclusive: true }); //  queue là name của queue, exclusion xóa message khi không có kết nối đến rabbitMQ
    // 5 bingding
    // cần gửi tin từ exchange đến queue thì mối quan hệ của chúng gọi là bingding
    await channel.bindQueue(queue, nameExchange, ""); // '' là điều kiện
    // 6. Consume messages
    await channel.consume(queue, (msg) => {
        if (msg !== null) {
          console.log("msg", msg.content.toString());
          channel.ack(msg); // Acknowledge the message
        }
      });
  } catch (error) {
    console.log(error);
  }
};

sendMessage()



