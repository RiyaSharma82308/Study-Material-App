const bcrypt = require("bcryptjs");

const enteredPassword = "123456"; // The password you entered in login
const storedHashedPassword = "$2a$10$JXvPV.JHufQTkudmqe58..Mg/OBYFio/uZFk2JVVDWVTySVypWM4S"; // Your stored hash

bcrypt.compare(enteredPassword, storedHashedPassword).then((match) => {
  console.log("🔍 Password Match:", match);
});
