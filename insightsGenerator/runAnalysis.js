// insights/runAnalysis.js
import { extractInsightsFromTranscript } from './analyzeTranscriptOpenAi.js';
import transcript from '../public/transcripts/Q1-2026.json' with { type: 'json' };
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
    const fullText = transcript.transcript.join('\n');
    const insights = await extractInsightsFromTranscript(fullText);

    if (insights) {
        console.log(`📊 Final Insights for ${transcript.quarter}:`);
        console.log(JSON.stringify(insights, null, 2));

        // ✅ Save to public/insights/Q1-2026.json
        const outputDir = path.join(__dirname, '..', 'public', 'insights');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const filePath = path.join(outputDir, `${transcript.quarter}.json`);
        fs.writeFileSync(filePath, JSON.stringify({
            quarter: transcript.quarter,
            title: transcript.title,
            url: transcript.url,
            insights,
            generatedAt: new Date().toISOString()
        }, null, 2));

        console.log(`✅ Saved insights to: public/insights/${transcript.quarter}.json`);
    } else {
        console.log('❌ No insights returned.');
    }
})();