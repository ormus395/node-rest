const router = require("express").Router();
const { body } = require("express-validator");

const feedController = require("../controllers/feed");

router.get("/posts", feedController.getFeed);

router.post(
  "/post",
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters long."),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("The content must be at least 5 characters long."),
  ],
  feedController.addPost
);

router.get("/post/:postId", feedController.getPost);
router.put(
  "/post/:postId",
  [
    body("title")
      .trim()
      .isLength({ min: 7 })
      .withMessage("Title must be at least 5 characters long."),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("The content must be at least 5 characters long."),
  ],
  feedController.updatePost
);
router.delete("/post/:postId");

module.exports = router;
