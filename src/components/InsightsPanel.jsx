import React from 'react';
import FocusThemes from './FocusThemes';
import '../styles/InsightsPanel.css';

const InsightsPanel = ({ sentiment, themes }) => {
    return (
        <div className="insights-panel">
            <h2>Insights</h2>
            <p>Management Sentiment: <strong>{sentiment.management}</strong></p>
            <p>Q&A Sentiment: <strong>{sentiment.qa}</strong></p>
            <FocusThemes themes={themes} />
        </div>
    );
};

export default InsightsPanel;