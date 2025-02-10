const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");
const protect = require("../middlewares/authMiddleware");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile); // Protected route
// Protected route (only accessible with a valid token)
router.get("/dashboard", protect, (req, res) => {
    res.json({ message: "Welcome to the dashboard!", user: req.user });
  });

  // Upload a file (Only logged-in users)
router.post("/upload", protect, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ message: "File uploaded successfully", file: req.file });
});

module.exports = router;







