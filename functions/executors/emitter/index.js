const { MongoClient } = require("mongodb");
const axios = require("axios");
async function connectToMongo() {
  try {
    const MONGO_URI = "mongodb://localhost:27017/notes-db";
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("Connected to MongoDB");
    return { client, collection: client.db().collection("reminders") };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

async function disconnectFromMongo(client) {
  try {
    await client.close();
    console.log("Closed MongoDB connection");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

const sendReminderToProcessor = async (reminder) => {
  try {
    await axios.post("http://127.0.0.1:5002/process", {
      reminder,
      time: new Date().toISOString(),
    });

    console.log("Reminder sent to the Python processor successfully.");
  } catch (error) {
    console.error("Error sending reminder to the Python processor:", error);
    throw error;
  }
};

const handle = async (context) => {
  let mongo;

  try {
    mongo = await connectToMongo();
    const remindersCollection = mongo.collection;

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const reminders = await remindersCollection
      .find({
        expired: false,
        date: {
          $gte: currentDate,
          $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
        },
      })
      .toArray();

    console.log("Fetched reminders:", reminders);

    for (const reminder of reminders) {
      console.log(reminder);
      await sendReminderToProcessor(reminder);
    }

    console.log("Emitter Knative function executed successfully.");

    return reminders;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (mongo && mongo.client) {
      await disconnectFromMongo(mongo.client);
    }
  }
};

module.exports = handle;
