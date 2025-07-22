// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    const location = useLocation();

    return (
        <header className="app-header">
            <div className="header-content">
                <h1 className="logo">
                    <Link to="/">NVIDIA Earnings AI</Link>
                </h1>
                <nav className="nav-links">
                    <NavLinkBubble to="/" label="Home" active={location.pathname === '/'} />
                    <NavLinkBubble to="/about" label="About" active={location.pathname === '/about'} />
                </nav>
            </div>
        </header>
    );
};

const NavLinkBubble = ({ to, label, active }) => (
    <Link to={to} className={`nav-link ${active ? 'active' : ''}`}>
        {label}
        {active && <span className="bubble" />}
    </Link>
);

export default Header;