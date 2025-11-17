import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
};

export const postAPI = {
  getAllPosts: () => api.get('/posts'),
  getUserPosts: () => api.get('/posts/myPost'),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (formData) => api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updatePost: (id, formData) => api.put(`/posts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.patch(`/posts/${id}/like`),
  addComment: (id, data) => api.post(`/posts/${id}/comment`, data),
};

export default api;
