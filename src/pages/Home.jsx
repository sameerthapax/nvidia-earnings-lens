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
    Title
} from 'chart.js';
import QuarterCard from '../components/QuarterCard';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title);

const sentimentToScore = {
    POSITIVE: 1,
    NEUTRAL: 0,
    NEGATIVE: -1
};

const Home = () => {
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalyzedData = async () => {
            const snapshot = await getDocs(collection(db, 'analyzedData'));
            const snapshot2 = await getDocs(collection(db, 'transcripts'));

            const parsed = snapshot.docs.map(doc => ({
                ...doc.data(),
                quarter: doc.id
            }));
            const parsed2 = snapshot2.docs.map(doc => ({
                ...doc.data(),
                quarter: doc.id
            }));

            parsed.sort((a, b) => (b.quarter < a.quarter ? 1 : -1));
            parsed2.sort((a, b) => (b.quarter < a.quarter ? 1 : -1));

            setData1(parsed);
            setData2(parsed2);
            setLoading(false);
        };

        fetchAnalyzedData();
    }, []);

    const labels = data1.map(item => item.quarter);
    const managementData = data1.map(item => sentimentToScore[item.sentiment?.management || 'NEUTRAL']);
    console.log(managementData);
    const qaData = data1.map(item => sentimentToScore[item.sentiment?.qa || 'NEUTRAL']);

    const generateChartOptions = (titleText, color) => ({
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: titleText,
                font: {
                    size: 20,
                    weight: 'bold'
                },
                color,
                padding: {
                    top: 10,
                    bottom: 20
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: (val) => {
                        if (val === 1) return 'Positive';
                        if (val === 0) return 'Neutral';
                        if (val === -1) return 'Negative';
                        return val;
                    }
                },
                min: -1,
                max: 1,
                grid: { color: '#eee' }
            },
            x: {
                grid: { display: false }
            }
        }
    });
    if (loading) return <p style={{ textAlign: 'center' }}>📊 Loading insights...</p>;

    return (
        <div className="home-page">
            <h1 className="dashboard-title">NVIDIA Earnings Sentiment Dashboard</h1>

            <div className="chart-container">
                <Line
                    data={{
                        labels,
                        datasets: [{
                            label: 'Management Sentiment',
                            data: managementData,
                            borderColor: '#007bff',
                            backgroundColor: 'rgba(0,123,255,0.1)',
                            tension: 0.3,
                            fill: true
                        }]
                    }}
                    options={generateChartOptions('📈 Management Sentiment Over Time', '#007bff')}
                />
            </div>

            <div className="chart-container">
                <Line
                    data={{
                        labels,
                        datasets: [{
                            label: 'Q&A Sentiment',
                            data: qaData,
                            borderColor: '#28a745',
                            backgroundColor: 'rgba(40,167,69,0.1)',
                            tension: 0.3,
                            fill: true
                        }]
                    }}
                    options={generateChartOptions('💬 Q&A Sentiment Over Time', '#28a745')}
                />
            </div>

            <div className="quarter-section">
                <h2 className="section-title">Quarter Summaries</h2>
                <div className="quarter-grid">
                    {data1.map((item, index) => (
                        <QuarterCard
                            key={index}
                            quarter={item.quarter}
                            title={item.quarter}
                            sentiment={item.sentiment?.management || 'NEUTRAL'}
                            onClick={() => navigate(`/quarter/${item.quarter}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;