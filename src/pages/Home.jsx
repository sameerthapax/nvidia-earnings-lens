// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Filler
} from 'chart.js';
import QuarterCard from '../components/QuarterCard';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Filler);

const sentimentToScore = {
    POSITIVE: 1,
    NEUTRAL: 0,
    NEGATIVE: -1
};

const quarterOrder = (quarter = '') => {
    const match = quarter.match(/Q(\d)-(\d{4})/i);
    if (!match) return 0;
    const [, q, year] = match;
    return Number(year) * 10 + Number(q);
};

const Home = () => {
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalyzedData = async () => {
            try {
                const [snapshot, snapshot2] = await Promise.all([
                    getDocs(collection(db, 'analyzedData')),
                    getDocs(collection(db, 'transcripts'))
                ]);

                const parsed = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    quarter: doc.id
                }));
                const parsed2 = snapshot2.docs.map(doc => ({
                    ...doc.data(),
                    quarter: doc.id
                }));

                parsed.sort((a, b) => quarterOrder(a.quarter) - quarterOrder(b.quarter));
                parsed2.sort((a, b) => quarterOrder(a.quarter) - quarterOrder(b.quarter));

                setData1(parsed);
                setData2(parsed2);
                setError('');
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
                setError('The dashboard could not load transcript data. Check the Firebase configuration and collection access.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyzedData();
    }, []);

    const labels = data1.map(item => item.quarter);
    const managementData = data1.map(item => sentimentToScore[item.sentiment?.management || 'NEUTRAL']);
    const qaData = data1.map(item => sentimentToScore[item.sentiment?.qa || 'NEUTRAL']);
    const transcriptQuarterSet = new Set(data2.map((item) => item.quarter));
    const quarterLibrary = Array.from(new Set([...data2.map((item) => item.quarter), ...data1.map((item) => item.quarter)]))
        .map((quarter) => {
            const matchingAnalysis = data1.find((analysisItem) => analysisItem.quarter === quarter);
            return {
                quarter,
                sentiment: matchingAnalysis?.sentiment?.management || null,
                hasAnalysis: Boolean(matchingAnalysis)
            };
        })
        .sort((a, b) => quarterOrder(b.quarter) - quarterOrder(a.quarter));
    const latestQuarter = quarterLibrary[0]?.quarter || data1[data1.length - 1]?.quarter || 'No quarter loaded';
    const positiveCount = data1.filter(
        (item) => item.sentiment?.management === 'POSITIVE' || item.sentiment?.qa === 'POSITIVE'
    ).length;
    const analysisCoverage = data2.length ? Math.round((data1.length / data2.length) * 100) : 0;

    const trendSummary = (() => {
        const latestManagement = managementData[managementData.length - 1];
        const latestQa = qaData[qaData.length - 1];
        if (latestManagement === 1 && latestQa === 1) return 'The latest call reads as constructive across prepared remarks and Q&A.';
        if (latestManagement === -1 || latestQa === -1) return 'The latest call shows caution in at least one section of the discussion.';
        return 'The latest call lands in a balanced range with no strong directional swing.';
    })();

    const generateChartOptions = (titleText, color) => ({
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: titleText,
                font: {
                    size: 15,
                    weight: 600,
                    family: 'Geist, "SF Pro Display", "Helvetica Neue", sans-serif'
                },
                color,
                padding: {
                    top: 6,
                    bottom: 18
                }
            },
            tooltip: {
                displayColors: false,
                backgroundColor: '#111111',
                titleFont: { family: 'Geist Mono, "SF Mono", monospace', size: 12, weight: 600 },
                bodyFont: { family: 'Geist, "SF Pro Display", sans-serif', size: 12 },
                padding: 12,
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        if (value === 1) return 'Positive';
                        if (value === 0) return 'Neutral';
                        if (value === -1) return 'Negative';
                        return String(value);
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    color: '#787774',
                    callback: (val) => {
                        if (val === 1) return 'Positive';
                        if (val === 0) return 'Neutral';
                        if (val === -1) return 'Negative';
                        return val;
                    }
                },
                min: -1,
                max: 1,
                border: { display: false },
                grid: { color: 'rgba(17, 17, 17, 0.08)' }
            },
            x: {
                ticks: { color: '#787774' },
                border: { display: false },
                grid: { display: false }
            }
        }
    });
    if (loading) return <p className="loading-state">Loading sentiment archive…</p>;
    if (error) return <p className="loading-state">{error}</p>;

    return (
        <div className="home-page">
            <section className="home-hero reveal">
                <div className="home-hero__copy">
                    <p className="section-kicker">Research interface</p>
                    <h1 className="dashboard-title">Quarterly sentiment, source transcripts, and direct questioning in one reading surface.</h1>
                    <p className="home-hero__intro">
                        Review how management language and investor Q&amp;A shift over time, then open any quarter for full transcript context and retrieval-based analysis.
                    </p>
                </div>

                <div className="home-hero__aside">
                    <article className="hero-stat-card">
                        <span className="hero-stat-card__label">Latest quarter</span>
                        <strong>{latestQuarter}</strong>
                    </article>
                    <article className="hero-stat-card">
                        <span className="hero-stat-card__label">Analysis coverage</span>
                        <strong>{analysisCoverage}%</strong>
                    </article>
                    <article className="hero-stat-card">
                        <span className="hero-stat-card__label">Constructive calls</span>
                        <strong>{positiveCount}</strong>
                    </article>
                </div>
            </section>

            <section className="overview-grid">
                <article className="overview-card overview-card--wide reveal">
                    <div className="overview-card__header">
                        <div>
                            <p className="panel-kicker">Management remarks</p>
                            <h2>Prepared statement trend</h2>
                        </div>
                        <span className="chart-note">Quarter by quarter</span>
                    </div>
                    <div className="chart-frame">
                        <Line
                            data={{
                                labels,
                                datasets: [{
                                    label: 'Management Sentiment',
                                    data: managementData,
                                    borderColor: '#1F6C9F',
                                    backgroundColor: 'rgba(225, 243, 254, 0.82)',
                                    pointBackgroundColor: '#1F6C9F',
                                    pointBorderColor: '#ffffff',
                                    pointRadius: 4,
                                    pointHoverRadius: 5,
                                    borderWidth: 2,
                                    tension: 0.34,
                                    fill: true
                                }]
                            }}
                            options={generateChartOptions('Sentiment over time', '#1F6C9F')}
                        />
                    </div>
                </article>

                <article className="overview-card reveal">
                    <p className="panel-kicker">Current read</p>
                    <h2>Latest directional summary</h2>
                    <p className="overview-card__body-copy">{trendSummary}</p>
                    <dl className="mini-metrics">
                        <div>
                            <dt>Tracked quarters</dt>
                            <dd>{data1.length}</dd>
                        </div>
                        <div>
                            <dt>Stored transcripts</dt>
                            <dd>{data2.length}</dd>
                        </div>
                    </dl>
                </article>

                <article className="overview-card overview-card--wide reveal">
                    <div className="overview-card__header">
                        <div>
                            <p className="panel-kicker">Investor questioning</p>
                            <h2>Q&amp;A sentiment trend</h2>
                        </div>
                        <span className="chart-note">Prepared vs. reactive tone</span>
                    </div>
                    <div className="chart-frame">
                        <Line
                            data={{
                                labels,
                                datasets: [{
                                    label: 'Q&A Sentiment',
                                    data: qaData,
                                    borderColor: '#346538',
                                    backgroundColor: 'rgba(237, 243, 236, 0.9)',
                                    pointBackgroundColor: '#346538',
                                    pointBorderColor: '#ffffff',
                                    pointRadius: 4,
                                    pointHoverRadius: 5,
                                    borderWidth: 2,
                                    tension: 0.34,
                                    fill: true
                                }]
                            }}
                            options={generateChartOptions('Sentiment over time', '#346538')}
                        />
                    </div>
                </article>
            </section>

            <section className="quarter-section">
                <div className="section-heading reveal">
                    <div>
                        <p className="section-kicker">Quarter archive</p>
                        <h2 className="section-title">Open a quarter file</h2>
                    </div>
                    <p className="section-caption">Each card leads to the transcript, AI reading, and contextual chat for that period.</p>
                </div>
                <div className="quarter-grid">
                    {quarterLibrary.map((item, index) => (
                        <QuarterCard
                            key={index}
                            quarter={item.quarter}
                            sentiment={item.sentiment}
                            hasTranscript={transcriptQuarterSet.has(item.quarter)}
                            hasAnalysis={item.hasAnalysis}
                            onClick={() => navigate(`/quarter/${item.quarter}`)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
