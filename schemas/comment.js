const { Schema, model, Types } = require("mongoose");

const CommentSchema = new Schema(
  {
    postId: {
      type: Types.ObjectId,
      required: true,
      ref: "post",
    },
    user: { type: String, required: true },
    password: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = model("comment", CommentSchema);

module.exports = { Comment };
