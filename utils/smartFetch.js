import axios from 'axios';
import * as cheerio from 'cheerio';

const baseUrl = 'https://tickertrends.io/transcripts/NVDA';

export const getCurrentQuarter = (month) => {
    if (month < 3) return 'Q1';
    if (month < 6) return 'Q2';
    if (month < 9) return 'Q3';
    return 'Q4';
};

export const getLastNQuarters = (n = 4) => {
    const result = [];
    const now = new Date();
    let year = now.getFullYear() + 1;
    let month = now.getMonth();
    const qMap = ['Q1', 'Q2', 'Q3', 'Q4'];
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

export const scrapeTranscriptFromURL = async (quarter, year) => {
    const url = `${baseUrl}/${quarter}-earnings-transcript-${year}`;
    try {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        const title = $('#__next h1.text-3xl.font-bold.leading-tight.text-gray-900')
            .first()
            .text()
            .trim();

        const rawJSON = $('#__NEXT_DATA__').html();
        const parsed = JSON.parse(rawJSON);
        const transcriptRaw = parsed?.props?.pageProps?.transcript || '';

        if (!transcriptRaw) throw new Error('Transcript content not found in JSON');

        const paragraphs = transcriptRaw
            .split('\n')
            .map((p) => p.trim())
            .filter((p) => p.length > 20);

        console.log(`🔍 Found ${paragraphs.length} paragraphs for ${quarter}-${year}`);

        return {
            quarter: `${quarter}-${year}`,
            title,
            url,
            fetchedAt: new Date().toISOString(),
            transcript: paragraphs,
        };
    } catch (err) {
        console.warn(`❌ Failed to fetch ${quarter}-${year}: ${err.message}`);
        return null;
    }
};