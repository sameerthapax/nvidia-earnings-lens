// runScrape.js
import dotenv from 'dotenv';
dotenv.config(); // ✅ Load env vars

import { scrapeAndSaveToFirestore } from './scraperHandler.js'; // Adjust path if needed

(async () => {
    try {
        const result = await scrapeAndSaveToFirestore(); // Optionally pass a number: (3) for 3 quarters
        console.log('✅ Success:', result);
    } catch (err) {
        console.error('❌ Error during test:', err);
    }
})();