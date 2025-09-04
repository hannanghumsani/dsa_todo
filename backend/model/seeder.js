const mongoose = require("mongoose");
const Topics = require("./topicSchema");
const topicsData = require("./data");

require("dotenv").config();

const seedTopics = async () => {
  try {
    await Topics.deleteMany({});
    console.log("Existing topics data cleared");
    // Insert the dummy data
    await Topics.insertMany(topicsData);
    console.log("Successfully seeded 50 topics into the database");
  } catch (error) {
    console.error("Error seeding topics data:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

module.exports = seedTopics;
