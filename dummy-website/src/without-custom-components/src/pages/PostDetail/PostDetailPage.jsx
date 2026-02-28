import { useParams, Link } from 'react-router-dom';
import { posts } from '../../data/mockData';
import Avatar from '../../components/Avatar/Avatar';
import { useState } from 'react';
import './PostDetailPage.css';

const HeartIcon = ({ filled }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? '#ed4956' : 'none'} stroke={filled ? '#ed4956' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
const SaveIcon = ({ filled }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="19 21 12 16 5 21 5 3 19 3 19 21" /></svg>;

const fakeComments = [
    { id: 'fc1', username: 'luna.codes', text: 'Absolutely stunning! 😍', time: '1h' },
    { id: 'fc2', username: 'kai.travels', text: 'Where is this?! I need to go 🌍', time: '45m' },
    { id: 'fc3', username: 'nova.art', text: 'The lighting is 🔥🔥', time: '30m' },
    { id: 'fc4', username: 'jax.fitness', text: 'Amazing shot!', time: '20m' },
    { id: 'fc5', username: 'mia.eats', text: 'Goals 🙌', time: '5m' },
];

export default function PostDetailPage() {
    const { id } = useParams();
    const post = posts.find(p => p.id === id) || posts[0];
    const [liked, setLiked] = useState(post.liked);
    const [saved, setSaved] = useState(post.saved);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(fakeComments);

    const addComment = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setComments(c => [...c, { id: `uc${Date.now()}`, username: 'you.dev', text: comment, time: 'now' }]);
        setComment('');
    };

    return (
        <div className="post-detail-page">
            <div className="post-detail-card">
                {/* Image */}
                <div className="post-detail-image">
                    <img src={post.image} alt={post.caption} />
                </div>

                {/* Right panel */}
                <div className="post-detail-panel">
                    {/* Header */}
                    <div className="post-detail-header">
                        <Avatar src={post.user.avatar} size={36} hasStory={true} seen={false} />
                        <div style={{ flex: 1 }}>
                            <Link to={`/profile/${post.user.username}`} style={{ fontWeight: 700, fontSize: 14 }}>{post.user.username}</Link>
                            {post.location && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{post.location}</p>}
                        </div>
                    </div>

                    <div className="post-detail-divider" />

                    {/* Comments */}
                    <div className="post-detail-comments">
                        {/* Caption as first comment */}
                        <div className="post-detail-comment">
                            <Avatar src={post.user.avatar} size={32} />
                            <div>
                                <span style={{ fontWeight: 700, fontSize: 14 }}>{post.user.username}</span>{' '}
                                <span style={{ fontSize: 14 }}>{post.caption}</span>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{post.timestamp}</p>
                            </div>
                        </div>
                        {comments.map(c => (
                            <div key={c.id} className="post-detail-comment">
                                <Avatar src={`https://i.pravatar.cc/40?u=${c.username}`} size={32} />
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 700, fontSize: 14 }}>{c.username}</span>{' '}
                                    <span style={{ fontSize: 14 }}>{c.text}</span>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{c.time}</p>
                                </div>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)', fontSize: 12 }}>❤</button>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="post-detail-divider" />
                    <div className="post-detail-actions">
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => setLiked(l => !l)}>
                                <HeartIcon filled={liked} />
                            </button>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            </button>
                        </div>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => setSaved(s => !s)}>
                            <SaveIcon filled={saved} />
                        </button>
                    </div>
                    <div className="post-detail-likes">{liked ? (post.likes + 1).toLocaleString() : post.likes.toLocaleString()} likes</div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', padding: '0 16px 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{post.timestamp} ago</p>

                    {/* Add comment */}
                    <div className="post-detail-divider" />
                    <form className="post-detail-comment-form" onSubmit={addComment}>
                        <input
                            className="post-detail-comment-input"
                            placeholder="Add a comment…"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        {comment && <button type="submit" className="post-detail-post-btn">Post</button>}
                    </form>
                </div>
            </div>
        </div>
    );
}
