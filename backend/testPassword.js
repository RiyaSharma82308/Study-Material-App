const bcrypt = require("bcrypt");

const plainPassword = "123456";
const storedHash = "$2a$10$Y3bwrazt11OGSTN6NtCTOeMZUxdQIYrqosTM1LPH3HoqSf.oBRbq2"; // Replace with the exact hash from DB

bcrypt.compare(plainPassword, storedHash, (err, result) => {
  if (err) {
    console.error("❌ Error during comparison:", err);
  } else {
    console.log("🔍 Password match result:", result);
  }
});
