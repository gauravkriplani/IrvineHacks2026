import { useState } from 'react';
import { reels } from '../../data/mockData';
import Avatar from '../../components/Avatar/Avatar';
import './ReelsPage.css';

const HeartIcon = ({ filled }) => <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? '#ed4956' : 'none'} stroke={filled ? '#ed4956' : 'white'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
const CommentIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const ShareIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const MusicIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

export default function ReelsPage() {
    const [likedReels, setLikedReels] = useState({});
    const [followedReels, setFollowedReels] = useState({});
    const [current, setCurrent] = useState(0);
    const [commentPanel, setCommentPanel] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState({});
    const [shareToast, setShareToast] = useState(null);

    const toggleLike = (id) => setLikedReels(lr => ({ ...lr, [id]: !lr[id] }));
    const toggleFollow = (id) => setFollowedReels(f => ({ ...f, [id]: !f[id] }));

    const handleShare = (id) => {
        navigator.clipboard?.writeText(`https://instagram.com/reels/${id}`).catch(() => { });
        setShareToast(id);
        setTimeout(() => setShareToast(null), 2000);
    };

    const handlePostComment = (reelId) => {
        if (!commentText.trim()) return;
        setComments(c => ({ ...c, [reelId]: [...(c[reelId] || []), { id: Date.now(), text: commentText, user: 'you.dev' }] }));
        setCommentText('');
    };

    return (
        <div className="reels-page">
            <div className="reels-container">
                {reels.map((reel, idx) => (
                    <div key={reel.id} className={`reel-item ${idx === current ? 'reel-item--active' : ''}`}>
                        {/* Background image as fake video */}
                        <img src={reel.thumbnail} alt="" className="reel-item__bg" />
                        <div className="reel-item__overlay" />

                        {/* Right actions — no settings */}
                        <div className="reel-item__actions">
                            <button className={`reel-action ${likedReels[reel.id] ? 'reel-action--liked' : ''}`} onClick={() => toggleLike(reel.id)}>
                                <HeartIcon filled={likedReels[reel.id]} />
                                <span>{likedReels[reel.id] ? (reel.likes + 1).toLocaleString() : reel.likes.toLocaleString()}</span>
                            </button>
                            <button className="reel-action" onClick={() => setCommentPanel(commentPanel === reel.id ? null : reel.id)}>
                                <CommentIcon />
                                <span>{(reel.comments + (comments[reel.id]?.length || 0)).toLocaleString()}</span>
                            </button>
                            <button className="reel-action" onClick={() => handleShare(reel.id)}>
                                <ShareIcon />
                                <span>{shareToast === reel.id ? 'Copied!' : 'Share'}</span>
                            </button>
                            {/* Spinning record */}
                            <div className="reel-record">
                                <Avatar src={reel.user.avatar} size={36} />
                            </div>
                        </div>

                        {/* Bottom info */}
                        <div className="reel-item__bottom">
                            <div className="reel-item__user">
                                <Avatar src={reel.user.avatar} size={36} />
                                <span className="reel-item__username">@{reel.user.username}</span>
                                <button
                                    className="reel-follow-btn"
                                    style={{ opacity: followedReels[reel.id] ? 0.7 : 1 }}
                                    onClick={() => toggleFollow(reel.id)}
                                >
                                    {followedReels[reel.id] ? 'Following' : 'Follow'}
                                </button>
                            </div>
                            <p className="reel-item__caption">{reel.caption}</p>
                            <div className="reel-item__audio">
                                <MusicIcon />
                                <span>{reel.audio} · Original audio</span>
                            </div>
                        </div>

                        {/* Comment panel */}
                        {commentPanel === reel.id && (
                            <div className="reel-comment-panel" onClick={e => e.stopPropagation()}>
                                <div className="reel-comment-panel__header">
                                    <span>Comments</span>
                                    <button onClick={() => setCommentPanel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}><CloseIcon /></button>
                                </div>
                                <div className="reel-comment-panel__list">
                                    {(comments[reel.id] || []).map(c => (
                                        <div key={c.id} style={{ padding: '6px 0', fontSize: 13 }}>
                                            <strong>{c.user}</strong> {c.text}
                                        </div>
                                    ))}
                                    {(!comments[reel.id] || comments[reel.id].length === 0) && (
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>No comments yet</p>
                                    )}
                                </div>
                                <div className="reel-comment-panel__input">
                                    <input
                                        placeholder="Add a comment…"
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handlePostComment(reel.id)}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 20, padding: '8px 14px', color: 'white', width: '100%', fontSize: 13 }}
                                    />
                                    <button onClick={() => handlePostComment(reel.id)} style={{ background: 'none', border: 'none', color: '#0095f6', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Post</button>
                                </div>
                            </div>
                        )}

                        {/* Tap zone */}
                        <div className="reel-item__tap-zone" onClick={() => setCurrent(idx)} />
                    </div>
                ))}
            </div>

            {/* Scroll indicator */}
            <div className="reels-nav">
                {reels.map((_, i) => (
                    <button key={i} className={`reels-nav__dot ${i === current ? 'reels-nav__dot--active' : ''}`} onClick={() => setCurrent(i)} />
                ))}
            </div>
        </div>
    );
}
