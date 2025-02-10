const express = require("express");
const path = require("path");
const upload = require("../middlewares/uploadMiddleware");
const File = require("../models/FileModel");

const router = express.Router();

// 📌 File upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newFile = new File({
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    await newFile.save();

    res.json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error });
  }
});

// 📌 Fetch all uploaded files
router.get("/files", async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files", error });
  }
});

// 📌 File download route
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(500).json({ message: "File not found or error in downloading" });
    }
  });
});

module.exports = router;
