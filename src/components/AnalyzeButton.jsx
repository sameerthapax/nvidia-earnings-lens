// src/components/AnalyzeButton.jsx
import React, { useState } from 'react';

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
                if (onComplete) onComplete(); // Refresh data
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
        <div style={{ marginTop: '0.5rem' }}>
            <button onClick={handleAnalyze} disabled={loading}>
                {loading ? 'Analyzing...' : '🧠 Analyze Transcript'}
            </button>
            {message && <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{message}</p>}
        </div>
    );
};

export default AnalyzeButton;