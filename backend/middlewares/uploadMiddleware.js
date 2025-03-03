const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, fileExt);

    // Ensure filename is read correctly
    const customFilename = req.body.filename || originalName;
    
    console.log("Filename from request:", req.body.filename); // Debugging log
    console.log("custom file name is:", customFilename); // Debugging log
    cb(null, `${customFilename}${fileExt}`);
  }
});

// File filter to allow only specific file types (e.g., PDFs, images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDFs, JPG, and PNG files are allowed"), false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

module.exports = upload;
