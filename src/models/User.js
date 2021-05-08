const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcryptjs = require("bcryptjs");

// User properties
const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  imagePath: { type: String, default: "/assets/newUser.jpg" },
  date: { type: Date, default: Date.now },
});

// Encrypt password
UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  const hash = bcryptjs.hash(password, salt);
  return hash;
};
// Validate Password
UserSchema.methods.matchPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};
// Export Schema/Model as 'User'
module.exports = mongoose.model("User", UserSchema);
