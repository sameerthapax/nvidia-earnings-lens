import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="app-footer__inner">
                <p>NVIDIA earnings transcripts, sentiment readings, and retrieval-based Q&A in one interface.</p>
                <p>© {new Date().getFullYear()} NVIDIA Earnings Lens</p>
            </div>
        </footer>
    );
};

export default Footer;
