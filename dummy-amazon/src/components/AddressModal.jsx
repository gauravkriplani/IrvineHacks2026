import { useState } from 'react';
import './AddressModal.css';

const DEFAULT = {
    fullName: 'John Doe',
    phone: '555-555-5555',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
};

export default function AddressModal({ currentAddress, onSave, onClose }) {
    const [addr, setAddr] = useState(currentAddress || DEFAULT);

    const handleSave = () => {
        if (!addr.fullName || !addr.address || !addr.city || !addr.zip) return;
        onSave(addr);
        onClose();
    };

    const field = (key, label, placeholder = '') => (
        <div className="addr-modal__field" key={key}>
            <label className="addr-modal__label">{label}</label>
            <input
                className="addr-modal__input"
                value={addr[key] || ''}
                placeholder={placeholder}
                onChange={e => setAddr(a => ({ ...a, [key]: e.target.value }))}
            />
        </div>
    );

    return (
        <div className="addr-modal-overlay" onClick={onClose}>
            <div className="addr-modal" onClick={e => e.stopPropagation()}>
                <div className="addr-modal__header">
                    <h2 className="addr-modal__title">Change delivery address</h2>
                    <button className="addr-modal__close" onClick={onClose}>✕</button>
                </div>
                <div className="addr-modal__body">
                    {field('fullName', 'Full name')}
                    {field('phone', 'Phone number', '(555) 555-5555')}
                    {field('address', 'Street address')}
                    <div className="addr-modal__row">
                        {field('city', 'City')}
                        {field('state', 'State', 'e.g. CA')}
                        {field('zip', 'ZIP code', 'e.g. 94105')}
                    </div>
                    {field('country', 'Country')}
                </div>
                <div className="addr-modal__footer">
                    <button className="addr-modal__cancel" onClick={onClose}>Cancel</button>
                    <button className="addr-modal__save" onClick={handleSave}>Use this address</button>
                </div>
            </div>
        </div>
    );
}
