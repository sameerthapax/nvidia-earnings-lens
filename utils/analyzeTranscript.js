// utils/analyzeTranscript.js
import OpenAI from 'openai';
import { config } from 'dotenv';
config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are a financial analyst assistant specializing in earnings calls.

Summarize the following transcript and extract these insights in JSON:
{
  "managementSentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
  "qaSentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
  "toneChange": string,
  "strategicFocuses": string[]
}
`;

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

export async function extractInsightsFromTranscript(transcriptInput) {
    const transcriptText = Array.isArray(transcriptInput)
        ? transcriptInput.join('\n')
        : typeof transcriptInput === 'string'
            ? transcriptInput
            : '';

    if (!transcriptText) throw new Error('Invalid transcript format');

    const chunks = chunkTranscript(transcriptText);
    const summaries = [];

    for (let i = 0; i < chunks.length; i++) {
        try {
            const res = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo-0125',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: chunks[i] },
                ],
                temperature: 0.3,
            });
            summaries.push(res.choices[0].message.content);
            console.log(`✅ Summarized chunk ${i + 1}`);
        } catch (err) {
            console.error(`❌ Failed on chunk ${i + 1}:`, err.message);
        }
    }

    const aggregatePrompt = `
You are an earnings transcript analyst. Given the following chunk summaries, combine their insights and return a single JSON object with:

1. managementSentiment: "POSITIVE", "NEGATIVE", or "NEUTRAL"
2. qaSentiment: "POSITIVE", "NEGATIVE", or "NEUTRAL"
3. toneChange: A sentence describing the quarter-over-quarter sentiment shift
4. strategicFocuses: A merged array of 3–5 most important key themes (no duplicates)

Chunk summaries:
${summaries.join('\n\n')}
`;

    const finalRes = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            { role: 'system', content: 'You are an earnings transcript analyst.' },
            { role: 'user', content: aggregatePrompt },
        ],
        temperature: 0.2,
    });

    const raw = finalRes.choices[0].message.content;
    try {
        const parsed = JSON.parse(raw);
        return parsed;
    } catch (err) {
        console.error('❌ Could not parse final JSON:', err.message);
        console.log('Raw response:\n', raw);
        return null;
    }
}