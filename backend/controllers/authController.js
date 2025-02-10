const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // Generate token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ 
      message: "User registered successfully", 
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟢 Received login request for:", email);

    // ✅ Step 1: Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("🔴 User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("🟢 User found:", user.email);

    // ✅ Step 2: Check if passwords match
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match result:", isMatch);
    console.log(password)
    console.log(user.password)

    if (!isMatch) {
      console.log("🔴 Password mismatch");
      return res.status(401).json({ message: "Invalid email or password. Check it please" });
    }

    // ✅ Step 3: Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("🟢 Login successful. Token generated.");
    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get current logged-in user (Protected Route)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



module.exports = { registerUser, loginUser, getUserProfile };
