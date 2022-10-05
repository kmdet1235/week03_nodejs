const express = require("express");
const mongoose = require("mongoose");
const { commentRouter, postRouter } = require("./routes");
const app = express();
const port = 3000;

const MONGO_URI =
  "mongodb+srv://test:sparta@cluster0.d9pmfhg.mongodb.net/Week03?retryWrites=true&w=majority";

const server = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    mongoose.set("debug", true);
    console.log("MongoDB connected");

    app.use(express.json());
    app.use("/posts", postRouter);
    app.use("/comments", commentRouter);

    app.listen(port, () => {
      console.log(port, "번 포트로 서버가 열렸어요!");
    });
  } catch (err) {
    console.log(err);
  }
};

server();
