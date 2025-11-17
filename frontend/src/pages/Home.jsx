import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPosts, addPost, removePost, updatePostInState } from '../features/postSlice';
import { logout } from '../features/userSlice';
import { postAPI } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import CommentModal from '../components/CommentModal';
import PostModal from '../components/PostModal';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showUpdatePost, setShowUpdatePost] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [showMyPosts]);

  const fetchPosts = async () => {
    try {
      const response = showMyPosts 
        ? await postAPI.getUserPosts() 
        : await postAPI.getAllPosts();
      dispatch(setPosts(response.data.posts));
    } catch (err) {
      console.error('Failed to fetch posts');
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await postAPI.likePost(postId);
      dispatch(updatePostInState(response.data.post));
    } catch (err) {
      console.error('Failed to like post');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await postAPI.deletePost(postId);
      dispatch(removePost(postId));
    } catch (err) {
      console.error('Failed to delete post');
    }
  };

  const handleCommentSubmit = async (comment) => {
    try {
      const response = await postAPI.addComment(selectedPost, { comment });
      dispatch(updatePostInState(response.data.post));
      setShowCommentModal(false);
      setSelectedPost(null);
    } catch (err) {
      console.error('Failed to add comment');
    }
  };

  const handleOpenCommentModal = (postId) => {
    setSelectedPost(postId);
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPost(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleToggleMyPosts = () => {
    setShowMyPosts(!showMyPosts);
  };

  const handleCreatePost = async (imageFile) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await postAPI.createPost(formData);
      dispatch(addPost(response.data.post));
      setShowCreatePost(false);
      
      if (showMyPosts) {
        fetchPosts();
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      alert(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdatePost = async (imageFile) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await postAPI.updatePost(postToUpdate, formData);
      dispatch(updatePostInState(response.data.post));
      setShowUpdatePost(false);
      setPostToUpdate(null);
    } catch (err) {
      console.error('Failed to update post:', err);
      alert(err.response?.data?.message || 'Failed to update post');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (postId) => {
    setPostToUpdate(postId);
    setShowUpdatePost(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreatePost(false);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdatePost(false);
    setPostToUpdate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        showMyPosts={showMyPosts}
        onTogglePosts={handleToggleMyPosts}
        onLogout={handleLogout}
      />

      <div className="max-w-2xl mx-auto px-3 sm:px-4">
        {showMyPosts && (
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full bg-blue-500 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </button>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              user={user}
              onLike={handleLike}
              onDelete={handleDelete}
              onEdit={handleEditClick}
              onComment={handleOpenCommentModal}
            />
          ))}
        </div>
      </div>

      {showCommentModal && (
        <CommentModal
          onClose={handleCloseCommentModal}
          onSubmit={handleCommentSubmit}
        />
      )}

      {showCreatePost && (
        <PostModal
          title="Create New Post"
          onClose={handleCloseCreateModal}
          onSubmit={handleCreatePost}
          isUploading={isUploading}
        />
      )}

      {showUpdatePost && (
        <PostModal
          title="Update Post"
          onClose={handleCloseUpdateModal}
          onSubmit={handleUpdatePost}
          isUploading={isUploading}
        />
      )}
    </div>
  );
};

export default Home;
