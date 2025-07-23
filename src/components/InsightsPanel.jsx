import React from 'react';
import FocusThemes from './FocusThemes';
import '../styles/InsightsPanel.css';

const InsightsPanel = ({ sentiment, themes, toneChange }) => {
    return (
        <div className="insights-panel">
            <h2>Insights</h2>
            <p>Management Sentiment: <strong>{sentiment.management}</strong></p>
            <p>Q&A Sentiment: <strong>{sentiment.qa}</strong></p>
            <p>Tone Change: <span style={{display:"block"}}>{toneChange}</span></p>
            <FocusThemes themes={themes} />
        </div>
    );
};

export default InsightsPanel;