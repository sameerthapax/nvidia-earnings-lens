import React from 'react';
import '../styles/TranscriptViewer.css';

const TranscriptViewer = ({ transcript }) => {
    return (
        <div className="transcript-viewer">
            {transcript.map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    );
};

export default TranscriptViewer;