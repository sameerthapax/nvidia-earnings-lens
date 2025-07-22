// src/components/QuarterCard.jsx
import React from 'react';
import '../styles/QuarterCard.css';

const QuarterCard = ({ quarter, sentiment, onClick }) => {
    return (
        <div className="quarter-card" onClick={onClick}>
            <h3>{quarter}</h3>
            {sentiment && (
                <p className={`sentiment ${sentiment.toLowerCase()}`}>
                    Overall Sentiment: {sentiment}
                </p>
            )}
        </div>
    );
};

export default QuarterCard;