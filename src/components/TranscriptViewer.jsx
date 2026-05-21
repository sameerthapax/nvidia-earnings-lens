import React from 'react';
import '../styles/TranscriptViewer.css';

const TranscriptViewer = ({ transcript }) => {
    const lines = Array.isArray(transcript)
        ? transcript
        : String(transcript || '')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

    if (!lines.length) {
        return (
            <div className="transcript-viewer transcript-viewer--empty">
                Transcript content is not available for this quarter yet.
            </div>
        );
    }

    return (
        <div className="transcript-viewer">
            <div className="transcript-viewer__chrome" aria-hidden="true">
                <span />
                <span />
                <span />
            </div>
            <div className="transcript-viewer__body">
                {lines.map((line, index) => (
                    <p key={index}>
                        <span className="transcript-viewer__line-number">{String(index + 1).padStart(2, '0')}</span>
                        <span>{line}</span>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default TranscriptViewer;
