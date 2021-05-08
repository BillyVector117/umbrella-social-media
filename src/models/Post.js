const mongoose = require("mongoose");
const { Schema } = mongoose;
// Post properties
const PostSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true },
  avatarCard: { type: String, required: true },
  date: { type: Date, default: Date.parse(new Date()) },
  decodedDate: { type: String },
  user: { type: String }, // Save User's ID when is created
  decodedUser: { type: String },
  comments: { type: Array },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  liked: { type: Boolean, default: false },
  likedUsers: { type: Array, default: [] },
});
module.exports = mongoose.model("Post", PostSchema);
