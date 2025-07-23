import OpenAI from 'openai';
import { config } from 'dotenv';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { cosineSimilarity } from '../utils/cosineSim.js';

config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY);
if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { quarter, question } = req.body;
    if (!quarter || !question) return res.status(400).json({ error: 'Missing quarter or question' });

    try {
        // Get all chunks for this quarter
        const chunksSnapshot = await db.collection('analyzedData').doc(quarter).collection('chunks').get();
        const chunks = [];
        console.log(chunksSnapshot);

        for (const doc of chunksSnapshot.docs) {
            const d = doc.data();
            chunks.push({ text: d.text, embedding: d.embedding });
        }

        // Get question embedding
        const embedRes = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: question
        });
        const questionVector = embedRes.data[0].embedding;

        // Find top 3 similar chunks
        const scoredChunks = chunks.map(c => ({
            text: c.text,
            score: cosineSimilarity(c.embedding, questionVector)
        })).sort((a, b) => b.score - a.score).slice(0, 5);

        const context = scoredChunks.map(c => c.text).join('\n---\n');

        const chatPrompt = `You are an analyst assistant. Use the following earnings call context to answer the user's question.\n\nContext:\n${context}\n\nQuestion: ${question}\nAnswer:`;

        const chatRes = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You answer questions using context only. If unsure, say so.' },
                { role: 'user', content: chatPrompt }
            ]
        });

        const answer = chatRes.choices[0].message.content;
        return res.status(200).json({ answer });
    } catch (err) {
        console.error('❌ Chat query error:', err);
        return res.status(500).json({ error: err.message });
    }
}
