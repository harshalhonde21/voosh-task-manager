import React, { useState } from "react";
import { FaTasks, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../css/Navbar.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const { user, isAuthenticated } = useSelector((state) => state.user);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-left">
                <img src="/tasks.png" alt="img"/>
            </Link>
            <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
                <Link to="/" className="navbar-link">
                    Home
                </Link>
                <Link to="/task" className="navbar-link">
                    Task
                </Link>
            </div>

            <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
                {isAuthenticated ? (
                    <div className="navbar-profile">
                        {user && (
                            <Link to="/profile">
                                <img
                                    src={user.profilePicture}
                                    className="profile-picture"
                                    alt="Profile"
                                />
                            </Link>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="navbar-link login-btn">
                        Login
                    </Link>
                )}
            </div>

            <div className="navbar-hamburger" onClick={handleMenuToggle}>
                <FaBars />
            </div>
        </nav>
    );
};

export default Navbar;
