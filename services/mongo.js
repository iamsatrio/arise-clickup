const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config');

const uri = `mongodb+srv://${config.mongo_user}:${config.mongo_pass}@${config.mongo_server}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function insertLogs(logs) {
    try {
        await client.connect();
        const dbName = "majoo_clickup_logs";
        const collectionName = "logs";

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const insertLogs = await collection.insertOne(logs)
        return insertLogs;
    } finally {
        await client.close();
    }
}

module.exports = {
    insertLogs
}
