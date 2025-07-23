import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
        return <p className="loading">Loading quarter details...</p>;
    }

    return (
        <div className="quarter-details">
            <h1>Quarter: {id}</h1>

            <div className="details-layout">
                <div className="transcript-column">
                    <TranscriptViewer transcript={transcript} />
                    <div className="chat-box">
                        <ChatBox quarter={id} />
                    </div>
                </div>

                <div className="insights-column">
                    {analysis ? (
                        <InsightsPanel
                            sentiment={analysis.sentiment}
                            toneChange={analysis.toneChange}
                            themes={analysis.themes}
                        />
                    ) : (
                        <>
                        <AnalyzeButton quarterId={id} onComplete={fetchData} />
                        <p>No analysis available for this quarter.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuarterDetails;