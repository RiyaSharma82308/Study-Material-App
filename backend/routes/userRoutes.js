const express = require("express");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");
const User = require("../models/User"); // Import User model
const FileModel = require("../models/FileModel");


const router = express.Router();

// 📌 Admin: Get all users
router.get("/admin/users", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Server: Add study material
router.post("/materials", verifyToken, authorizeRoles("server"), async (req, res) => {
    try {
        const { filename, filepath, mimetype, size } = req.body;

        const newFile = new FileModel({
            filename,
            filepath,
            mimetype,
            size,
            uploadedBy: req.user.id, // Attach the logged-in user
        });

        await newFile.save();
        res.status(201).json({ message: "File uploaded successfully", file: newFile });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


// 📌 Client: Get study materials
router.get("/materials", verifyToken, authorizeRoles("client"), async (req, res) => {
    try {
        const files = await FileModel.find().populate("uploadedBy", "name email");
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router;
