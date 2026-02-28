import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import './PostCard.css';

const HeartIcon = ({ filled }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? '#ed4956' : 'none'} stroke={filled ? '#ed4956' : 'currentColor'} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
const CommentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
const ShareIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);
const SaveIcon = ({ filled }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <polygon points="19 21 12 16 5 21 5 3 19 3 19 21" />
    </svg>
);
const VerifiedIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095f6">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default function PostCard({ post, onLike, onSave }) {
    const [showAllCaption, setShowAllCaption] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [shareToast, setShareToast] = useState(false);

    const caption = post.caption;
    const isLong = caption.length > 100;

    const handleShare = () => {
        navigator.clipboard?.writeText(`https://instagram.com/p/${post.id}`).catch(() => { });
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2000);
    };

    const handlePostComment = () => {
        if (!comment.trim()) return;
        setComments(c => [...c, { id: Date.now(), text: comment, user: 'you.dev' }]);
        setComment('');
    };

    return (
        <article className="post-card">
            {/* Header */}
            <div className="post-card__header">
                <div className="post-card__user">
                    <Link to={`/profile/${post.user.username}`}>
                        <Avatar src={post.user.avatar} alt={post.user.username} size={36} hasStory={true} seen={false} />
                    </Link>
                    <div className="post-card__user-info">
                        <Link to={`/profile/${post.user.username}`} className="post-card__username">
                            {post.user.username}
                            {post.user.verified && <VerifiedIcon />}
                        </Link>
                        {post.location && <span className="post-card__location">{post.location}</span>}
                    </div>
                </div>
                {/* Settings button removed */}
            </div>

            {/* Image */}
            <div className={`post-card__image-wrap ${!imgLoaded ? 'skeleton' : ''}`} style={{ minHeight: 300 }}>
                <img
                    className="post-card__image"
                    src={post.image}
                    alt={post.caption}
                    onLoad={() => setImgLoaded(true)}
                    onDoubleClick={() => onLike(post.id)}
                    style={{ display: imgLoaded ? 'block' : 'none' }}
                />
            </div>

            {/* Actions */}
            <div className="post-card__actions">
                <div className="post-card__actions-left">
                    <button className={`post-card__action-btn ${post.liked ? 'post-card__action-btn--liked' : ''}`} onClick={() => onLike(post.id)}>
                        <HeartIcon filled={post.liked} />
                    </button>
                    <button className="post-card__action-btn" onClick={() => setShowComments(v => !v)}>
                        <CommentIcon />
                    </button>
                    <button className="post-card__action-btn" onClick={handleShare}>
                        <ShareIcon />
                    </button>
                </div>
                <button className={`post-card__action-btn ${post.saved ? 'post-card__action-btn--saved' : ''}`} onClick={() => onSave(post.id)}>
                    <SaveIcon filled={post.saved} />
                </button>
            </div>

            {shareToast && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 16px 4px', animation: 'fadeIn 0.2s' }}>
                    🔗 Link copied!
                </div>
            )}

            {/* Likes */}
            <div className="post-card__likes">
                {post.liked ? `${(post.likes + 1).toLocaleString()} likes` : `${post.likes.toLocaleString()} likes`}
            </div>

            {/* Caption */}
            <div className="post-card__caption">
                <Link to={`/profile/${post.user.username}`} className="post-card__caption-username">{post.user.username}</Link>{' '}
                {isLong && !showAllCaption ? (
                    <>{caption.slice(0, 100)}…{' '}<button className="post-card__more-btn" onClick={() => setShowAllCaption(true)}>more</button></>
                ) : caption}
            </div>

            {/* Comments count toggle */}
            <button className="post-card__comments-link" onClick={() => setShowComments(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)', fontSize: 13, display: 'block', textAlign: 'left', paddingLeft: 16, paddingBottom: 4 }}>
                View all {post.comments + comments.length} comments
            </button>

            {/* Inline comments panel */}
            {showComments && (
                <div className="post-card__comments-panel">
                    {comments.map(c => (
                        <div key={c.id} className="post-card__comment-item">
                            <span className="post-card__caption-username">{c.user}</span> {c.text}
                        </div>
                    ))}
                </div>
            )}

            {/* Add comment */}
            <div className="post-card__comment-box">
                <input
                    className="post-card__comment-input"
                    placeholder="Add a comment…"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePostComment()}
                />
                {comment && (
                    <button className="post-card__post-btn" onClick={handlePostComment}>Post</button>
                )}
            </div>

            <div className="post-card__timestamp">{post.timestamp} ago</div>
        </article>
    );
}
