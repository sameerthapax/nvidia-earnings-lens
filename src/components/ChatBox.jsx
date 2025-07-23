// components/ChatBox.jsx
import React, { useState } from 'react';
import '../styles/ChatBox.css'; // optional styles

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
            setMessages(prev => [...prev, { sender: 'ai', text: '❌ Failed to get response.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="chatbox">
            <div className="chat-history">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                {loading && <div className="message ai">Typing...</div>}
            </div>
            <div className="chat-input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask something about this quarter..."
                />
                <button onClick={sendMessage} disabled={loading || !input.trim()}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;