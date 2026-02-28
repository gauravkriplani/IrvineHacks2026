import { useState } from 'react';
import { conversations, messages as allMessages, currentUser } from '../../data/mockData';
import Avatar from '../../components/Avatar/Avatar';
import './MessagesPage.css';

const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const EditIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>;

export default function MessagesPage() {
    const [active, setActive] = useState(conversations[0]);
    const [input, setInput] = useState('');
    const [msgs, setMsgs] = useState(allMessages);

    const send = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const cid = active.id;
        const newMsg = { id: `m${Date.now()}`, from: 'u0', text: input, time: 'Now' };
        setMsgs(m => ({ ...m, [cid]: [...(m[cid] || []), newMsg] }));
        setInput('');
    };

    const thread = msgs[active.id] || [];

    return (
        <div className="messages-page">
            {/* Left panel */}
            <div className="messages-list">
                <div className="messages-list__header">
                    <span className="messages-list__title">{currentUser.username}</span>
                    <button className="messages-list__edit"><EditIcon /></button>
                </div>
                <div className="messages-list__tabs">
                    <button className="messages-tab messages-tab--active">Messages</button>
                    <button className="messages-tab">Requests</button>
                </div>
                {conversations.map(conv => (
                    <div
                        key={conv.id}
                        className={`conv-item ${active.id === conv.id ? 'conv-item--active' : ''}`}
                        onClick={() => setActive(conv)}
                    >
                        <div style={{ position: 'relative' }}>
                            <Avatar src={conv.user.avatar} size={54} />
                            {conv.online && <span className="conv-online-dot" />}
                        </div>
                        <div className="conv-item__info">
                            <p className="conv-item__name">{conv.user.username}{conv.unread > 0 && <span className="conv-unread">{conv.unread}</span>}</p>
                            <p className="conv-item__last">{conv.lastMessage}</p>
                        </div>
                        <span className="conv-item__time">{conv.time}</span>
                    </div>
                ))}
            </div>

            {/* Right chat */}
            <div className="messages-chat">
                {/* Header */}
                <div className="chat-header">
                    <Avatar src={active.user.avatar} size={40} />
                    <div>
                        <p className="chat-header__name">{active.user.username}</p>
                        <p className="chat-header__status">{active.online ? 'Active now' : 'Offline'}</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {thread.map(msg => (
                        <div key={msg.id} className={`chat-bubble-wrap ${msg.from === 'u0' ? 'chat-bubble-wrap--mine' : ''}`}>
                            {msg.from !== 'u0' && <Avatar src={active.user.avatar} size={28} />}
                            <div className={`chat-bubble ${msg.from === 'u0' ? 'chat-bubble--mine' : 'chat-bubble--theirs'}`}>
                                {msg.text}
                            </div>
                            <span className="chat-bubble-time">{msg.time}</span>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <form className="chat-input-wrap" onSubmit={send}>
                    <input
                        className="chat-input"
                        placeholder={`Message ${active.user.username}…`}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    {input ? (
                        <button type="submit" className="chat-send-btn"><SendIcon /></button>
                    ) : (
                        <button type="button" className="chat-send-btn">❤</button>
                    )}
                </form>
            </div>
        </div>
    );
}
