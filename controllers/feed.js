const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getFeed = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res
        .status(200)
        .json({ message: "Post fetched successfully", posts: posts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.addPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image was submitted");
    error.statusCode = 422;
    throw error;
  }

  let title = req.body.title;
  let content = req.body.content;
  let imageUrl = req.file.path.replace("\\", "/");
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "jarec" },
  });

  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.getPost = (req, res, next) => {
  let _id = req.params.postId;

  console.log("I was called");
  Post.findById(_id)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }

      res.json({ message: "Post was fetched", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image was submitted");
    error.statusCode = 422;
    throw error;
  }

  let _id = req.params.postId;
  let title = req.body.title;
  let content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    const error = new Error("No image was submitted to upload");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(_id)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }

      if (post.imageUrl !== imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;

      return post.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Post updated successfully", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  let _id = req.params.postId;

  Post.findByIdAndDelete(_id)
    .then((result) => {
      res.status(200).json({ message: "Post deleted successfully" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

let clearImage = (filePath) => {
  filePath = path.join(__dirname, "../", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
