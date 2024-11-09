import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'), // Check if user data exists
  loading: false,
  error: null,
  token: localStorage.getItem('token') || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Register user actions
    registerUserRequest(state) {
      state.loading = true;
      state.error = null;
    },
    registerUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    registerUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Login user actions
    loginUserRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    loginUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Check if user is logged in
    isLoginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    isLoginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    isLoginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Firebase Auth
    firebaseAuthSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    firebaseAuthFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Logout
    logoutUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

// Export actions
export const {
  registerUserRequest,
  registerUserSuccess,
  registerUserFailure,
  loginUserRequest,
  loginUserSuccess,
  loginUserFailure,
  isLoginRequest,
  isLoginSuccess,
  isLoginFailure,
  firebaseAuthSuccess,
  firebaseAuthFailure,
  logoutUser,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
