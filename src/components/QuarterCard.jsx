import React from 'react';
import '../styles/QuarterCard.css';

const QuarterCard = ({ quarter, sentiment, onClick }) => {
    return (
        <div className="quarter-card" onClick={onClick}>
            <h2>{quarter}</h2>
            <p>Management Sentiment: <strong>{sentiment.management}</strong></p>
            <p>Q&A Sentiment: <strong>{sentiment.qa}</strong></p>
        </div>
    );
};

export default QuarterCard;