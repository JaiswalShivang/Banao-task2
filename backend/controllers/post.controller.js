const Post = require('../models/postModel');
const User = require('../models/userModel');

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const newPost = new Post({ image });
    await newPost.save();
    await User.findByIdAndUpdate(userId, 
      { 
        $push: { 
          userPosts: newPost._id 
        } 
      });
    res.status(201).json({ 
      message: "Post created successfully", 
      post: newPost 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error" 
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      posts
    });
  }
  catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const foundPost = await Post.findById(postId);
    if (!foundPost) {
      return res.status(404).json({ 
        message: "Post not found" 
      });
    }
    res.status(200).json({ 
      post: foundPost 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error" 
    });
  } 
};

exports.deletePost = async (req,res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ 
        message: "Post not found" 
      });
    } 
    await User.findByIdAndUpdate(userId, 
      { 
        $pull: {
          userPosts: postId
        } 
      });
    res.status(200).json({ 
      message: "Post deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error" 
    });
  }
}

exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { image } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      postId, 
      { image },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ 
        message: "Post not found" 
      });
    }
    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost
    });
  }
  catch (error) {
    res.status(500).json({ 
      message: "Server error" 
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const likedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!likedPost) {
      return res.status(404).json({ 
        message: "Post not found"
      });
    }
    res.status(200).json({
      message: "Post liked successfully",
      post: likedPost
    });
  }
  catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.createPostComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const commentedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    );
    if (!commentedPost) {
      return res.status(404).json({
        message: "Post not found"
      });
    }
    res.status(200).json({
      message: "Comment added successfully",
      post: commentedPost
    });
  }
  catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
