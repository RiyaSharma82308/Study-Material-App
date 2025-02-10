require("dotenv").config();  // Explicitly set path

console.log("🔍 Debug: MONGO_URI =", process.env.MONGO_URI);  // Debug log

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
const path = require("path");

const app = express();

// Middleware

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB()

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Authentication routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/files", uploadRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));







