const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure correct path

// Middleware to verify authentication token
const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied. Token missing or malformed." });
    }

    token = token.split(" ")[1]; // Extract actual token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user; // Attach full user object
    next();
  } catch (error) {
    console.error("JWT Error:", error); // Log error for debugging

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Access denied." });
    } else {
      return res.status(500).json({ message: "Internal server error during authentication." });
    }
  }
};

// Middleware to check if the user has the required role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission" });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
