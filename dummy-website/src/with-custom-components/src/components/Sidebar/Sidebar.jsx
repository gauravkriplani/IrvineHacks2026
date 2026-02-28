import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Avatar from '../Avatar/Avatar';
import { currentUser } from '../../data/mockData';
import './Sidebar.css';

const HomeIcon = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const ExploreIcon = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>;
const ReelsIcon = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /></svg>;
const MessageIcon = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const HeartIcon = ({ active }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
const MenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;

const navItems = [
    { to: '/', label: 'Home', Icon: HomeIcon },
    { to: '/explore', label: 'Explore', Icon: ExploreIcon },
    { to: '/reels', label: 'Reels', Icon: ReelsIcon },
    { to: '/messages', label: 'Messages', Icon: MessageIcon },
    { to: '/notifications', label: 'Notifications', Icon: HeartIcon },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar__logo" onClick={() => navigate('/')}>
                {collapsed ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                ) : (
                    <span className="sidebar__logo-text">Instagram</span>
                )}
            </div>

            {/* Nav links */}
            <ul className="sidebar__nav">
                {navItems.map(({ to, label, Icon }) => (
                    <li key={to}>
                        <NavLink to={to} className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`} end={to === '/'}>
                            {({ isActive }) => (
                                <>
                                    <span className="sidebar__icon"><Icon active={isActive} /></span>
                                    {!collapsed && <span className="sidebar__label">{label}</span>}
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
                <li>
                    <NavLink to="/profile/you.dev" className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__icon">
                            <Avatar src={currentUser.avatar} size={26} />
                        </span>
                        {!collapsed && <span className="sidebar__label">Profile</span>}
                    </NavLink>
                </li>
            </ul>

            {/* Bottom */}
            <div className="sidebar__bottom">
                <button className="sidebar__link" onClick={() => setCollapsed(c => !c)}>
                    <span className="sidebar__icon"><MenuIcon /></span>
                    {!collapsed && <span className="sidebar__label">More</span>}
                </button>
            </div>
        </nav>
    );
}
