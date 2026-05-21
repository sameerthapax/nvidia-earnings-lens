import React, { useState } from 'react';
import '../styles/ChatBox.css';

const ChatBox = ({ quarter }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/queryTranscriptChat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quarter, question: input })
            });
            const json = await res.json();
            setMessages(prev => [...prev, { sender: 'ai', text: json.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'The response could not be generated. Try again in a moment.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <section className="chatbox reveal">
            <div className="chatbox__header">
                <div>
                    <p className="panel-kicker">Transcript chat</p>
                    <h2>Ask the call a direct question</h2>
                </div>
                <p className="chatbox__hint">
                    Submit with <kbd>Enter</kbd> and use <kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line.
                </p>
            </div>
            <div className="chat-history">
                {messages.length === 0 && (
                    <div className="chatbox__empty">
                        Ask about guidance, demand signals, AI infrastructure commentary, margin pressure, or customer mix.
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                {loading && <div className="message ai">Drafting answer…</div>}
            </div>
            <div className="chat-input">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What changed in management tone compared with the prior quarter?"
                    rows={3}
                />
                <button onClick={sendMessage} disabled={loading || !input.trim()}>Send</button>
            </div>
        </section>
    );
};

export default ChatBox;
