import { useState } from "react";
import "../css/Login.css";
import { useDispatch, useSelector } from 'react-redux';
import { googleAuth, registerUser, loginUser } from "../actions/userAction";

import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    profilePicture: "",
  });
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); 

  
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const clearFormFields = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      profilePicture: "",
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    dispatch(loginUser(formData)).then(() => {
      clearFormFields(); 
      
    navigate('/profile');
    });

  };
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, username, email, password, profilePicture } = formData;
  
    if (!firstName || !lastName || !username || !email || !password) {
      setError("All fields are required");
      return;
    }
  
    const formDataToSend = new FormData(); 
    formDataToSend.append('firstName', firstName);
    formDataToSend.append('lastName', lastName);
    formDataToSend.append('username', username);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    if (profilePicture) {
      formDataToSend.append('profilePicture', profilePicture);
    }
  
    dispatch(registerUser(formDataToSend)).then(() => {
      clearFormFields(); 
      navigate('/profile');
    });


  };
  
  
  

  const handleSignupLoginGoogle = () => {
    dispatch(googleAuth())


    navigate('/profile');
  }

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}
      >
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <div className="error-message">{error}</div>}
        {!isLogin && (
          <>
            <div className="input-group">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter a username"
                required
              />
            </div>
          </>
        )}
        <div className="input-group">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Profile Picture Input */}
        {!isLogin && (
          <div className="input-group">
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        )}

        <button type="submit" className="auth-btn">
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <div className="auth-switch">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <a onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Login"}
          </a>
        </div>
        <button
          onClick={handleSignupLoginGoogle}
          style={{ marginTop: "1rem" }}
          type="submit"
          className="auth-btn"
        >
          {isLogin ? "Login with Google" : "Sign Up with Google"}
        </button>
      </form>
    </div>
  );
};

export default Login;
