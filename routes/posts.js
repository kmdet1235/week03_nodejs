const { Router } = require("express");
const postRouter = Router();
const { commentRouter } = require("./comments");
const { isValidObjectId } = require("mongoose");
const { Post } = require("../schemas/post");

postRouter.post("/", async (req, res) => {
  try {
    const { user, password, title, content } = req.body;
    if (!user) res.status(400).send({ err: "user name is required" });
    if (!password) res.status(400).send({ err: "password is required" });
    if (typeof title !== "string")
      res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      res.status(400).send({ err: "content is required" });

    const post = new Post({ ...req.body, user });
    await post.save({ timestamps: { updatedAt: false } });
    return res.send({ message: "게시글을 생성했습니다." });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find(
      {},
      { password: false, content: false, __v: false }
    ).sort({ createdAt: -1 });
    return res.send({ posts });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

postRouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!isValidObjectId(postId))
      res.status(400).send({ err: "postId is invalid" });

    const post = await Post.findOne(
      { _id: postId },
      { password: false, __v: false }
    );
    return res.send({ post });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

postRouter.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!isValidObjectId(postId))
      res.status(400).status.send({ err: "postId is invalid" });

    const { password, title, content } = req.body;
    const [post_pw] = await Post.find({ _id: postId });
    if (password !== post_pw.password)
      res.status(400).send({ err: "password mismatched" });
    if (typeof title !== "string")
      res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      res.status(400).send({ err: "content is required" });

    const post = await Post.findByIdAndUpdate(
      { _id: postId },
      { title, content },
      { new: true } // 수정된 게시물 상태로 입력되게 하는 식별자
    );
    return res.send({ message: "게시글을 수정하였습니다." });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

postRouter.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { password } = req.body;
    const [post_pw] = await Post.find({ _id: postId });
    if (password !== post_pw.password)
      return res.status(400).send({ err: "Invalid password" });
    const post = await Post.findByIdAndDelete({ _id: postId });
    return res.send({ message: "게시글을 삭제하였습니다." });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { postRouter };
