import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { users, currentUser, exploreImages } from '../../data/mockData';
import Avatar from '../../components/Avatar/Avatar';
import Modal from '../../components/Modal/Modal';
import './ProfilePage.css';

const GridIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
const TaggedIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;

const HIGHLIGHTS = [
    { id: 'h1', label: 'Travel', img: 'https://i.pravatar.cc/64?img=20' },
    { id: 'h2', label: 'Code', img: 'https://i.pravatar.cc/64?img=21' },
    { id: 'h3', label: 'Food', img: 'https://i.pravatar.cc/64?img=22' },
    { id: 'h4', label: 'Photos', img: 'https://i.pravatar.cc/64?img=23' },
    { id: 'h5', label: 'Events', img: 'https://i.pravatar.cc/64?img=24' },
];

const gridImages = exploreImages.slice(0, 9);

export default function ProfilePage() {
    const { user: username } = useParams();
    const navigate = useNavigate();
    const [following, setFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedHighlight, setSelectedHighlight] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState(null);

    const isOwn = username === currentUser.username || !username;
    const profileUser = isOwn ? currentUser : (users.find(u => u.username === username) || users[0]);
    const displayBio = bio ?? profileUser.bio;

    const handleMessage = () => navigate('/messages');

    const handleLikePost = (id) => setLikedPosts(l => ({ ...l, [id]: !l[id] }));

    return (
        <div className="profile-page">
            {/* Header */}
            <div className="profile-header">
                <div className="profile-avatar-section">
                    <Avatar src={profileUser.avatar} size={90} hasStory={!isOwn} seen={false} />
                </div>

                <div className="profile-info">
                    <div className="profile-info__row">
                        <h1 className="profile-username">{profileUser.username}</h1>
                        {isOwn ? (
                            <>
                                <button className="profile-btn-outline" onClick={() => setEditMode(true)}>Edit profile</button>
                                <button className="profile-btn-outline">View archive</button>
                            </>
                        ) : (
                            <>
                                <button
                                    className={`profile-primary-btn ${following ? 'profile-primary-btn--following' : ''}`}
                                    onClick={() => setFollowing(f => !f)}
                                >
                                    {following ? 'Following' : 'Follow'}
                                </button>
                                <button className="profile-btn-outline" onClick={handleMessage}>Message</button>
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="profile-stats">
                        <div className="profile-stat">
                            <span className="profile-stat__num">{profileUser.posts.toLocaleString()}</span>
                            <span className="profile-stat__label">posts</span>
                        </div>
                        <div className="profile-stat" style={{ cursor: 'pointer' }}>
                            <span className="profile-stat__num">{(profileUser.followers + (following && !isOwn ? 1 : 0)).toLocaleString()}</span>
                            <span className="profile-stat__label">followers</span>
                        </div>
                        <div className="profile-stat" style={{ cursor: 'pointer' }}>
                            <span className="profile-stat__num">{profileUser.following.toLocaleString()}</span>
                            <span className="profile-stat__label">following</span>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="profile-bio">
                        <p className="profile-bio__name">{profileUser.fullName}</p>
                        {editMode ? (
                            <textarea
                                value={displayBio}
                                onChange={e => setBio(e.target.value)}
                                onBlur={() => setEditMode(false)}
                                autoFocus
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, color: 'var(--text-primary)', fontSize: 13, width: '100%', resize: 'none' }}
                            />
                        ) : (
                            <p className="profile-bio__text" onClick={isOwn ? () => setEditMode(true) : undefined} style={{ cursor: isOwn ? 'text' : 'default' }}>
                                {displayBio}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Highlights */}
            <div className="profile-highlights">
                {HIGHLIGHTS.map(h => (
                    <div key={h.id} className="profile-highlight" onClick={() => setSelectedHighlight(h)} style={{ cursor: 'pointer' }}>
                        <div className="profile-highlight__ring">
                            <img src={h.img} alt={h.label} className="profile-highlight__img" />
                        </div>
                        <span className="profile-highlight__label">{h.label}</span>
                    </div>
                ))}
                {isOwn && (
                    <div className="profile-highlight profile-highlight--new">
                        <div className="profile-highlight__ring profile-highlight__ring--new">+</div>
                        <span className="profile-highlight__label">New</span>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                <button className={`profile-tab ${activeTab === 'posts' ? 'profile-tab--active' : ''}`} onClick={() => setActiveTab('posts')}>
                    <GridIcon /> Posts
                </button>
                <button className={`profile-tab ${activeTab === 'tagged' ? 'profile-tab--active' : ''}`} onClick={() => setActiveTab('tagged')}>
                    <TaggedIcon /> Tagged
                </button>
            </div>

            {/* Grid */}
            <div className="profile-grid">
                {(activeTab === 'posts' ? gridImages : gridImages.slice(0, 5)).map(item => (
                    <div key={item.id} className="profile-grid__item" onClick={() => setSelectedPost(item)}>
                        <img src={item.image} alt="" className="profile-grid__img" />
                        <div className="profile-grid__overlay">
                            <span>❤ {(item.likes + (likedPosts[item.id] ? 1 : 0)).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Post modal */}
            <Modal isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} title="">
                {selectedPost && (
                    <div>
                        <img src={selectedPost.image} alt="" style={{ width: '100%', borderRadius: 8, aspectRatio: '1', objectFit: 'cover' }} />
                        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar src={profileUser.avatar} size={32} />
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{profileUser.username}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                                {(selectedPost.likes + (likedPosts[selectedPost.id] ? 1 : 0)).toLocaleString()} likes
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                            <button
                                onClick={() => handleLikePost(selectedPost.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}
                            >
                                {likedPosts[selectedPost.id] ? '❤️' : '🤍'}
                            </button>
                            <button
                                onClick={() => handleMessage()}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0095f6', fontWeight: 600, fontSize: 13 }}
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Highlight viewer modal */}
            {selectedHighlight && (
                <div className="story-modal" onClick={() => setSelectedHighlight(null)}>
                    <div className="story-modal__content" onClick={e => e.stopPropagation()}>
                        <div className="story-modal__bar" />
                        <img src={selectedHighlight.img} alt="" className="story-modal__avatar" />
                        <p className="story-modal__username">{selectedHighlight.label}</p>
                        <img
                            src={`https://picsum.photos/seed/${selectedHighlight.id}/400/700`}
                            alt=""
                            className="story-modal__img"
                        />
                        <button className="story-modal__close" onClick={() => setSelectedHighlight(null)}>✕</button>
                    </div>
                </div>
            )}
        </div>
    );
}
