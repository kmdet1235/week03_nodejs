const { Router } = require("express");
const commentRouter = Router();
const { Comment } = require("../schemas/comment");
const { Post } = require("../schemas/post");
// const { isValidObjectId } = require("mongoose");
// const { ObjectId } = require("bson");

commentRouter.post("/:postId", async (req, res) => {
  try {
    const postId = req.params._postId;
    const { user, password, content } = req.body;
    if (!user) res.status(400).send({ err: "user name is required" });
    if (!password) res.status(400).send({ err: "password is required" });
    if (typeof content !== "string")
      res.status(400).send({ err: "content is required" });

    const comment = new Comment({ postId, ...req.body });
    await comment.save({ timestamps: { updatedAt: false } });
    return res.send({ message: "댓글을 생성했습니다." });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }
});

commentRouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find(
      { postId: postId },
      {
        postId: false,
        password: false,
        content: false,
        __v: false,
      }
    ).sort({ createdAt: -1 });

    return res.send({ comments });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

commentRouter.put("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { password, content } = req.body;
    const [comment_pw] = await Comment.find({ _id: commentId });
    if (password !== comment_pw.password)
      res.status(400).send({ err: "password mismached" });
    if (typeof content !== "string")
      res.status(400).send({ err: "content is required" });

    const comment = await Comment.findByIdAndUpdate(
      { _id: commentId },
      { content },
      { new: true }
    );
    return res.send({ message: "댓글을 수정했습니다." });
  } catch (err) {
    console.log(err);
  }
});

commentRouter.delete("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { password } = req.body;
    const [comment_pw] = await Comment.find({ _id: commentId });
    if (password !== comment_pw.password)
      return res.status(400).send({ err: "password mismatched" });
    const comment = await Comment.findByIdAndDelete({ _id: commentId });
    return res.send({ message: "댓글을 삭제했습니다." });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { commentRouter };
