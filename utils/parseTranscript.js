export const extractTranscriptText = (rawTranscriptBlock) => {
    try {
        const parsed = JSON.parse(rawTranscriptBlock);
        return parsed.props.pageProps.transcript;
    } catch (err) {
        console.error("❌ Failed to parse transcript block:", err.message);
        return null;
    }
};

export const chunkText = (text, maxLen = 2000) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += maxLen) {
        chunks.push(text.slice(i, i + maxLen));
    }
    return chunks;
};