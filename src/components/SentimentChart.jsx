// src/components/SentimentChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import '../styles/SentimentChart.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const SentimentChart = ({ labels, managementData, qaData }) => {
    const data = {
        labels,
        datasets: [
            {
                label: 'Management Sentiment',
                data: managementData,
                borderColor: 'green',
                fill: false
            },
            {
                label: 'Q&A Sentiment',
                data: qaData,
                borderColor: 'blue',
                fill: false
            }
        ]
    };

    return (
        <div className="sentiment-chart">
            <Line data={data} />
        </div>
    );
};

export default SentimentChart;