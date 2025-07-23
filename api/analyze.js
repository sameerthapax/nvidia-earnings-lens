import { extractInsightsFromTranscript } from '../utils/analyzeTranscript.js';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY);
if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { quarter } = req.body;
    if (!quarter) return res.status(400).json({ error: 'Missing quarter parameter' });

    try {
        const transcriptRef = db.collection('transcripts').doc(quarter);
        const docSnap = await transcriptRef.get();

        if (!docSnap.exists) return res.status(404).json({ error: 'Transcript not found' });

        const data = docSnap.data();
        const transcriptText = Array.isArray(data.transcript)
            ? data.transcript.join('\n')
            : typeof data.transcript === 'string'
                ? data.transcript
                : null;

        if (!transcriptText) return res.status(400).json({ error: 'Transcript format invalid' });

        const analysisRef = db.collection('analyzedData').doc(quarter);
        const analysisSnap = await analysisRef.get();
        if (analysisSnap.exists) {
            return res.status(200).json({ message: `Transcript ${quarter} already analyzed.` });
        }

        // === Analyze + Embed in one call ===
        const result = await extractInsightsFromTranscript(transcriptText);
        if (!result || !result.insights || !result.chunksWithEmbeddings) {
            return res.status(500).json({ error: 'Failed to extract insights' });
        }

        const { insights, chunksWithEmbeddings } = result;

        await analysisRef.set({
            quarter,
            sentiment: {
                management: insights.managementSentiment,
                qa: insights.qaSentiment,
            },
            toneChange: insights.toneChange,
            themes: insights.strategicFocuses,
            analyzedAt: new Date().toISOString(),
        });

        // Store chunks + embeddings under subcollection
        const chunksCollectionRef = db.collection('analyzedData').doc(quarter).collection('chunks');
        const batch = db.batch();

        chunksWithEmbeddings.forEach((chunkObj, i) => {
            const chunkRef = chunksCollectionRef.doc(`chunk${i + 1}`);
            batch.set(chunkRef, {
                quarter,
                index: i,
                text: chunkObj.text,
                embedding: chunkObj.embedding,
                createdAt: new Date().toISOString(),
            });
        });

        await batch.commit();

        return res.status(200).json({ message: `Analyzed and embedded ${quarter}` });
    } catch (err) {
        console.error('❌ Analysis error:', err);
        return res.status(500).json({ error: err.message || 'Internal error' });
    }
}