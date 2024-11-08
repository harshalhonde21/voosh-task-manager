import axios from 'axios';
import { toast } from 'react-hot-toast'
import {
  registerUserRequest,
  registerUserSuccess,
  registerUserFailure,
  loginUserRequest,
  loginUserSuccess,
  loginUserFailure,
  isLoginRequest,
  isLoginSuccess,
  isLoginFailure,
} from '../redux/userSlice';
import { signInSignUpWithGoogle } from '../firebase.js';




// Register User
export const registerUser = (userData) => async (dispatch) => {

  try {
    dispatch(registerUserRequest());  

    const config = {
      headers: { 'Content-Type': 'multipart/form-data', }
    };

    const response = await axios.post(`https://voosh-task-manager-f6en.onrender.com/api/v1/users/register`, userData, config);

    if (response.status === 201) {
      localStorage.setItem('token', response.data.token);
      dispatch(registerUserSuccess({ user: response.data.user, token: response.data.token }));
      localStorage.setItem('authState', 'true');
      toast.success(response.data.message);
    }
  } catch (err) {
    dispatch(registerUserFailure(err.response ? err.response.data.message : err.message)); 
    toast.error(err.response ? err.response.data.message : err.message);
    console.log(err.response ? err.response.data.message : err.message);
  }
};

// Login User
export const loginUser = (userData) => async (dispatch) => {

  try {
    dispatch(loginUserRequest());  

    const config = {
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await axios.post(`https://voosh-task-manager-f6en.onrender.com/api/v1/users/login`, userData, config);

    if (response.status === 200) {
      localStorage.setItem('token', response.data.token);
      dispatch(loginUserSuccess({ user: response.data.user, token: response.data.token }));
      localStorage.setItem('authState', 'true');
      toast.success(response.data.message);
    }

  } catch (err) {
    dispatch(loginUserFailure(err.response ? err.response.data.message : err.message));  // Corrected action name
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

// Verify User Login
export const isLogin = () => async (dispatch) => {
  try {
    dispatch(isLoginRequest());  // Corrected action name

    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const response = await axios.get(`https://voosh-task-manager-f6en.onrender.com/api/v1/users/isLogin`, config);

    if (response.status === 200) {
      dispatch(isLoginSuccess({ user: response.data.user }));  // Corrected action name
    }
  } catch (err) {
    dispatch(isLoginFailure(err.response ? err.response.data.message : err.message));  // Corrected action name
    toast.error('Session expired. Please log in again.');
  }
};

// Google Authentication
export const googleAuth = () => async (dispatch) => {
  try {
    const token = await signInSignUpWithGoogle();

    const config = {
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await axios.post(`https://voosh-task-manager-f6en.onrender.com/api/v1/users/firebase-auth`, { token }, config);

    if (response.status === 200) {
      localStorage.setItem('token', response.data.token);
      console.log(response.data.token);
      dispatch(loginUserSuccess({ user: response.data.user, token: response.data.token }));
      localStorage.setItem('authState', 'true');
      toast.success(response.data.message);
      console.log(response.data.message)
    }
  } catch (err) {
    dispatch(loginUserFailure(err.response ? err.response.data.message : err.message));  // Corrected action name
    toast.error(err.response ? err.response.data.message : err.message);
  }
};
