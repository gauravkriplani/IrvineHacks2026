import { useState } from 'react';
import { AOMInput, AOMAction } from '../../../aom-wrappers';

export default function Home() {
    const [textVal, setTextVal] = useState('');
    const [checkVal, setCheckVal] = useState(false);
    const [radioVal, setRadioVal] = useState('user');
    const [submitCount, setSubmitCount] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitCount(c => c + 1);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Settings & Profile</h2>
                <p>Manage your account preferences and notification settings.</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="test-form">
                    {/* Text Input */}
                    <div className="form-group">
                        <label className="form-label">Display Name</label>
                        <AOMInput id="settings.display_name" description="Enter your display name" inputType="text">
                            <input
                                type="text"
                                value={textVal}
                                onChange={e => setTextVal(e.target.value)}
                                placeholder="e.g. Jane Doe"
                            />
                        </AOMInput>
                        <p className="val-display" style={{ marginTop: '8px' }}>Stored Database Value: {textVal}</p>
                    </div>

                    <div style={{ height: '2px', background: 'var(--border)', margin: '32px 0' }} />

                    {/* Radio Buttons */}
                    <div className="form-group">
                        <label className="form-label">Account Type</label>
                        <div className="radio-group">
                            <AOMInput id="settings.type_user" description="Set account to User" inputType="radio">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="account-type"
                                        value="user"
                                        checked={radioVal === 'user'}
                                        onChange={e => setRadioVal(e.target.value)}
                                    /> Standard User
                                </label>
                            </AOMInput>
                            <AOMInput id="settings.type_admin" description="Set account to Administrator" inputType="radio">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="account-type"
                                        value="admin"
                                        checked={radioVal === 'admin'}
                                        onChange={e => setRadioVal(e.target.value)}
                                    /> Administrator
                                </label>
                            </AOMInput>
                        </div>
                    </div>

                    <div style={{ height: '2px', background: 'var(--border)', margin: '32px 0' }} />

                    {/* Checkbox */}
                    <div className="form-group">
                        <label className="form-label">Email Preferences</label>
                        <AOMInput id="settings.email_opt_in" description="Toggle marketing emails" inputType="checkbox">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={checkVal}
                                    onChange={e => setCheckVal(e.target.checked)}
                                />
                                Receive weekly product updates and marketing emails
                            </label>
                        </AOMInput>
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                        {/* Action Button */}
                        <AOMAction id="settings.save_changes" description="Save profile settings" safety={0.8}>
                            <button type="submit" className="btn btn-primary">
                                Save Changes ({submitCount > 0 ? `${submitCount} saved` : 'Unsaved'})
                            </button>
                        </AOMAction>
                    </div>
                </form>
            </div>
        </div>
    );
}
