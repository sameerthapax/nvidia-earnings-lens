import React from 'react';
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-page">
            <section className="about-hero reveal">
                <p className="section-kicker">Method</p>
                <h1>How the research workflow is assembled</h1>
                <p className="about-intro">
                    NVIDIA Earnings Lens turns raw earnings call transcripts into a compact research surface for investors,
                    analysts, and operators tracking AI infrastructure demand.
                </p>
            </section>

            <section className="about-grid">
                <article className="about-card reveal">
                    <p className="section-kicker">What it does</p>
                    <h2>Core functions</h2>
                    <ul>
                        <li>Parses and stores quarterly earnings call transcripts.</li>
                        <li>Scores tone across management remarks and the Q&amp;A portion separately.</li>
                        <li>Extracts recurring business themes for faster quarter-over-quarter comparison.</li>
                        <li>Supports direct questioning against transcript context through retrieval-based chat.</li>
                    </ul>
                </article>

                <article className="about-card reveal">
                    <p className="section-kicker">Stack</p>
                    <h2>System choices</h2>
                    <ul>
                        <li>React and Vite for the application shell.</li>
                        <li>Firebase Firestore for transcript and analysis storage.</li>
                        <li>Chart.js for longitudinal sentiment visuals.</li>
                        <li>OpenAI models for transcript analysis, embeddings, and chat responses.</li>
                        <li>TickerTrends as the upstream transcript source.</li>
                    </ul>
                </article>

                <article className="about-card reveal">
                    <p className="section-kicker">AI layer</p>
                    <h2>Model responsibilities</h2>
                    <ul>
                        <li>Chunk-level embeddings support semantic retrieval.</li>
                        <li>Quarter summaries create structured sentiment, tone, and theme fields.</li>
                        <li>Chat answers are grounded in retrieved transcript passages rather than free-form recall.</li>
                    </ul>
                </article>

                <article className="about-card reveal">
                    <p className="section-kicker">Data flow</p>
                    <h2>Storage shape</h2>
                    <pre>
analyzedData/
  └── Q1-2026/
        ├── sentiment
        ├── toneChange
        ├── themes
        └── chunks/
              ├── chunk0
              ├── chunk1
                    </pre>
                </article>
            </section>
        </div>
    );
};

export default About;
