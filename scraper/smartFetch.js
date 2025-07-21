// scraper/smartFetch.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Define outputDir before use
const outputDir = path.join(__dirname, 'transcripts');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const baseUrl = 'https://tickertrends.io/transcripts/NVDA';

const getCurrentQuarter = (month) => {
    if (month < 3) return 'Q1';
    if (month < 6) return 'Q2';
    if (month < 9) return 'Q3';
    return 'Q4';
};

const getLastNQuarters = (n = 4) => {
    const result = [];
    const now = new Date();
    let year = now.getFullYear() + 1;
    let month = now.getMonth();
    let qMap = ['Q1', 'Q2', 'Q3', 'Q4'];
    let currentQIndex = qMap.indexOf(getCurrentQuarter(month));

    while (result.length < n) {
        const quarter = qMap[currentQIndex];
        result.push({ quarter, year });

        currentQIndex--;
        if (currentQIndex < 0) {
            currentQIndex = 3;
            year--;
        }
    }

    return result;
};

const scrapeTranscriptFromURL = async (quarter, year) => {
    const url = `${baseUrl}/${quarter}-earnings-transcript-${year}`;
    try {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        // Extract title
        const title = $('#__next h1.text-3xl.font-bold.leading-tight.text-gray-900').first().text().trim();
        // Extract embedded JSON string from script tag
        const rawJSON = $('#__NEXT_DATA__').html();
        const parsed = JSON.parse(rawJSON);
        const transcriptRaw = parsed?.props?.pageProps?.transcript || '';

        if (!transcriptRaw) throw new Error('Transcript content not found in JSON');

        const paragraphs = transcriptRaw
            .split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 20);

        console.log(`🔍 Found ${paragraphs.length} paragraphs for ${quarter}-${year}`);

        const output = {
            quarter: `${quarter}-${year}`,
            title,
            url,
            fetchedAt: new Date().toISOString(),
            transcript: paragraphs
        };

        // Save to /scraper/transcripts/
        const localPath = path.join(outputDir, `${quarter}-${year}.json`);
        fs.writeFileSync(localPath, JSON.stringify(output, null, 2));

        // ✅ ALSO copy to /public/transcripts/
        const reactPublicPath = path.join(__dirname, '..', 'public', 'transcripts');
        if (!fs.existsSync(reactPublicPath)) fs.mkdirSync(reactPublicPath, { recursive: true });

        fs.copyFileSync(localPath, path.join(reactPublicPath, `${quarter}-${year}.json`));

        console.log(`✅ Saved & copied: ${quarter}-${year}`);
        return true;
    } catch (err) {
        console.warn(`❌ Failed to fetch ${quarter}-${year}: ${err.message}`);
        return false;
    }
};

const fetchLastNAvailable = async (n = 4) => {
    const quarters = getLastNQuarters(12);
    let fetched = 0;

    for (const { quarter, year } of quarters) {
        const success = await scrapeTranscriptFromURL(quarter, year);
        if (success) fetched++;
        if (fetched >= n) break;
    }
};

fetchLastNAvailable();
