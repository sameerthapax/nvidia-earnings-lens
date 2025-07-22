// api/scrape.js
import { scrapeAndSaveToFirestore } from "../utils/scraperHandler.js";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const message = await scrapeAndSaveToFirestore(); // <- your function
        res.status(200).json({ message }); // ✅ always respond with valid JSON
    } catch (err) {
        console.error('Scrape error:', err);
        res.status(500).json({ error: err.message || 'Unknown error' });
    }
}