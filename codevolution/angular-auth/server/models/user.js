const mongoose = require("mongoose");
const Schema = (mongoose.Schema = new Schema({
  email: String,
  password: String,
}));
module.exports = mongoose.model("user", userSchema, "users");
