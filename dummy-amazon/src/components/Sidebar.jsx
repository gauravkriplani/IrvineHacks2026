import { useState } from 'react';
import { AOMAction, AOMInput } from '../../../aom-wrappers';
import './Sidebar.css';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Grocery'];

export default function Sidebar({ filters, onFilterChange }) {
    const [priceInputs, setPriceInputs] = useState({ min: filters.priceMin || '', max: filters.priceMax || '' });

    const applyPrice = () => {
        onFilterChange({ priceMin: priceInputs.min ? Number(priceInputs.min) : 0, priceMax: priceInputs.max ? Number(priceInputs.max) : Infinity });
    };

    const clearAll = () => {
        setPriceInputs({ min: '', max: '' });
        onFilterChange({ category: 'All', brand: '', priceMin: 0, priceMax: Infinity, minRating: 0, prime: false });
    };

    const hasFilters = filters.category !== 'All' || filters.brand || filters.priceMin > 0 || filters.priceMax < Infinity || filters.minRating > 0 || filters.prime;

    return (
        <aside className="amz-sidebar">
            <div className="amz-sidebar__header">
                <h3>Refine Results</h3>
                {hasFilters && (
                    <AOMAction id="filter.clear_all" description="Clear all active filters">
                        <button className="amz-clear-btn" onClick={clearAll}>Clear all</button>
                    </AOMAction>
                )}
            </div>

            {/* Department */}
            <div className="amz-sidebar__section">
                <h4 className="amz-sidebar__title">Department</h4>
                <ul className="amz-sidebar__list">
                    {CATEGORIES.map(cat => (
                        <li
                            key={cat}
                            className={`amz-sidebar__item ${filters.category === cat ? 'amz-sidebar__item--active' : ''}`}
                        >
                            <AOMAction
                                id={`filter.category.${cat.replace(/[^a-zA-Z]/g, '').toLowerCase()}`}
                                description={`Filter by category: ${cat}`}
                            >
                                <span onClick={() => onFilterChange({ category: cat })} style={{ display: 'block', width: '100%' }}>
                                    {cat}
                                </span>
                            </AOMAction>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Prime */}
            <div className="amz-sidebar__section">
                <h4 className="amz-sidebar__title">Prime Eligible</h4>
                <AOMInput id="filter.prime_eligible" description="Filter for Prime eligible items only" inputType="checkbox">
                    <label className="amz-sidebar__check">
                        <input
                            type="checkbox"
                            checked={filters.prime}
                            onChange={e => onFilterChange({ prime: e.target.checked })}
                        />
                        <span className="prime-badge">prime</span>
                        <span style={{ fontSize: 12, color: '#555', marginLeft: 4 }}>Eligible</span>
                    </label>
                </AOMInput>
            </div>

            {/* Customer Reviews */}
            <div className="amz-sidebar__section">
                <h4 className="amz-sidebar__title">Avg. Customer Review</h4>
                {[4, 3, 2, 1].map(n => (
                    <AOMAction
                        key={n}
                        id={`filter.min_rating.${n}`}
                        description={`Filter by minimum rating: ${n} stars and up`}
                    >
                        <div
                            className={`amz-rating-row ${filters.minRating === n ? 'amz-rating-row--active' : ''}`}
                            onClick={() => onFilterChange({ minRating: filters.minRating === n ? 0 : n })}
                        >
                            {[1, 2, 3, 4, 5].map(i => (
                                <span key={i} style={{ color: i <= n ? '#FFA41C' : '#ccc', fontSize: 15 }}>★</span>
                            ))}
                            <span style={{ fontSize: 13, marginLeft: 4 }}>&amp; Up</span>
                        </div>
                    </AOMAction>
                ))}
            </div>

            {/* Price */}
            <div className="amz-sidebar__section">
                <h4 className="amz-sidebar__title">Price</h4>
                <div className="amz-price-ranges">
                    {[
                        { label: 'Under $25', min: 0, max: 25 },
                        { label: '$25 to $50', min: 25, max: 50 },
                        { label: '$50 to $100', min: 50, max: 100 },
                        { label: '$100 to $200', min: 100, max: 200 },
                        { label: '$200 & Above', min: 200, max: Infinity },
                    ].map(r => (
                        <AOMAction
                            key={r.label}
                            id={`filter.price_range.${r.min}_${r.max === Infinity ? 'up' : r.max}`}
                            description={`Filter by price range: ${r.label}`}
                        >
                            <div
                                className={`amz-sidebar__item ${filters.priceMin === r.min && filters.priceMax === r.max ? 'amz-sidebar__item--active' : ''}`}
                                onClick={() => onFilterChange({ priceMin: r.min, priceMax: r.max })}
                            >
                                {r.label}
                            </div>
                        </AOMAction>
                    ))}
                </div>
                <div className="amz-price-custom">
                    <span style={{ fontSize: 12 }}>$</span>
                    <AOMInput id="filter.custom_price_min" description="Custom min price" inputType="number">
                        <input className="amz-price-input" placeholder="Min" value={priceInputs.min} onChange={e => setPriceInputs(p => ({ ...p, min: e.target.value }))} />
                    </AOMInput>
                    <span style={{ fontSize: 12 }}>to $</span>
                    <AOMInput id="filter.custom_price_max" description="Custom max price" inputType="number">
                        <input className="amz-price-input" placeholder="Max" value={priceInputs.max} onChange={e => setPriceInputs(p => ({ ...p, max: e.target.value }))} />
                    </AOMInput>
                    <AOMAction id="filter.custom_price_submit" description="Apply custom price range">
                        <button className="amz-price-go" onClick={applyPrice}>Go</button>
                    </AOMAction>
                </div>
            </div>
        </aside>
    );
}
