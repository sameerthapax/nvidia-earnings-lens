// src/pages/About.jsx
import React from 'react';
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-page">
            <h1>About NVIDIA Earnings AI</h1>
            <p>
                This project is an AI-powered tool that analyzes NVIDIA’s earnings call transcripts over the last four quarters.
                It extracts key signals using natural language processing to provide investors, analysts, and researchers with
                insights into executive sentiment, strategic focus areas, and tone trends.
            </p>

            <h2>📌 Key Features</h2>
            <ul>
                <li>🔍 Automatic transcript analysis</li>
                <li>📈 Sentiment detection on prepared remarks and Q&A</li>
                <li>📊 Quarter-over-quarter tone change tracking</li>
                <li>🧠 Strategic focus theme extraction</li>
            </ul>

            <h2>🛠️ Tech Stack</h2>
            <ul>
                <li>React + Vite for frontend</li>
                <li>OpenAI GPT & Whisper APIs for NLP</li>
                <li>Puppeteer for automated audio scraping</li>
                <li>Chart.js for visualization</li>
            </ul>

            <h2>📂 Data Sources</h2>
            <p>
                Earnings audio is fetched from NVIDIA’s investor relations site. Transcripts are auto-generated using Whisper,
                then analyzed using OpenAI’s GPT-4 to extract sentiment and themes.
            </p>

            <h2>🚀 Goal</h2>
            <p>
                This app helps users quickly understand NVIDIA’s strategic narrative and executive tone without reading through
                entire earnings transcripts.
            </p>
        </div>
    );
};

export default About;

