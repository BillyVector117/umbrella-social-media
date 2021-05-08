const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;
// Comment properties
const CommentSchema = new Schema({
  image_id: { type: ObjectId },
  email: { type: String },
  username: { type: String },
  userId: { type: ObjectId },
  comment: { type: String },
  gravatar: { type: String },
  date: { type: Date, default: Date.parse(new Date()) },
});
module.exports = mongoose.model("Comment", CommentSchema);
