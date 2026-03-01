import './Avatar.css';

export default function Avatar({ src, alt = '', size = 40, hasStory = false, seen = false, isOwn = false, onClick }) {
    return (
        <div
            className={`avatar-wrapper ${hasStory && !isOwn ? (seen ? 'avatar--story-seen' : 'avatar--story') : ''} ${isOwn ? 'avatar--own' : ''}`}
            style={{ '--sz': `${size}px` }}
            onClick={onClick}
        >
            <img
                className="avatar-img"
                src={src || `https://i.pravatar.cc/${size}`}
                alt={alt}
                style={{ width: size, height: size }}
            />
            {isOwn && (
                <span className="avatar-add-btn">+</span>
            )}
        </div>
    );
}
