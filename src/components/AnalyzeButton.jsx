// src/components/AnalyzeButton.jsx
import React, { useState } from 'react';
import '../styles/AnalyzeButton.css'; // import custom styles

const AnalyzeButton = ({ quarterId, onComplete }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setMessage('🔎 Analyzing transcript...');
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quarter: quarterId }),
            });

            const json = await res.json();

            if (res.ok) {
                setMessage(`✅ ${json.message}`);
                if (onComplete) onComplete();
            } else {
                setMessage(`❌ Error: ${json.error}`);
            }
        } catch (err) {
            setMessage(`❌ Request failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="analyze-wrapper">
            <button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={loading}
            >
                {loading ? 'Analyzing...' : '🧠 Analyze Transcript'}
            </button>
            {message && <p className="analyze-message">{message}</p>}
        </div>
    );
};

export default AnalyzeButton;