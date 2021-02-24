const amqp = require('amqplib');
const endPoint = 'amqp://localhost';

module.exports = class NotificationService {

     async push(topic, message) {
        return amqp.connect(endPoint).then(function (conn) {
            return conn.createChannel();
        }).then(function (ch) {
            return ch.assertQueue(topic, {
                durable: false
            }).then(function (ok) {
                return ch.sendToQueue(topic, Buffer.from(JSON.stringify(message)));
            });
        }).catch(function (err) {
            return err;
        });
        this.close
    }

     listen(topic, callback) {
        amqp.connect(endPoint).then(function (conn) {
            return conn.createChannel();
        }).then(function (ch) {
            return ch.assertQueue(topic, {
                durable: false
            }).then(function (ok) {
                return ch.consume(topic, function (msg) {
                    if (msg !== null) {
                        console.log(msg.content.toString());
                        callback(JSON.parse(msg.content.toString()));
                    } else {
                        callback('No new update');
                    }
                });
            });
        }).catch(function (err) {
            console.log(err);
            return err;
        });
    }

}


