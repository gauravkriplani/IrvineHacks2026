import { useState } from 'react';
import StoryBar from '../../components/StoryBar/StoryBar';
import PostCard from '../../components/PostCard/PostCard';
import Avatar from '../../components/Avatar/Avatar';
import { AOMAction } from '../../../../aom-wrappers';
import { posts as initialPosts, stories, users, currentUser } from '../../data/mockData';
import './FeedPage.css';

export default function FeedPage() {
    const [posts, setPosts] = useState(initialPosts);

    const handleLike = (id) => {
        setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
    };
    const handleSave = (id) => {
        setPosts(ps => ps.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
    };

    return (
        <div className="feed-page">
            {/* Main feed */}
            <div className="feed-main">
                <StoryBar stories={stories} onStoryClick={() => { }} />
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onLike={handleLike} onSave={handleSave} />
                ))}
            </div>

            {/* Right sidebar */}
            <aside className="feed-sidebar">
                {/* Current user */}
                <div className="feed-user-switch">
                    <Avatar src={currentUser.avatar} size={44} />
                    <div>
                        <p className="feed-user-switch__name">{currentUser.username}</p>
                        <p className="feed-user-switch__full">{currentUser.fullName}</p>
                    </div>
                    <AOMAction id="feed.switch_user" description="Switch current user account" safety={0.9} group="feed">
                        <button className="feed-user-switch__btn">Switch</button>
                    </AOMAction>
                </div>

                {/* Suggested for you */}
                <div className="feed-suggested">
                    <div className="feed-suggested__header">
                        <span className="feed-suggested__title">Suggested for you</span>
                        <AOMAction id="feed.see_all_suggestions" description="See all suggested users" safety={0.9} group="feed">
                            <button className="feed-suggested__see-all">See All</button>
                        </AOMAction>
                    </div>
                    {users.slice(0, 5).map(user => (
                        <div key={user.id} className="feed-suggested-user">
                            <Avatar src={user.avatar} size={36} hasStory={true} seen={false} />
                            <div className="feed-suggested-user__info">
                                <p className="feed-suggested-user__name">{user.username}</p>
                                <p className="feed-suggested-user__sub">Followed by {users[(parseInt(user.id[1]) + 1) % users.length].username}</p>
                            </div>
                            <AOMAction id={`feed.follow_suggested.${user.username}`} description={`Follow suggested user ${user.username}`} safety={0.9} group="feed">
                                <button className="feed-suggested-user__follow">Follow</button>
                            </AOMAction>
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
