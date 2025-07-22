// insights/analyzeTranscript.js
import analyzeSentiment from '../ai/sentimentAPI.js';
import transcriptJSON from '../public/transcripts/Q3-2025.json' with { type: "json" };

const analyzeFullTranscript = async () => {
    const results = [];

    for (const paragraph of transcriptJSON.transcript) {
        if (!paragraph || typeof paragraph !== 'string') continue;

        const res = await analyzeSentiment(paragraph);
        if (res && Array.isArray(res[0])) {
            console.log(`📊 ${paragraph.slice(0, 40)}...`, res[0]);
            results.push(res[0]);
        } else {
            console.warn(`⚠️ Skipping paragraph (no result): ${paragraph.slice(0, 30)}...`);
        }
    }

    // Aggregate scores
    const total = results.length;
    const scores = { POSITIVE: 0, NEGATIVE: 0 };

    for (const result of results) {
        for (const sentiment of result) {
            scores[sentiment.label] += sentiment.score;
        }
    }

    const avg = {
        POSITIVE: (scores.POSITIVE / total).toFixed(4),
        NEGATIVE: (scores.NEGATIVE / total).toFixed(4),
    };

    const finalSentiment = avg.POSITIVE > avg.NEGATIVE ? 'POSITIVE' :
        avg.NEGATIVE > avg.POSITIVE ? 'NEGATIVE' : 'NEUTRAL';

    console.log(`\n✅ Final sentiment for ${transcriptJSON.quarter}: ${finalSentiment}`);
    console.log('📈 Averaged scores:', avg);
};

analyzeFullTranscript();