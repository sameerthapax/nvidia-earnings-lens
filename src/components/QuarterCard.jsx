// src/components/QuarterCard.jsx
import React from 'react';
import '../styles/QuarterCard.css';

const SENTIMENT_LABELS = {
    POSITIVE: 'Constructive',
    NEUTRAL: 'Balanced',
    NEGATIVE: 'Cautious'
};

const QuarterCard = ({ quarter, sentiment, hasTranscript, hasAnalysis, onClick }) => {
    return (
        <button className="quarter-card reveal" onClick={onClick} type="button">
            <div className="quarter-card__meta">
                <span className="quarter-card__label">Quarter file</span>
                <span className={`quarter-card__status ${hasAnalysis ? 'is-ready' : 'is-pending'}`}>
                    {hasAnalysis ? 'Analysis ready' : 'Needs analysis'}
                </span>
            </div>
            <h3>{quarter}</h3>
            <p className="quarter-card__summary">
                {sentiment ? SENTIMENT_LABELS[sentiment] || sentiment : 'Transcript available for review'}
            </p>
            <div className="quarter-card__footer">
                <span className={`sentiment sentiment--${(sentiment || 'NEUTRAL').toLowerCase()}`}>
                    {sentiment || 'No sentiment'}
                </span>
                <span className="quarter-card__availability">
                    {hasTranscript ? 'Transcript loaded' : 'Transcript missing'}
                </span>
            </div>
        </button>
    );
};

export default QuarterCard;
