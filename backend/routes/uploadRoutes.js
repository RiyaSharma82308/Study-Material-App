const express = require("express");
const path = require("path");
const upload = require("../middlewares/uploadMiddleware");
const File = require("../models/FileModel");
const fs = require("fs");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Upload a file (Allowed for: Admin, Server)
router.post("/upload", verifyToken, authorizeRoles("admin", "server"), upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { subject } = req.body; // Get subject from request body

    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    const newFile = new File({
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      subject, 
      uploadedBy: req.user.id, 
    });

    await newFile.save();
    res.json({ message: "File uploaded successfully", file: newFile });

  } catch (error) {
    res.status(500).json({ message: "File upload failed", error });
  }
});


// 📌 Fetch all uploaded files (Allowed for: Admin, Server, Client)
router.get("/files", verifyToken, authorizeRoles("admin", "server", "client"), async (req, res) => {
  try {
    const files = await File.find();
    
    const formattedFiles = files.map(file => ({
      id: file._id,
      title: file.filename,
      subject: file.subject,
      uploadedBy: file.uploadedBy,
      fileUrl: `http://localhost:5000/api/files/download/${file.filename}`
    }));

    res.json(formattedFiles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files", error });
  }
});



// 📌 File download route (Allowed for: All roles)
router.get("/download/:filename", verifyToken, authorizeRoles("admin", "server", "client"), (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(500).json({ message: "File not found or error in downloading" });
    }
  });
});

// 📌 Delete a file (Allowed for: Admin OR Server who uploaded it)
router.delete("/files/:id", verifyToken, authorizeRoles("admin", "server"), async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found in database" });
    }

    // Admin can delete any file, but a server can only delete their own files
    if (req.user.role !== "admin" && file.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this file" });
    }

    // Absolute path to the file
    const filePath = path.join(__dirname, "../", file.filepath);

    // Check if file exists in the file system
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.log("File not found in uploads folder:", filePath);
    }

    // Remove file from the database
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: "File deleted successfully" });

  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ message: "Failed to delete file", error: error.message });
  }
});


// seaarching for materials based on  subject
router.get("/files/search", verifyToken, authorizeRoles(["admin", "server", "client"]), async (req, res) => {
  try {
    const { subject } = req.query; // Get subject from query params

    if (!subject) {
      return res.status(400).json({ message: "Subject is required for searching" });
    }

    const files = await File.find({ subject });

    if (files.length === 0) {
      return res.status(404).json({ message: "No files found for this subject" });
    }

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files", error });
  }
});


module.exports = router;
