import './Input.css';

export default function Input({
    type = 'text', placeholder, value, onChange, label, error, fullWidth, icon, className = '',
}) {
    return (
        <div className={`input-wrap ${fullWidth ? 'input-wrap--full' : ''} ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-field-wrap">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    type={type}
                    className={`input-field ${icon ? 'input-field--icon' : ''} ${error ? 'input-field--error' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
            {error && <span className="input-error">{error}</span>}
        </div>
    );
}
