import React, { useState } from 'react';
import '../styles/AnalyzeButton.css';

const AnalyzeButton = ({ quarterId, onComplete }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setMessage('Running transcript analysis...');
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quarter: quarterId }),
            });

            const json = await res.json();

            if (res.ok) {
                setMessage(json.message);
                if (onComplete) onComplete();
            } else {
                setMessage(`Error: ${json.error}`);
            }
        } catch (err) {
            setMessage(`Request failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="analyze-wrapper reveal">
            <p className="panel-kicker">Analysis missing</p>
            <h2>Generate the structured reading for {quarterId}</h2>
            <p className="analyze-copy">
                This transcript is stored, but the sentiment and theme extraction has not been written yet.
            </p>
            <button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={loading}
            >
                {loading ? 'Analyzing...' : 'Run analysis'}
            </button>
            {message && <p className="analyze-message">{message}</p>}
        </div>
    );
};

export default AnalyzeButton;
