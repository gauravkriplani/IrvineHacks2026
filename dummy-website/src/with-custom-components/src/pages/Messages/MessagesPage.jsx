import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { conversations, messages as allMessages, currentUser, users } from '../../data/mockData';
import Avatar from '../../components/Avatar/Avatar';
import './MessagesPage.css';

const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const EditIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>;

const messageRequests = [
    { id: 'r1', user: users[5], message: 'Hey! Love your content 👋', time: '2d' },
    { id: 'r2', user: users[6], message: 'Can we collab? 🎵', time: '3d' },
    { id: 'r3', user: users[7], message: 'DM me for the collab details', time: '5d' },
];

export default function MessagesPage() {
    const navigate = useNavigate();
    const [active, setActive] = useState(conversations[0]);
    const [input, setInput] = useState('');
    const [msgs, setMsgs] = useState(allMessages);
    const [tab, setTab] = useState('messages');
    const [acceptedRequests, setAcceptedRequests] = useState({});

    const send = (e) => {
        e?.preventDefault();
        if (!input.trim()) return;
        const cid = active.id;
        const newMsg = { id: `m${Date.now()}`, from: 'u0', text: input, time: 'Now' };
        setMsgs(m => ({ ...m, [cid]: [...(m[cid] || []), newMsg] }));
        setInput('');
    };

    const acceptRequest = (req) => {
        setAcceptedRequests(r => ({ ...r, [req.id]: true }));
        // Add to conversations and switch to messages tab
        setTab('messages');
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
                    <button
                        className={`messages-tab ${tab === 'messages' ? 'messages-tab--active' : ''}`}
                        onClick={() => setTab('messages')}
                    >
                        Messages
                    </button>
                    <button
                        className={`messages-tab ${tab === 'requests' ? 'messages-tab--active' : ''}`}
                        onClick={() => setTab('requests')}
                    >
                        Requests {messageRequests.filter(r => !acceptedRequests[r.id]).length > 0 && (
                            <span style={{ background: '#ed4956', color: 'white', borderRadius: '50%', fontSize: 10, padding: '2px 5px', marginLeft: 4 }}>
                                {messageRequests.filter(r => !acceptedRequests[r.id]).length}
                            </span>
                        )}
                    </button>
                </div>

                {tab === 'messages' ? (
                    conversations.map(conv => (
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
                    ))
                ) : (
                    <div style={{ padding: 16 }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>Message requests</p>
                        {messageRequests.map(req => (
                            <div key={req.id} className="conv-item" style={{ opacity: acceptedRequests[req.id] ? 0.5 : 1 }}>
                                <Avatar src={req.user.avatar} size={44} />
                                <div className="conv-item__info">
                                    <p className="conv-item__name">{req.user.username}</p>
                                    <p className="conv-item__last">{req.message}</p>
                                </div>
                                {!acceptedRequests[req.id] && (
                                    <button
                                        onClick={() => acceptRequest(req)}
                                        style={{ background: '#0095f6', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}
                                    >
                                        Accept
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right chat */}
            <div className="messages-chat">
                {/* Header */}
                <div className="chat-header" style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${active.user.username}`)}>
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

                {/* Input with Send button */}
                <form className="chat-input-wrap" onSubmit={send}>
                    <input
                        className="chat-input"
                        placeholder={`Message ${active.user.username}…`}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button type="submit" className="chat-send-btn" style={{ opacity: input ? 1 : 0.4 }}>
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
}
