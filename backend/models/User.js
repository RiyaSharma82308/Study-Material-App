const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // User name field, required
  name: { type: String, required: true },

  // User email field, required, unique, and matches standard email format
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ 
  },

  // Password field, required (hashed before saving)
  password: { type: String, required: true },

  // Role field with specific values: admin, server, and client. Required to specify role.
  role: { 
    type: String, 
    enum: ["admin", "server", "client"], 
    required: true 
  }
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Hash password before saving if it is modified
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


// Export the User model
module.exports = mongoose.model("User", userSchema);
