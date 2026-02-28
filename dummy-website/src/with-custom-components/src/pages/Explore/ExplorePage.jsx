import { useState } from 'react';
import { exploreImages } from '../../data/mockData';
import './ExplorePage.css';

const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const VideoIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>;

const CATEGORIES = ['For You', 'Reels', 'Music', 'Travel', 'Food', 'Architecture', 'Art', 'Sports'];
const CAT_TAGS = { 'Reels': 'video', 'Music': 'music', 'Travel': 'travel', 'Food': 'food', 'Architecture': 'arch', 'Art': 'art', 'Sports': 'sport' };

export default function ExplorePage() {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [activeTab, setActiveTab] = useState('For You');
    const [liked, setLiked] = useState({});

    const filtered = exploreImages.filter(img => {
        const matchSearch = !search || img.user.username.toLowerCase().includes(search.toLowerCase());
        const matchTab = activeTab === 'For You' || (activeTab === 'Reels' && img.isVideo) || true; // all tabs show all for demo
        return matchSearch && matchTab;
    });

    const handleLike = (id) => setLiked(l => ({ ...l, [id]: !l[id] }));

    return (
        <div className="explore-page">
            {/* Search bar */}
            <div className="explore-search">
                <div className="explore-search__wrap">
                    <SearchIcon />
                    <input
                        className="explore-search__input"
                        placeholder="Search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}>✕</button>
                    )}
                </div>
            </div>

            {/* Category tabs */}
            <div className="explore-tabs">
                {CATEGORIES.map(tab => (
                    <button
                        key={tab}
                        className={`explore-tab ${activeTab === tab ? 'explore-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Masonry grid */}
            <div className="explore-grid">
                {filtered.map((item) => (
                    <div
                        key={item.id}
                        className={`explore-grid__item ${item.isLarge ? 'explore-grid__item--large' : ''}`}
                        onClick={() => setSelected(item)}
                    >
                        <img src={item.image} alt="" className="explore-grid__img" loading="lazy" />
                        <div className="explore-grid__overlay">
                            {item.isVideo && <span className="explore-grid__video-icon"><VideoIcon /></span>}
                            <span className="explore-grid__likes">❤ {(item.likes + (liked[item.id] ? 1 : 0)).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Post preview modal */}
            {selected && (
                <div className="explore-modal" onClick={() => setSelected(null)}>
                    <div className="explore-modal__content" onClick={e => e.stopPropagation()}>
                        <img src={selected.image} alt="" className="explore-modal__img" />
                        <div className="explore-modal__info">
                            <p style={{ fontWeight: 600 }}>@{selected.user.username}</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                                {(selected.likes + (liked[selected.id] ? 1 : 0)).toLocaleString()} likes
                            </p>
                            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                                <button
                                    onClick={() => handleLike(selected.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}
                                >
                                    {liked[selected.id] ? '❤️' : '🤍'}
                                </button>
                                <button
                                    onClick={() => setSelected(null)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
