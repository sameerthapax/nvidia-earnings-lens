import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TranscriptViewer from '../components/TranscriptViewer';
import InsightsPanel from '../components/InsightsPanel';
import '../styles/QuaterDetails.css';

const QuarterDetails = () => {
    const { id } = useParams();
    const [transcriptData, setTranscriptData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scrapeMessage, setScrapeMessage] = useState('');

    const loadTranscript = async () => {
        try {
            const res = await fetch(`/transcripts/${id}.json`);
            const data = await res.json();
            setTranscriptData(data);
        } catch (err) {
            console.error('Failed to load transcript:', err);
        }
    };

    useEffect(() => {
        loadTranscript();
    }, [id]);

    const handleScrapeClick = async () => {
        setLoading(true);
        setScrapeMessage('');
        try {
            const res = await fetch('/api/scrape', { method: 'POST' });
            const json = await res.json();
            if (res.ok) {
                setScrapeMessage(`✅ ${json.message}`);
                await loadTranscript(); // Refresh transcript
            } else {
                setScrapeMessage(`❌ Error: ${json.error}`);
            }
        } catch (err) {
            setScrapeMessage(`❌ Request failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!transcriptData) {
        return <p className="loading">Loading transcript...</p>;
    }

    const { transcript, sentiment = { management: 'Neutral', qa: 'Neutral' }, themes = [] } = transcriptData;

    return (
        <div className="quarter-details">
            <h1>Quarter: {id}</h1>
            <button
                className="scrape-button"
                onClick={handleScrapeClick}
                disabled={loading}
            >
                {loading ? 'Scraping...' : 'Scrape & Analyze'}
            </button>
            {scrapeMessage && <p className="scrape-status">{scrapeMessage}</p>}

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