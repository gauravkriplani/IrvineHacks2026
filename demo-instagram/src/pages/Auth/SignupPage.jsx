import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { AOMInput, AOMAction, AOMLink } from '../../../../aom-wrappers';
import './AuthPages.css';

const steps = ['email', 'name', 'username', 'birthday'];

export default function SignupPage() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ email: '', name: '', username: '', birthday: '' });
    const navigate = useNavigate();

    const update = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    const handleNext = (e) => {
        e.preventDefault();
        if (step < steps.length - 1) setStep(s => s + 1);
        else { setTimeout(() => navigate('/'), 800); }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg" />
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-logo">
                        <h1 className="auth-logo-text">Instagram</h1>
                    </div>
                    <p className="auth-tagline">Sign up to see photos and videos from your friends.</p>

                    {/* Progress dots */}
                    <div className="auth-steps">
                        {steps.map((_, i) => (
                            <div key={i} className={`auth-step-dot ${i <= step ? 'auth-step-dot--active' : ''}`} />
                        ))}
                    </div>

                    <form className="auth-form" onSubmit={handleNext}>
                        {step === 0 && (
                            <AOMInput id="auth.signup.email" description="Mobile number or email" inputType="email" group="auth">
                                <Input placeholder="Mobile number or email" value={form.email} onChange={update('email')} fullWidth />
                            </AOMInput>
                        )}
                        {step === 1 && (
                            <AOMInput id="auth.signup.name" description="Full name" inputType="text" group="auth">
                                <Input placeholder="Full name" value={form.name} onChange={update('name')} fullWidth />
                            </AOMInput>
                        )}
                        {step === 2 && (
                            <AOMInput id="auth.signup.username" description="Username" inputType="text" group="auth">
                                <Input placeholder="Username" value={form.username} onChange={update('username')} fullWidth />
                            </AOMInput>
                        )}
                        {step === 3 && (
                            <>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>Add your birthday</p>
                                <AOMInput id="auth.signup.birthday" description="Birthday" inputType="text" group="auth">
                                    <Input type="date" value={form.birthday} onChange={update('birthday')} fullWidth />
                                </AOMInput>
                            </>
                        )}
                        <AOMAction id="auth.signup.submit" description="Proceed to next step or submit" safety={0.9} group="auth">
                            <Button type="submit" variant="primary" size="md" fullWidth>
                                {step < steps.length - 1 ? 'Next' : 'Sign up'}
                            </Button>
                        </AOMAction>
                    </form>

                    {step === 0 && (
                        <>
                            <div className="auth-divider">
                                <span className="auth-divider__line" /><span className="auth-divider__text">OR</span><span className="auth-divider__line" />
                            </div>
                            <AOMAction id="auth.signup.google" description="Log in with Google" safety={0.9} group="auth">
                                <button className="auth-google-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                    Log in with Google
                                </button>
                            </AOMAction>
                        </>
                    )}
                </div>

                <div className="auth-switch-card">
                    Have an account? <AOMLink id="auth.signup.login" description="Go to log in page" destination="Log in page" group="auth">
                        <Link to="/login" className="auth-switch-link">Log in</Link>
                    </AOMLink>
                </div>
            </div>
        </div>
    );
}
