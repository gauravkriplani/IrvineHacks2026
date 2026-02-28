import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import MobileNav from './components/MobileNav/MobileNav';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import FeedPage from './pages/Feed/FeedPage';
import ExplorePage from './pages/Explore/ExplorePage';
import ReelsPage from './pages/Reels/ReelsPage';
import MessagesPage from './pages/Messages/MessagesPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import PostDetailPage from './pages/PostDetail/PostDetailPage';
import AgentDashboard from './components/AgentDashboard/AgentDashboard';
import './App.css';

const AuthLayout = ({ children }) => <div className="auth-layout">{children}</div>;

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="app-main">{children}</main>
    <MobileNav />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />

        {/* App routes */}
        <Route path="/" element={<AppLayout><FeedPage /></AppLayout>} />
        <Route path="/explore" element={<AppLayout><ExplorePage /></AppLayout>} />
        <Route path="/reels" element={<AppLayout><ReelsPage /></AppLayout>} />
        <Route path="/messages" element={<AppLayout><MessagesPage /></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><NotificationsPage /></AppLayout>} />
        <Route path="/profile/:user" element={<AppLayout><ProfilePage /></AppLayout>} />
        <Route path="/p/:id" element={<AppLayout><PostDetailPage /></AppLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AgentDashboard />
    </BrowserRouter>
  );
}
