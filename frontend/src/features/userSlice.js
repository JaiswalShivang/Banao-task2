import { createSlice } from '@reduxjs/toolkit'

const loadUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem('user');
    if(savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  } catch(e) {
    return null;
  }
}

const initialState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
})

export const { setUser, logout } = userSlice.actions

export default userSlice.reducer