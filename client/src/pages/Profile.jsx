import React from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import '../css/Profile.css';
import { logoutUser } from '../redux/userSlice'

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    return <p>Please log in to view your profile.</p>;
  }

  const handleLogout = () => {
    dispatch(logoutUser());
    // Optionally, remove any relevant tokens from localStorage if used
    localStorage.removeItem('token');
    localStorage.removeItem('authState');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.profilePicture}
          alt={`${user.firstName} ${user.lastName}`}
          className="profile-image"
        />
        <h2 className="profile-name">
          {user.firstName} {user.lastName}
        </h2>
      </div>
      <div className="profile-details">
        <div className="profile-detail-item">
          <strong>Email:</strong> <span>{user.email}</span>
        </div>
        <div className="profile-detail-item">
          <strong>Username:</strong> <span>{user.username}</span>
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
