import { NavLink } from 'react-router-dom';
import { AOMLink } from '../../../../../../aom-wrappers';
import './MobileNav.css';

const HomeIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const SearchIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const ReelsIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2" /><line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /></svg>;
const HeartIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
const ProfileIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;

export default function MobileNav() {
    return (
        <nav className="mobile-nav">
            {[
                { id: 'mobile.home', to: '/', label: 'Home', Icon: HomeIcon },
                { id: 'mobile.explore', to: '/explore', label: 'Explore', Icon: SearchIcon },
                { id: 'mobile.reels', to: '/reels', label: 'Reels', Icon: ReelsIcon },
                { id: 'mobile.notifications', to: '/notifications', label: 'Notifications', Icon: HeartIcon },
                { id: 'mobile.profile', to: '/profile/you.dev', label: 'Profile', Icon: ProfileIcon },
            ].map(({ id, to, label, Icon }) => (
                <AOMLink key={to} id={`nav.${id}`} description={`Navigate to ${label} (Mobile)`} destination={label} group="nav">
                    <NavLink to={to} className={({ isActive }) => `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`} end={to === '/'}>
                        <Icon />
                    </NavLink>
                </AOMLink>
            ))}
        </nav>
    );
}
