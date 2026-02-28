import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '../../data/mockData';
import Avatar from '../../components/Avatar/Avatar';
import './NotificationsPage.css';

const groups = [
    { label: 'Today', ids: ['n1', 'n2', 'n3'] },
    { label: 'This week', ids: ['n4', 'n5', 'n6', 'n7'] },
];

const typeLabels = { like: '❤', comment: '💬', follow: '👤', mention: '@' };

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [followed, setFollowed] = useState({});
    const [read, setRead] = useState({});

    const handleNotifClick = (notif) => {
        setRead(r => ({ ...r, [notif.id]: true }));
        if (notif.type === 'follow' || notif.type === 'like' || notif.type === 'mention') {
            navigate(`/profile/${notif.user.username}`);
        } else if (notif.type === 'comment') {
            navigate('/');
        }
    };

    return (
        <div className="notifs-page">
            <h2 className="notifs-title">Notifications</h2>
            {groups.map(group => {
                const groupNotifs = group.ids.map(id => notifications.find(n => n.id === id)).filter(Boolean);
                return (
                    <div key={group.label} className="notifs-group">
                        <h3 className="notifs-group__label">{group.label}</h3>
                        {groupNotifs.map(notif => (
                            <div
                                key={notif.id}
                                className={`notif-item ${read[notif.id] ? '' : 'notif-item--unread'}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleNotifClick(notif)}
                            >
                                <div style={{ position: 'relative' }}>
                                    <Avatar src={notif.user.avatar} size={44} hasStory={false} />
                                    <span className="notif-type-badge">{typeLabels[notif.type]}</span>
                                </div>
                                <div className="notif-item__body">
                                    <span className="notif-item__username">{notif.user.username}</span>{' '}
                                    <span className="notif-item__content">{notif.content}</span>{' '}
                                    <span className="notif-item__time">{notif.time}</span>
                                </div>
                                {notif.type === 'follow' ? (
                                    <button
                                        className="notif-follow-btn"
                                        onClick={e => { e.stopPropagation(); setFollowed(f => ({ ...f, [notif.id]: !f[notif.id] })); }}
                                        style={{ opacity: followed[notif.id] ? 0.6 : 1 }}
                                    >
                                        {followed[notif.id] ? 'Following' : 'Follow back'}
                                    </button>
                                ) : notif.image ? (
                                    <img src={notif.image} alt="" className="notif-item__thumb" />
                                ) : null}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
