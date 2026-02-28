import Avatar from '../Avatar/Avatar';
import './StoryBar.css';

export default function StoryBar({ stories, onStoryClick }) {
    return (
        <div className="story-bar">
            {stories.map((story) => (
                <button key={story.id} className="story-item" onClick={() => onStoryClick(story)}>
                    <Avatar
                        src={story.user.avatar}
                        size={56}
                        hasStory={!story.isOwn}
                        seen={story.seen}
                        isOwn={story.isOwn}
                    />
                    <span className="story-item__name truncate">
                        {story.isOwn ? 'Your story' : story.user.username}
                    </span>
                </button>
            ))}
        </div>
    );
}
