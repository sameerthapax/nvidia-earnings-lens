// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    const location = useLocation();
    const isLibraryActive = location.pathname === '/' || location.pathname.startsWith('/quarter/');

    return (
        <header className="app-header">
            <div className="header-content">
                <Link to="/" className="brand-mark">
                    <span className="brand-mark__eyebrow">Research Desk</span>
                    <span className="brand-mark__title">NVIDIA Earnings Lens</span>
                </Link>
                <nav className="nav-links">
                    <NavLinkBubble to="/" label="Library" active={isLibraryActive} />
                    <NavLinkBubble to="/about" label="Method" active={location.pathname === '/about'} />
                </nav>
            </div>
        </header>
    );
};

const NavLinkBubble = ({ to, label, active }) => (
    <Link to={to} className={`nav-link ${active ? 'active' : ''}`}>
        {label}
    </Link>
);

export default Header;
