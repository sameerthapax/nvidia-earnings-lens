// ai/sentimentAPI.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const analyzeSentiment = async (text) => {
    try {
        const response = await axios.post(
            'https://router.huggingface.co/hf-inference/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english',
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );

        console.log('📊 Sentiment:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Sentiment analysis failed:', error.response?.data || error.message);
        return null;
    }
};
console.log('API Key:', process.env.HUGGINGFACE_API_KEY);
// Example usage (for testing)
if (process.env.NODE_ENV !== 'production') {
    analyzeSentiment("We're excited about our AI growth in data centers.");
}
// Only run this test when executing directly (not when imported)
if (import.meta.url === `file://${process.argv[1]}`) {
    const testText = "We're excited about our AI growth in data centers.";
    analyzeSentiment(testText).then(result => {
        console.log('✅ Result:', result);
    });
}
export default analyzeSentiment;