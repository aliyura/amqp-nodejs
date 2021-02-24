const MongoClient = require('mongodb').MongoClient;
const config = {
    url: 'mongodb+srv://test:test123@cluster0.qulve.gcp.mongodb.net/pangaeadb?retryWrites=true&w=majority',
    db: 'pangaeadb',
    collection: 'subscriptions'
}

module.exports = class DatabaseService {

    connect(callback) {
        MongoClient.connect(config.url, function (err, client) {
            if (err)  throw err
            console.log("Connected");
            callback(client);
            client.close();
        });
    }

    saveSubscription(topic, url, callback) {
        this.connect((client) => {
            const db = client.db(config.db);
            const collection = db.collection(config.collection);
            // save subsccription
            collection.insertOne({ topic: topic, subscriber: url }, function (err, result) {
                if (err)  throw err
                callback(result)
            });
        });
    }

    getSubscription(url, callback) {
        this.connect((client) => {
            const db = client.db(config.db);
            const collection = db.collection(config.collection);
            // get subsccription by user endpoint
            collection.findOne({ subscriber: url }, function (err, result) {
                if (err)  throw err
                callback(result)
            });
        });
    }
}


