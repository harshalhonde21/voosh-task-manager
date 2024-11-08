import React from 'react';
import { FaTasks, FaRegEdit, FaCheckCircle, FaRegEye, FaPlusCircle } from 'react-icons/fa'; // Icons for each functionality
import "../css/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Logo Section */}
      <div className="logo-section">
        <img src="/tasks.png" alt="Task Manager Logo" className="logo" />
        <h1 className="app-title">Task Manager</h1>
        <p className="app-description">
          Your go-to app to manage tasks, track progress, and stay organized.
        </p>
      </div>

      {/* Functionality Cards Section */}
      <div className="features-section">
        <h2 className="section-title">Our Features</h2>
        <div className="feature-cards">
          <div className="card">
            <FaTasks className="card-icon" />
            <h3 className="card-title">Manage Tasks</h3>
            <p>Effortlessly create, update, and organize tasks with a drag-and-drop interface.</p>
          </div>
          <div className="card">
            <FaPlusCircle className="card-icon" />
            <h3 className="card-title">Add New Tasks</h3>
            <p>Quickly add new tasks with a simple title and content description.</p>
          </div>
          <div className="card">
            <FaRegEdit className="card-icon" />
            <h3 className="card-title">Edit Tasks</h3>
            <p>Easily edit task details anytime, and stay in control of your task list.</p>
          </div>
          <div className="card">
            <FaCheckCircle className="card-icon" />
            <h3 className="card-title">Drag-And-Drop functionality</h3>
            <p>Simply drag tasks between TODO, IN PROGRESS, and COMPLETE to track their progress.</p>
          </div>

          <div className="card">
            <FaRegEye className="card-icon" />
            <h3 className="card-title">View Task Details</h3>
            <p>View detailed information about each task with just a click.</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2024 Task Manager. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
