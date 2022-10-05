const { Schema, model, Types } = require("mongoose");

const PostSchema = new Schema(
  {
    user: { type: String, required: true },
    password: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = model("post", PostSchema);

module.exports = { Post };
