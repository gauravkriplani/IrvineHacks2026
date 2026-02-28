import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './AuthPages.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); navigate('/'); }, 1200);
    };

    return (
        <div className="auth-page">
            <div className="auth-bg" />
            <div className="auth-container">
                {/* Card */}
                <div className="auth-card">
                    <div className="auth-logo">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.5">
                            <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f09433" />
                                    <stop offset="50%" stopColor="#dc2743" />
                                    <stop offset="100%" stopColor="#bc1888" />
                                </linearGradient>
                            </defs>
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                        <h1 className="auth-logo-text">Instagram</h1>
                    </div>

                    <form className="auth-form" onSubmit={handleLogin}>
                        <Input
                            type="email"
                            placeholder="Phone number, username, or email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            fullWidth
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                        />
                        <Button type="submit" variant="primary" size="md" fullWidth disabled={loading || !email || !password}>
                            {loading ? 'Logging in…' : 'Log in'}
                        </Button>
                    </form>

                    <div className="auth-divider">
                        <span className="auth-divider__line" />
                        <span className="auth-divider__text">OR</span>
                        <span className="auth-divider__line" />
                    </div>

                    <button className="auth-google-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Continue with Google
                    </button>

                    <Link to="/forgot" className="auth-forgot">Forgot password?</Link>
                </div>

                {/* Switch card */}
                <div className="auth-switch-card">
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-switch-link">Sign up</Link>
                </div>

                {/* App download */}
                <p className="auth-app-text">Get the app.</p>
                <div className="auth-app-badges">
                    <div className="auth-badge">App Store</div>
                    <div className="auth-badge">Google Play</div>
                </div>
            </div>
        </div>
    );
}
