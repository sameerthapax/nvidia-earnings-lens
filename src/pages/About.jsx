// src/pages/About.jsx
import React from 'react';
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-page">
            <h1>About NVIDIA Earnings AI</h1>
            <p>
                NVIDIA Earnings AI is an AI-powered research tool that analyzes NVIDIA’s earnings call transcripts across multiple quarters.
                It provides fast, deep insights for investors, researchers, and analysts using natural language processing and vector search.
            </p>

            <h2>📌 Key Features</h2>
            <ul>
                <li>🔍 Automatic transcript parsing and multi-part summarization</li>
                <li>📈 Sentiment analysis on both prepared remarks and Q&A sessions</li>
                <li>📊 Tone change tracking across quarters to detect executive mood shifts</li>
                <li>🧠 Strategic focus extraction using large language models</li>
                <li>💬 Interactive Chatbox for asking questions about any quarter's transcript</li>
                <li>🔎 Vector search powered by OpenAI embeddings for accurate context retrieval</li>
            </ul>

            <h2>🛠️ Tech Stack</h2>
            <ul>
                <li>React + Vite for frontend UI</li>
                <li>Firebase Firestore for data storage</li>
                <li>OpenAI GPT-4 & Embeddings API for NLP and chat</li>
                <li>Puppeteer + Whisper for automated audio-to-text transcription</li>
                <li>Chart.js for visualization of sentiment trends</li>
            </ul>

            <h2>🧠 AI Capabilities</h2>
            <ul>
                <li>Chunk-wise transcript embedding using <code>text-embedding-3-small</code></li>
                <li>Cosine similarity search to retrieve relevant context for chat queries</li>
                <li>GPT-4 used for summarizing chunks and answering user queries</li>
                <li>Fine-tuned prompt engineering to extract consistent structured insights</li>
            </ul>

            <h2>📂 Data Pipeline</h2>
            <p>
                1. Raw audio files are scraped from NVIDIA’s investor relations page.<br />
                2. Whisper converts audio into structured text.<br />
                3. Transcripts are chunked, summarized, embedded, and stored in Firestore under:
            </p>
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

            <h2>🚀 Goal</h2>
            <p>
                The goal is to simplify the analysis of earnings reports by surfacing executive tone, sentiment, and strategy
                without requiring users to read entire transcripts.
            </p>
        </div>
    );
};

export default About;