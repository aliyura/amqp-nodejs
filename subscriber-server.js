const express = require('express');
const app = express();
const port = 9000;

const NotificationService = require('./services/notification-service')
const DatabaseService = require('./services/database-service')
var notificator = new NotificationService();
var db = new DatabaseService();


app.use(express.json());
app.listen(port, () => {
    console.log(`Pangaea Subscriber Listining port ${port}`)
})

function checkMessages(topic) {
    notificator.listen(topic, (message) => {
        console.log(message);
    });
}
//the notification is received if user call his endpoint as well
app.get('/:userId', (req, res, next) => {
    let userId = req.params.userId
    let url = `http://localhost:${port}/${userId}`;
    console.log(url);

    //get the saved subscribed topic
    db.getSubscription(url, (document) => {
        console.log(document.topic);

        //checking messages for the particular topic on AMQP
        setInterval(() => {
            checkMessages(document.topic);
        }, 3000);

        res.send({
            topic: document.topic,
            status: "listening new update on console"
        });
    });
});

app.post('/subscribe/:topicId', (req, res) => {
    let topicId = req.params.topicId
    let url = req.body.url;

    //saving subscription details for future uses, so one doen't need to subscribe again
    db.saveSubscription(topicId, url, (response) => {

        //checking messages for the particular topic on AMQP
        setInterval(() => {
            checkMessages(topicId);
        }, 3000);

        res.send({
            topic: topicId,
            url: url
        });
    });
});

app.use(function (req, res, next) {
    res.status(404).send({
        statusCode: res.statusCode,
        message: "Not found"
    });
});


