// src/pages/QuarterDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TranscriptViewer from '../components/TranscriptViewer';
import InsightsPanel from '../components/InsightsPanel';
import '../styles/QuaterDetails.css';

const QuarterDetails = () => {
    const { id } = useParams();
    const [transcriptData, setTranscriptData] = useState(null);

    useEffect(() => {
        const loadTranscript = async () => {
            try {
                const res = await fetch(`/transcripts/${id}.json`);
                const data = await res.json();
                setTranscriptData(data);
            } catch (err) {
                console.error('Failed to load transcript:', err);
            }
        };
        loadTranscript();
    }, [id]);

    if (!transcriptData) {
        return <p className="loading">Loading transcript...</p>;
    }

    const { transcript, sentiment = { management: 'Neutral', qa: 'Neutral' }, themes = [] } = transcriptData;

    return (
        <div className="quarter-details">
            <h1>Quarter: {id}</h1>
            <div className="details-layout">
                <div className="transcript-column">
                    <TranscriptViewer transcript={transcript} />
                </div>
                <div className="insights-column">
                    <InsightsPanel sentiment={sentiment} themes={themes} />
                </div>
            </div>
        </div>
    );
};

export default QuarterDetails;
