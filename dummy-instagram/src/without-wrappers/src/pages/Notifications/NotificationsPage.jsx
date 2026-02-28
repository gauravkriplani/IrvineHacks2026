import { notifications } from '../../data/mockData';
import Avatar from '../../components/Avatar/Avatar';
import './NotificationsPage.css';

const groups = [
    { label: 'Today', ids: ['n1', 'n2', 'n3'] },
    { label: 'This week', ids: ['n4', 'n5', 'n6', 'n7'] },
];

const typeLabels = { like: '❤', comment: '💬', follow: '👤', mention: '@' };

export default function NotificationsPage() {
    return (
        <div className="notifs-page">
            <h2 className="notifs-title">Notifications</h2>
            {groups.map(group => {
                const groupNotifs = group.ids.map(id => notifications.find(n => n.id === id)).filter(Boolean);
                return (
                    <div key={group.label} className="notifs-group">
                        <h3 className="notifs-group__label">{group.label}</h3>
                        {groupNotifs.map(notif => (
                            <div key={notif.id} className="notif-item">
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
                                    <button className="notif-follow-btn">Follow back</button>
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
