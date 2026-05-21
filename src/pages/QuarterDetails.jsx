import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import TranscriptViewer from '../components/TranscriptViewer';
import InsightsPanel from '../components/InsightsPanel';
import AnalyzeButton from '../components/AnalyzeButton';
import '../styles/QuaterDetails.css';
import ChatBox from '../components/ChatBox';

const QuarterDetails = () => {
    const { id } = useParams();
    const [transcript, setTranscript] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const transcriptDoc = await getDoc(doc(db, 'transcripts', id));
            const analysisDoc = await getDoc(doc(db, 'analyzedData', id));

            if (transcriptDoc.exists()) {
                setTranscript(transcriptDoc.data().transcript);
            } else {
                console.warn(`Transcript for ${id} not found.`);
            }

            if (analysisDoc.exists()) {
                setAnalysis(analysisDoc.data());
            } else {
                console.warn(`Analysis for ${id} not found.`);
                setAnalysis(null);
            }
        } catch (err) {
            console.error('❌ Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) {
        return <p className="loading-state">Loading quarter details…</p>;
    }

    return (
        <div className="quarter-details">
            <section className="quarter-details__hero reveal">
                <div>
                    <Link className="back-link" to="/">Back to quarter library</Link>
                    <p className="section-kicker">Quarter dossier</p>
                    <h1>{id}</h1>
                    <p className="quarter-details__intro">
                        Review the full transcript, inspect the structured reading, and query the call directly.
                    </p>
                </div>
                <div className="quarter-details__status-card">
                    <span className={`quarter-details__status ${analysis ? 'is-ready' : 'is-pending'}`}>
                        {analysis ? 'Analysis available' : 'Analysis pending'}
                    </span>
                    <p>Transcript source is stored in Firestore and rendered in a line-by-line reading view.</p>
                </div>
            </section>

            <div className="details-layout">
                <div className="transcript-column">
                    <div className="section-heading reveal">
                        <p className="panel-kicker">Primary source</p>
                        <h2>Transcript</h2>
                    </div>
                    <TranscriptViewer transcript={transcript} />
                </div>

                <div className="insights-column">
                    {analysis ? (
                        <InsightsPanel
                            sentiment={analysis.sentiment}
                            toneChange={analysis.toneChange}
                            themes={analysis.themes}
                        />
                    ) : (
                        <AnalyzeButton quarterId={id} onComplete={fetchData} />
                    )}

                    <ChatBox quarter={id} />
                </div>
            </div>
        </div>
    );
};

export default QuarterDetails;
