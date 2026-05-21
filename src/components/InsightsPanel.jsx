import React from 'react';
import FocusThemes from './FocusThemes';
import '../styles/InsightsPanel.css';

const InsightsPanel = ({ sentiment, themes, toneChange }) => {
    return (
        <div className="insights-panel reveal">
            <div className="insights-panel__header">
                <p className="panel-kicker">AI reading</p>
                <h2>Quarter assessment</h2>
            </div>

            <div className="insights-panel__sentiment-grid">
                <article className="signal-card">
                    <span className="signal-card__label">Management</span>
                    <strong className={`signal-card__value sentiment-text sentiment-text--${sentiment.management.toLowerCase()}`}>
                        {sentiment.management}
                    </strong>
                </article>
                <article className="signal-card">
                    <span className="signal-card__label">Q&amp;A</span>
                    <strong className={`signal-card__value sentiment-text sentiment-text--${sentiment.qa.toLowerCase()}`}>
                        {sentiment.qa}
                    </strong>
                </article>
            </div>

            <div className="insights-panel__section">
                <p className="panel-kicker">Tone change</p>
                <p className="insights-panel__tone">{toneChange}</p>
            </div>

            <FocusThemes themes={themes} />
        </div>
    );
};

export default InsightsPanel;
