import React, { useState } from 'react';

export default function ScrapeButton() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleScrape = async () => {
        setLoading(true);
        setStatus('Scraping and analyzing...');

        try {
            const res = await fetch('/api/scrape', {
                method: 'POST'
            });

            const data = await res.json();
            if (res.ok) {
                setStatus(`✅ Success: ${data.message}`);
            } else {
                setStatus(`❌ Failed: ${data.error}`);
            }
        } catch (err) {
            setStatus(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleScrape} disabled={loading}>
                {loading ? 'Processing...' : 'Scrape & Analyze'}
            </button>
            {status && <p style={{ marginTop: '0.5rem' }}>{status}</p>}
        </div>
    );
}