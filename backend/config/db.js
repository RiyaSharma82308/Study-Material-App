const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Debugging: Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error("❌ Error: MONGO_URI is not defined. Check your .env file.");
      throw new Error("MONGO_URI is missing! Please define it in your .env file.");
    }

    // MongoDB connection
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit the process on failure
  }
};

module.exports = connectDB;
