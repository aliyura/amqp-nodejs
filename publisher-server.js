const express = require('express');
const app = express();
const port = 8000;

const NotificationService = require('./services/notification-service')
var notificator = new NotificationService();

app.use(express.json());
app.listen(port, () => {
    console.log(`Pangaea Publisher Listining port ${port}`)
})

app.post('/publish/:topicId', (req, res) => {
    let topicId = req.params.topicId
    let body = req.body;
    console.log(req.body);

    let topic = {
        topic: topicId,
        body: body
    };
    console.log('sending...');
    notificator.push(topicId,body).then((response)=>{
        console.log(response);
        console.log('Message sent ');
    });
    res.send(topic);
});

app.use(function (req, res, next) {
    res.status(404).send({
        statusCode: res.statusCode,
        message: "Not found"
    });
});


