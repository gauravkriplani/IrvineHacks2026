import { useState } from 'react';
import StoryBar from '../../components/StoryBar/StoryBar';
import PostCard from '../../components/PostCard/PostCard';
import Avatar from '../../components/Avatar/Avatar';
import { posts as initialPosts, stories as initialStories, users, currentUser } from '../../data/mockData';
import './FeedPage.css';

export default function FeedPage() {
    const [posts, setPosts] = useState(initialPosts);
    const [stories, setStories] = useState(initialStories);
    const [activeStory, setActiveStory] = useState(null);
    const [activeUser, setActiveUser] = useState(currentUser);
    const [followed, setFollowed] = useState({});

    const handleLike = (id) => setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
    const handleSave = (id) => setPosts(ps => ps.map(p => p.id === id ? { ...p, saved: !p.saved } : p));

    const handleStoryClick = (story) => {
        if (story.isOwn) {
            // "Add story" — just mark as freshened
            return;
        }
        setActiveStory(story);
        setStories(ss => ss.map(s => s.id === story.id ? { ...s, seen: true } : s));
    };

    const closeStory = () => setActiveStory(null);

    const switchAccount = () => {
        const allUsers = [currentUser, ...users];
        const idx = allUsers.findIndex(u => u.id === activeUser.id);
        setActiveUser(allUsers[(idx + 1) % allUsers.length]);
    };

    const toggleFollow = (userId) => {
        setFollowed(f => ({ ...f, [userId]: !f[userId] }));
    };

    return (
        <div className="feed-page">
            {/* Story viewer modal */}
            {activeStory && (
                <div className="story-modal" onClick={closeStory}>
                    <div className="story-modal__content" onClick={e => e.stopPropagation()}>
                        <div className="story-modal__bar" />
                        <img src={activeStory.user.avatar} alt="" className="story-modal__avatar" />
                        <p className="story-modal__username">@{activeStory.user.username}</p>
                        <img
                            src={`https://picsum.photos/seed/${activeStory.id}/400/700`}
                            alt=""
                            className="story-modal__img"
                        />
                        <button className="story-modal__close" onClick={closeStory}>✕</button>
                    </div>
                </div>
            )}

            {/* Main feed */}
            <div className="feed-main">
                <StoryBar stories={stories} onStoryClick={handleStoryClick} />
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onLike={handleLike} onSave={handleSave} />
                ))}
            </div>

            {/* Right sidebar */}
            <aside className="feed-sidebar">
                {/* Current user */}
                <div className="feed-user-switch">
                    <Avatar src={activeUser.avatar} size={44} />
                    <div>
                        <p className="feed-user-switch__name">{activeUser.username}</p>
                        <p className="feed-user-switch__full">{activeUser.fullName}</p>
                    </div>
                    <button className="feed-user-switch__btn" onClick={switchAccount}>Switch</button>
                </div>

                {/* Suggested for you */}
                <div className="feed-suggested">
                    <div className="feed-suggested__header">
                        <span className="feed-suggested__title">Suggested for you</span>
                        <button className="feed-suggested__see-all">See All</button>
                    </div>
                    {users.slice(0, 5).map(user => (
                        <div key={user.id} className="feed-suggested-user">
                            <Avatar src={user.avatar} size={36} hasStory={true} seen={false} />
                            <div className="feed-suggested-user__info">
                                <p className="feed-suggested-user__name">{user.username}</p>
                                <p className="feed-suggested-user__sub">Suggested for you</p>
                            </div>
                            <button
                                className="feed-suggested-user__follow"
                                style={{ color: followed[user.id] ? 'var(--text-muted)' : '#0095f6', fontWeight: 600 }}
                                onClick={() => toggleFollow(user.id)}
                            >
                                {followed[user.id] ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer links */}
                <div className="feed-footer">
                    <p>About · Help · Press · API · Jobs · Privacy · Terms</p>
                    <p style={{ marginTop: 8 }}>© 2024 Instagram from Meta</p>
                </div>
            </aside>
        </div>
    );
}
