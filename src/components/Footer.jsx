import React from 'react';
import '../styles/Footer.css'; // custom styles

const Footer = () => {
    return (
        <footer className="app-footer">
            <p>© {new Date().getFullYear()} NVIDIA Earnings AI. All rights reserved.</p>
        </footer>
    );
};

export default Footer;