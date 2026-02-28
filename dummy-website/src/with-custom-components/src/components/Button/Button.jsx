import './Button.css';

export default function Button({ children, variant = 'primary', size = 'md', fullWidth, onClick, disabled, type = 'button', className = '' }) {
    return (
        <button
            type={type}
            className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
