import { useState } from 'react';
import { reels } from '../../data/mockData';
import Avatar from '../../components/Avatar/Avatar';
import './ReelsPage.css';

const HeartIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
const CommentIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const ShareIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const MoreIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>;
const MusicIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;

export default function ReelsPage() {
    const [likedReels, setLikedReels] = useState({});
    const [current, setCurrent] = useState(0);

    const toggleLike = (id) => {
        setLikedReels(lr => ({ ...lr, [id]: !lr[id] }));
    };

    return (
        <div className="reels-page">
            <div className="reels-container">
                {reels.map((reel, idx) => (
                    <div key={reel.id} className={`reel-item ${idx === current ? 'reel-item--active' : ''}`}>
                        {/* Background image as fake video */}
                        <img src={reel.thumbnail} alt="" className="reel-item__bg" />
                        <div className="reel-item__overlay" />

                        {/* Right actions */}
                        <div className="reel-item__actions">
                            <button className={`reel-action ${likedReels[reel.id] ? 'reel-action--liked' : ''}`} onClick={() => toggleLike(reel.id)}>
                                <HeartIcon />
                                <span>{likedReels[reel.id] ? (reel.likes + 1).toLocaleString() : reel.likes.toLocaleString()}</span>
                            </button>
                            <button className="reel-action">
                                <CommentIcon />
                                <span>{reel.comments.toLocaleString()}</span>
                            </button>
                            <button className="reel-action"><ShareIcon /><span>Share</span></button>
                            <button className="reel-action"><MoreIcon /></button>
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
                                <button className="reel-follow-btn">Follow</button>
                            </div>
                            <p className="reel-item__caption">{reel.caption}</p>
                            <div className="reel-item__audio">
                                <MusicIcon />
                                <span>{reel.audio} · Original audio</span>
                            </div>
                        </div>

                        {/* Play pause overlay */}
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
