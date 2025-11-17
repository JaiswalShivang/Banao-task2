const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const userController = require("./controllers/user.controller");
const postController = require("./controllers/post.controller");
const authMiddleware = require("./middlewares/auth.middleware");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();

app.post("/api/auth/register", userController.register);
app.post("/api/auth/login", userController.login);
app.post("/api/auth/forgot-password", userController.forgotPassword);
app.post("/api/auth/reset-password/:token", userController.resetPassword);

app.post("/api/posts", authMiddleware, postController.createPost);
app.get("/api/posts", postController.getAllPosts);
app.get("/api/posts/:postId", postController.getPost);
app.delete("/api/posts/:postId", authMiddleware, postController.deletePost);
app.put("/api/posts/:postId", authMiddleware, postController.updatePost);
app.patch("/api/posts/:postId/like", authMiddleware, postController.likePost);
app.post("/api/posts/:postId/comment", authMiddleware, postController.createPostComment);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
