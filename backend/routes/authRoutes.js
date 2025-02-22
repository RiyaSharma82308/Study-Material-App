const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware"); 

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", async (req, res, next) => {
    try {
        console.log("Login request received:", req.body); // Debugging

        await loginUser(req, res);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get user profile
router.get("/profile", verifyToken, getUserProfile);

// Protected dashboard route
router.get("/dashboard", verifyToken, (req, res) => {
    res.json({ message: "Welcome to the dashboard!", user: req.user });
});

// Upload a file (Only logged-in users)
router.post("/upload", verifyToken, upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ message: "File uploaded successfully", file: req.file });
});

module.exports = router;
