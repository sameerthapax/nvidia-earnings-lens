// insights/analyzeInsights.js
import {config} from 'dotenv';
import OpenAI from 'openai';

config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a financial analyst assistant specializing in earnings calls. Summarize the following partial transcript and extract key strategic focuses and tone.`;

/**
 * Breaks long text into chunks safely under 3000 tokens (~12k chars)
 */
function chunkTranscript(text, maxLength = 12000) {
    const chunks = [];
    let current = '';

    for (const paragraph of text.split('\n')) {
        if ((current + paragraph).length > maxLength) {
            chunks.push(current.trim());
            current = '';
        }
        current += paragraph + '\n';
    }

    if (current.trim()) chunks.push(current.trim());
    return chunks;
}

export async function extractInsightsFromTranscript(fullText) {
    const chunks = chunkTranscript(fullText);
    const summaries = [];

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: chunk }
                ],
                temperature: 0.3
            });

            const summary = response.choices[0].message.content;
            summaries.push(summary);
            console.log(`✅ Chunk ${i + 1} summarized`);
        } catch (err) {
            console.error(`❌ Failed on chunk ${i + 1}:`, err.message);
        }
    }

    // Send aggregated summary to get final insights
    const aggregatePrompt = `
Based on the following summaries of an earnings call transcript, extract the following insights in JSON format:

1. managementSentiment: "POSITIVE", "NEGATIVE", or "NEUTRAL"
2. qaSentiment: "POSITIVE", "NEGATIVE", or "NEUTRAL"
3. toneChange: description of quarter-over-quarter sentiment shift
4. strategicFocuses: array of 3–5 key themes

Summaries:
${summaries.join('\n\n')}
`;

    const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            { role: 'system', content: 'You are an earnings transcript analyst.' },
            { role: 'user', content: aggregatePrompt }
        ],
        temperature: 0.2
    });

    const raw = finalResponse.choices[0].message.content;

    try {
        return JSON.parse(raw);
    } catch (err) {
        console.error('❌ Final response is not valid JSON:', err.message);
        console.log('Raw response:\n', raw);
        return null;
    }
}