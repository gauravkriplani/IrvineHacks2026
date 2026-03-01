import { useState } from 'react';
import { exploreImages } from '../../data/mockData';
import { AOMInput, AOMAction } from '../../../../aom-wrappers';
import './ExplorePage.css';

const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const VideoIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>;

export default function ExplorePage() {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    const filtered = search
        ? exploreImages.filter(img => img.user.username.includes(search.toLowerCase()))
        : exploreImages;

    return (
        <div className="explore-page">
            {/* Search bar */}
            <div className="explore-search">
                <div className="explore-search__wrap">
                    <SearchIcon />
                    <AOMInput id="explore.search" description="Search explore page" inputType="search" group="explore">
                        <input
                            className="explore-search__input"
                            placeholder="Search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </AOMInput>
                </div>
            </div>

            {/* Category tabs */}
            <div className="explore-tabs">
                {['For You', 'Reels', 'Music', 'Travel', 'Food', 'Architecture', 'Art', 'Sports'].map(tab => (
                    <button key={tab} className="explore-tab">{tab}</button>
                ))}
            </div>

            {/* Masonry grid */}
            <div className="explore-grid">
                {filtered.map((item, i) => (
                    <AOMAction key={item.id} id={`explore.view_item.${item.id}`} description={`View explore item ${item.id}`} safety={1} group="explore">
                        <div
                            className={`explore-grid__item ${item.isLarge ? 'explore-grid__item--large' : ''}`}
                            onClick={() => setSelected(item)}
                        >
                            <img src={item.image} alt="" className="explore-grid__img" loading="lazy" />
                            <div className="explore-grid__overlay">
                                {item.isVideo && <span className="explore-grid__video-icon"><VideoIcon /></span>}
                                <span className="explore-grid__likes">❤ {item.likes.toLocaleString()}</span>
                            </div>
                        </div>
                    </AOMAction>
                ))}
            </div>

            {/* Quick preview modal */}
            {selected && (
                <div className="explore-modal" onClick={() => setSelected(null)}>
                    <div className="explore-modal__content" onClick={e => e.stopPropagation()}>
                        <img src={selected.image} alt="" className="explore-modal__img" />
                        <div className="explore-modal__info">
                            <p style={{ fontWeight: 600 }}>@{selected.user.username}</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>❤ {selected.likes.toLocaleString()} likes</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
