const mongooseUser = require("mongoose");

const User = mongooseUser.model("User", {
  name: String,
  email: String,
  password: String,
});

module.exports = User;
