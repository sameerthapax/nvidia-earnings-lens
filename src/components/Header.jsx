import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // custom styles

const Header = () => {
    return (
        <header className="app-header">
            <div className="header-content">
                <h1 className="logo">
                    <Link to="/">NVIDIA Earnings AI</Link>
                </h1>
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;