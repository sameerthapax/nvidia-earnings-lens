import React from 'react';
import '../styles/FocusThemes.css';
const FocusThemes = ({ themes }) => {
    return (
        <div className="focus-themes">
            <p className="panel-kicker">Focus themes</p>
            <h3>Recurring strategic topics</h3>
            <ul className="focus-themes__list">
                {themes.map((theme, index) => (
                    <li key={index} className="theme-tag">{theme}</li>
                ))}
            </ul>
        </div>
    );
};

export default FocusThemes;
