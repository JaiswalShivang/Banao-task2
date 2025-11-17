const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.post("/", authMiddleware, upload.single('image'), postController.createPost);
router.get("/", authMiddleware, postController.getAllPosts);
router.get("/myPost", authMiddleware, postController.getUserPost);
router.put("/:postId", authMiddleware, upload.single('image'), postController.updatePost);
router.delete("/:postId", authMiddleware, postController.deletePost);
router.patch("/:postId/like", authMiddleware, postController.likePost);
router.post("/:postId/comment", authMiddleware, postController.createPostComment);

module.exports = router;
