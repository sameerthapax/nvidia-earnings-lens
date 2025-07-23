# 📊 NVIDIA Earnings AI

NVIDIA Earnings AI is a web app that analyzes quarterly earnings call transcripts using LLMs and vector search. It extracts sentiment, strategic themes, tone shifts, and enables users to chat with each transcript for deeper insight.

---

## 🖥️ Live Demo
https://nvidia-earnings-lens.vercel.app/
(fully functional demo with real-time transcript analysis)
---

## ⚙️ Features

- 🔍 Automated transcript ingestion and chunking
- 🤖 GPT-4-powered sentiment & tone analysis
- 💬 Interactive chatbot with vector-based context retrieval
- 📈 Sentiment trends and tone visualization
- 🧠 Strategic focus extraction
- 🔎 Cosine similarity search over embedded transcript chunks

---

## 🛠️ Tech Stack

| Layer        | Tech                        |
|-------------|-----------------------------|
| Frontend     | React + Vite               |
| Backend/API  | Firebase Functions (optional) |
| Data Storage | Firebase Firestore         |
| NLP          | OpenAI GPT-4 + Whisper     |
| Embeddings   | OpenAI `text-embedding-3-small` |
| Visualization| Chart.js                   |

---

## 📂 Folder Structure
nvidia-earnings-ai/
├── src/
│   ├── components/
│   │   ├── AnalyzeButton.jsx
│   │   ├── ChatBox.jsx
│   │   ├── InsightsPanel.jsx
│   │   ├── QuarterCard.jsx
│   │   ├── TranscriptViewer.jsx
│   ├── lib/
│   │   └── firebase.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── QuarterDetails.jsx
│   │   └── About.jsx
│   ├── styles/
│   │   └── *.css
│   └── App.jsx
│
├── api/
│   ├── analyzeTranscript.js         # Analyze + embed a transcript
│   ├── queryTranscriptChat.js       # Handle chat-based retrieval + GPT-4 answer
│
├── utils/
│   ├── analyzeTranscript.js         # chunking, summarization, embedding logic
│   └── cosineSim.js                 # cosine similarity calculation
│
├── public/
│   └── …
├── .env
├── vite.config.js
├── package.json
└── README.md

---

## 🧪 How It Works

1. **Transcript Scraping**: Auto latest transcript scraping from https://tickertrends.io/transcripts/
   - Uses `axios` to fetch HTML and `cheerio` to parse.
   - Extracts transcript text and metadata (date, quarter, etc.).
   - stored in Firestore under `transcripts/{quarter}`.
2. **Chunking + Embedding**: Transcript is chunked into ~1200 token segments and embedded via OpenAI and stored in Firestore:
   - Uses OpenAI's `text-embedding-3-small` for embeddings.
   - Chunks are stored under `transcripts/{quarter}/chunks/{chunkId}`.
3. **Analysis**: gpt-3.5-turbo-0125 summarizes each chunk and generates insights:
    - `managementSentiment`
    - `qaSentiment`
    - `toneChange`
    - `strategicFocuses`
4. **Firestore Structure**:
transcripts/
   └── Q1-2026
   └── transcript: [raw text]

analyzedData/
└── Q1-2026/
    ├── sentiment
    ├── toneChange
    ├── themes
    └── chunks/
        ├── chunk0
        ├── chunk1

5. **Chat Interface**:
- User asks a question about a quarter
- Top 5 similar chunks (via cosine similarity) are retrieved
- Sent to gpt-3.5-turbo-0125 with the question for final answer

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/nvidia-earnings-ai.git
cd nvidia-earnings-ai
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```
(also add any other necessary Firebase config variables like "FIREBASE_SERVICE_KEY" for server-side functions)
### 4. Download Vercel CLI
```bash
npm install -g vercel
```
### 5. Launch on vercel dev mode
```bash
vercel dev
```
## 💬 Use Cases

- 📊 **Investor Analysis**: Quickly grasp executive tone and focus across quarters
- 🧠 **LLM Demos**: Showcase real-world vector search + GPT integration
- 📚 **EdTech**: Convert transcripts into digestible strategic insights
- 🤖 **AI Agents**: Build agents that continuously monitor sentiment shifts

---

## 🧩 Future Ideas

- 🕵️ Compare NVIDIA with other companies
- 🗓️ Timeline-based sentiment visualization
- 🧑‍💻 Fine-tune your own sentiment model
- 📤 Upload your own transcripts for analysis

---

## 📝 License

MIT © 2025 Sameer Thop

---

## 👋 Acknowledgements

- [OpenAI](https://openai.com/)
- [Firebase](https://firebase.google.com/)
- [Chart.js](https://www.chartjs.org/)
- [Transcript Scraping](https://tickertrends.io/transcripts/)