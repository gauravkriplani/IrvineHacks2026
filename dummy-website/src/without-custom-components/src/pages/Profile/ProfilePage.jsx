import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { users, currentUser, posts, exploreImages } from '../../data/mockData';
import Avatar from '../../components/Avatar/Avatar';
import Modal from '../../components/Modal/Modal';
import './ProfilePage.css';

const GridIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
const TaggedIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;

const highlights = ['Travel', 'Code', 'Food', 'Photos', 'Events'];
const gridImages = exploreImages.slice(0, 9);

export default function ProfilePage() {
    const { user: username } = useParams();
    const [following, setFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const [selectedPost, setSelectedPost] = useState(null);

    const isOwn = username === currentUser.username || !username;
    const profileUser = isOwn ? currentUser : (users.find(u => u.username === username) || users[0]);

    return (
        <div className="profile-page">
            {/* Header */}
            <div className="profile-header">
                {/* Avatar section */}
                <div className="profile-avatar-section">
                    <Avatar src={profileUser.avatar} size={90} hasStory={!isOwn} seen={false} />
                </div>

                {/* Info section */}
                <div className="profile-info">
                    <div className="profile-info__row">
                        <h1 className="profile-username">{profileUser.username}</h1>
                        {isOwn ? (
                            <>
                                <button className="profile-btn-outline">Edit profile</button>
                                <button className="profile-btn-outline">View archive</button>
                                <button className="profile-icon-btn"><SettingsIcon /></button>
                            </>
                        ) : (
                            <>
                                <button
                                    className={`profile-primary-btn ${following ? 'profile-primary-btn--following' : ''}`}
                                    onClick={() => setFollowing(f => !f)}
                                >
                                    {following ? 'Following' : 'Follow'}
                                </button>
                                <button className="profile-btn-outline">Message</button>
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="profile-stats">
                        <div className="profile-stat">
                            <span className="profile-stat__num">{profileUser.posts.toLocaleString()}</span>
                            <span className="profile-stat__label">posts</span>
                        </div>
                        <div className="profile-stat">
                            <span className="profile-stat__num">{(profileUser.followers + (following && !isOwn ? 1 : 0)).toLocaleString()}</span>
                            <span className="profile-stat__label">followers</span>
                        </div>
                        <div className="profile-stat">
                            <span className="profile-stat__num">{profileUser.following.toLocaleString()}</span>
                            <span className="profile-stat__label">following</span>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="profile-bio">
                        <p className="profile-bio__name">{profileUser.fullName}</p>
                        <p className="profile-bio__text">{profileUser.bio}</p>
                    </div>
                </div>
            </div>

            {/* Highlights */}
            <div className="profile-highlights">
                {highlights.map(h => (
                    <div key={h} className="profile-highlight">
                        <div className="profile-highlight__ring">
                            <img src={`https://i.pravatar.cc/64?img=${highlights.indexOf(h) + 20}`} alt={h} className="profile-highlight__img" />
                        </div>
                        <span className="profile-highlight__label">{h}</span>
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
                            <span>❤ {item.likes.toLocaleString()}</span>
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
                            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>❤ {selectedPost.likes.toLocaleString()} likes</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
