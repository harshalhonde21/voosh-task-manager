import { useState } from "react";
import "../css/Login.css";
import { useDispatch } from "react-redux";
import { googleAuth, registerUser, loginUser } from "../actions/userAction";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Importing the loader

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
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    setLoading(true); // Show loader
    dispatch(loginUser(formData))
      .then(() => {
        clearFormFields();
        setLoading(false); // Hide loader after successful response
        navigate("/profile");
      })
      .catch(() => setLoading(false)); // Hide loader on error
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, username, email, password, profilePicture } = formData;

    if (!firstName || !lastName || !username || !email || !password) {
      setError("All fields are required");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", firstName);
    formDataToSend.append("lastName", lastName);
    formDataToSend.append("username", username);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    if (profilePicture) {
      formDataToSend.append("profilePicture", profilePicture);
    }

    setLoading(true); // Show loader
    dispatch(registerUser(formDataToSend))
      .then(() => {
        clearFormFields();
        setLoading(false); // Hide loader after successful response
        navigate("/profile");
      })
      .catch(() => setLoading(false)); // Hide loader on error
  };

  const handleSignupLoginGoogle = () => {
    setLoading(true); // Show loader
    dispatch(googleAuth())
      .then(() => {
        setLoading(false); // Hide loader after successful response
        navigate("/profile");
      })
      .catch(() => setLoading(false)); // Hide loader on error
  };

  return (
    <div className="auth-container">
      {loading && (
        <div className="loader-overlay">
          <div className="loader-container">
            <ClipLoader color="#ffffff" size={50} />
            <p>Loading as server is free takes time to auth, please wait...</p>
          </div>
        </div>
      )}
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
          type="button"
          className="auth-btn"
        >
          {isLogin ? "Login with Google" : "Sign Up with Google"}
        </button>
      </form>
    </div>
  );
};

export default Login;
