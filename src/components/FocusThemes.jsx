import React from 'react';
import '../styles/FocusThemes.css';
const FocusThemes = ({ themes }) => {
    return (
        <div className="focus-themes">
            <h3>Strategic Focuses</h3>
            <ul>
                {themes.map((theme, index) => (
                    <li key={index} className="theme-tag">{theme}</li>
                ))}
            </ul>
        </div>
    );
};

export default FocusThemes;