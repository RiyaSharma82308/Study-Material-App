const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    filename: String,
    filepath: String,
    mimetype: String,
    size: Number,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to user
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
