const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { userData, thoughtData } = require("./data");

async function seedDatabase() {
  try {
    await User.deleteMany({});
    await Thought.deleteMany({});

    const users = await User.insertMany(userData);

    for (const thought of thoughtData) {
      const user = users.find((u) => u.username === thought.username);
      thought.userId = user._id;
    }
    await Thought.insertMany(thoughtData);

    console.log("Db seeded successfully");
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    connection.close();
  }
}

seedDatabase();
