import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts: [],
  loading: false,
}

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
    },
    updatePostInState: (state, action) => {
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
})

export const { setPosts, addPost, removePost, updatePostInState, setLoading } = postSlice.actions

export default postSlice.reducer