import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { scrapeTranscriptFromURL, getLastNQuarters } from './smartFetch.js';
import dotenv from 'dotenv';
dotenv.config();
// Initialize Firebase once
if (!getApps().length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY);
    console.log(serviceAccount);
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore();

export async function scrapeAndSaveToFirestore(n = 5) {
    const quarters = getLastNQuarters(12);
    let saved = 0;

    for (const { quarter, year } of quarters) {
        try {
            const transcript = await scrapeTranscriptFromURL(quarter, year);
            if (!transcript || !transcript.transcript?.length) {
                console.warn(`⚠️ No transcript found for ${quarter}-${year}`);
                continue;
            }

            const docRef = db.collection('transcripts').doc(`${quarter}-${year}`);
            await docRef.set(transcript);

            console.log(`✅ Saved to Firestore: ${quarter}-${year}`);
            saved++;
            if (saved >= n) break;
        } catch (err) {
            console.error(`❌ Error scraping ${quarter}-${year}:`, err.message);
            // Don't break — continue with next quarter
        }
    }

    const msg = `Scraped and saved ${saved} transcript(s) to Firestore.`;
    console.log(msg);
    return msg;
}