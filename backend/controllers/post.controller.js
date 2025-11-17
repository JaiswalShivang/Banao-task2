const Post = require('../models/postModel');
const User = require('../models/userModel');
const { uploadImage } = require('../utils/cloudinaryService');

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = await uploadImage(req.file.buffer);
    
    const newPost = new Post({ image: imageUrl, createdBy: userId });
    await newPost.save();
    await User.findByIdAndUpdate(userId, 
      { 
        $push: { 
          userPosts: newPost._id 
        } 
      });
    const populatedPost = await Post.findById(newPost._id).populate('createdBy', 'username email');
    res.status(201).json({ 
      message: "Post created successfully", 
      post: populatedPost 
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const user_id = req.user.id;
    const posts = await Post.find({ createdBy: { $ne: user_id } })
      .populate('createdBy', 'username email')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });
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

exports.getUserPost = async (req, res) => {
  try {
    const user_id = req.user.id;
    const posts = await Post.find({ createdBy: user_id })
      .populate('createdBy', 'username email')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json({ 
      posts: posts 
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
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }
    if (post.createdBy.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized to delete this post"
      });
    }
    await Post.findByIdAndDelete(postId);
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
    const userId = req.user.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }
    if (post.createdBy.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized to update this post"
      });
    }

    let updateData = {};
    if (req.file) {
      // Upload new image to Cloudinary
      const imageUrl = await uploadImage(req.file.buffer);
      updateData.image = imageUrl;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updateData,
      { new: true }
    ).populate('createdBy', 'username email').populate('comments.user', 'username');
    
    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost
    });
  }
  catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: "Post not found"
      });
    }

    const alreadyLiked = post.likedBy.includes(userId);
    
    let updatedPost;
    if(alreadyLiked) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { 
          $pull: { likedBy: userId },
          $inc: { likes: -1 }
        },
        { new: true }
      ).populate('createdBy', 'username email').populate('comments.user', 'username');
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { 
          $push: { likedBy: userId },
          $inc: { likes: 1 }
        },
        { new: true }
      ).populate('createdBy', 'username email').populate('comments.user', 'username');
    }

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      post: updatedPost
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
    const userId = req.user.id;
    
    const commentedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { user: userId, text: comment } } },
      { new: true }
    ).populate('createdBy', 'username email').populate('comments.user', 'username');
    
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
