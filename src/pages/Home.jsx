// src/pages/Home.jsx
import React from 'react';
import QuarterCard from '../components/QuarterCard';
import SentimentChart from '../components/SentimentChart';
import InsightsPanel from '../components/InsightsPanel';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; // custom styles

const dummyData = [
    {
        quarter: 'Q2-2025',
        sentiment: { management: 'Positive', qa: 'Neutral' },
        themes: ['AI Growth', 'Data Center Expansion', 'Gaming Revenue']
    },
    {
        quarter: 'Q1-2025',
        sentiment: { management: 'Neutral', qa: 'Negative' },
        themes: ['Supply Chain', 'AI Partnerships', 'Cloud GPUs']
    },
    {
        quarter: 'Q4-2024',
        sentiment: { management: 'Negative', qa: 'Negative' },
        themes: ['Macro Challenges', 'Inventory', 'Export Limits']
    },
    {
        quarter: 'Q3-2024',
        sentiment: { management: 'Neutral', qa: 'Positive' },
        themes: ['Omniverse', 'Automotive AI', 'RTX Adoption']
    }
];

const Home = () => {
    const navigate = useNavigate();
    const labels = dummyData.map(d => d.quarter).reverse();
    const managementData = dummyData.map(d => {
        const score = d.sentiment.management === 'Positive' ? 1 : d.sentiment.management === 'Negative' ? -1 : 0;
        return score;
    }).reverse();

    const qaData = dummyData.map(d => {
        const score = d.sentiment.qa === 'Positive' ? 1 : d.sentiment.qa === 'Negative' ? -1 : 0;
        return score;
    }).reverse();

    return (
        <div className="home-page">
            <h1>NVIDIA Earnings Dashboard</h1>

            <SentimentChart labels={labels} managementData={managementData} qaData={qaData} />

            <div className="quarter-grid">
                {dummyData.map((item, index) => (
                    <QuarterCard
                        key={index}
                        quarter={item.quarter}
                        sentiment={item.sentiment}
                        onClick={() => navigate(`/quarter/${item.quarter}`)}
                    />
                ))}
            </div>

            <InsightsPanel sentiment={dummyData[0].sentiment} themes={dummyData[0].themes} />
        </div>
    );
};

export default Home;
