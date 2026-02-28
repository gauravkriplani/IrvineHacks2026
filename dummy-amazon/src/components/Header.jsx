import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Header.css';

const CartIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7.5 17H19v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H15.5c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
);

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
);

const LocationIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Grocery'];

export default function Header({ searchQuery, onSearchChange, onCategoryFilter, onViewChange, deliveryAddress, onAddressClick }) {
    const { cartCount } = useCart();
    const [searchCat, setSearchCat] = useState('All');
    const [query, setQuery] = useState(searchQuery || '');
    const [showCatDropdown, setShowCatDropdown] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        function handler(e) { if (dropRef.current && !dropRef.current.contains(e.target)) setShowCatDropdown(false); }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        onSearchChange(query);
        if (searchCat !== 'All') onCategoryFilter(searchCat);
    };

    return (
        <header className="amz-header">
            <div className="amz-header__top">
                {/* Logo */}
                <div className="amz-logo" onClick={() => { onViewChange('home'); onSearchChange(''); }}>
                    <span className="amz-logo__text">amazon</span>
                    <span className="amz-logo__tld">.com</span>
                </div>

                {/* Deliver to — click to change address */}
                <div className="amz-deliver" onClick={onAddressClick} title="Change delivery address">
                    <LocationIcon />
                    <div>
                        <div className="amz-deliver__label">Deliver to</div>
                        <div className="amz-deliver__loc">{deliveryAddress?.city || 'San Francisco'} {deliveryAddress?.zip || '94105'}</div>
                    </div>
                </div>

                {/* Search bar */}
                <form className="amz-search" onSubmit={handleSearch}>
                    <div className="amz-search__cat" ref={dropRef}>
                        <button type="button" className="amz-search__cat-btn" onClick={() => setShowCatDropdown(v => !v)}>
                            {searchCat} <span style={{ fontSize: 10 }}>▾</span>
                        </button>
                        {showCatDropdown && (
                            <ul className="amz-search__cat-dropdown">
                                {CATEGORIES.map(c => (
                                    <li key={c} onClick={() => { setSearchCat(c); setShowCatDropdown(false); }}>
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <input
                        className="amz-search__input"
                        placeholder="Search Amazon"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button type="submit" className="amz-search__btn">
                        <SearchIcon />
                    </button>
                </form>

                {/* Right side */}
                <div className="amz-header__right">
                    <div className="amz-header__returns" onClick={() => onViewChange('orders')} title="View your orders">
                        <div className="amz-header__account-label">Orders</div>
                        <div className="amz-header__account-main">& History</div>
                    </div>
                    <button className="amz-cart-btn" onClick={() => onViewChange('cart')}>
                        <div className="amz-cart-btn__icon">
                            <CartIcon />
                            {cartCount > 0 && <span className="amz-cart-btn__count">{cartCount}</span>}
                        </div>
                        <span className="amz-cart-btn__label">Cart</span>
                    </button>
                </div>

            </div>
        </header>
    );
}
