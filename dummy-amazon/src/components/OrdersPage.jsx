import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './OrdersPage.css';

const SAMPLE_ORDERS = [
    {
        id: 'AMZ-7483920',
        date: 'February 25, 2026',
        status: 'Delivered',
        deliveredDate: 'February 27, 2026',
        total: 279.97,
        items: [
            { name: 'Sony WH-1000XM5 Headphones', price: 279.99, qty: 1, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&q=80' },
        ],
        address: '123 Main St, San Francisco, CA 94105',
    },
    {
        id: 'AMZ-5921834',
        date: 'February 18, 2026',
        status: 'Delivered',
        deliveredDate: 'February 20, 2026',
        total: 93.96,
        items: [
            { name: 'Anker 65W USB-C Charger', price: 25.99, qty: 2, image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&q=80' },
            { name: 'Atomic Habits by James Clear', price: 13.99, qty: 1, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&q=80' },
            { name: 'CeraVe Moisturizing Cream', price: 16.08, qty: 1, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80' },
        ],
        address: '456 Market St, San Francisco, CA 94102',
    },
    {
        id: 'AMZ-3410298',
        date: 'January 30, 2026',
        status: 'Delivered',
        deliveredDate: 'February 1, 2026',
        total: 349.99,
        items: [
            { name: 'KitchenAid 5-Qt Stand Mixer', price: 349.99, qty: 1, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80' },
        ],
        address: '123 Main St, San Francisco, CA 94105',
    },
];

function OrderCard({ order, onBuyAgain, onViewItem }) {
    const [expanded, setExpanded] = useState(false);
    const [showTracking, setShowTracking] = useState(false);

    const trackingSteps = [
        { label: 'Order placed', date: order.date, done: true },
        { label: 'Preparing to ship', date: order.date, done: true },
        { label: 'Shipped', date: order.date, done: true },
        { label: 'Out for delivery', date: order.deliveredDate, done: true },
        { label: 'Delivered', date: order.deliveredDate, done: order.status === 'Delivered' },
    ];

    return (
        <div className="order-card">
            <div className="order-card__header">
                <div className="order-card__meta">
                    <div>
                        <p className="order-card__meta-label">ORDER PLACED</p>
                        <p className="order-card__meta-val">{order.date}</p>
                    </div>
                    <div>
                        <p className="order-card__meta-label">TOTAL</p>
                        <p className="order-card__meta-val">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="order-card__meta-wide">
                        <p className="order-card__meta-label">SHIP TO</p>
                        <p className="order-card__meta-val order-card__meta-addr">{order.address}</p>
                    </div>
                </div>
                <div className="order-card__id-block">
                    <p className="order-card__meta-label">ORDER # {order.id}</p>
                    <div className="order-card__links">
                        <button className="order-link" onClick={() => setExpanded(v => !v)}>
                            {expanded ? 'Hide details' : 'View order details'}
                        </button>
                        <span> | </span>
                        <button className="order-link" onClick={() => setShowTracking(v => !v)}>Track package</button>
                    </div>
                </div>
            </div>

            <div className="order-card__status-row">
                <span className={`order-card__status-badge order-card__status-badge--${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status === 'Delivered' ? '✓ ' : '⟳ '}{order.status}
                </span>
                {order.deliveredDate && <span className="order-card__delivered-date">Delivered {order.deliveredDate}</span>}
            </div>

            {showTracking && (
                <div className="order-tracking">
                    {trackingSteps.map((step, i) => (
                        <div key={i} className={`tracking-step ${step.done ? 'tracking-step--done' : ''}`}>
                            <div className="tracking-step__dot" />
                            {i < trackingSteps.length - 1 && <div className="tracking-step__line" />}
                            <div className="tracking-step__info">
                                <p className="tracking-step__label">{step.label}</p>
                                <p className="tracking-step__date">{step.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="order-card__items">
                {order.items.map((item, i) => {
                    const handleViewItem = () => {
                        const product = {
                            id: `order-item-${order.id}-${i}`,
                            name: item.name,
                            price: item.price,
                            originalPrice: item.price,
                            image: item.image,
                            category: 'Electronics',
                            brand: '',
                            rating: 4.5,
                            reviewCount: 0,
                            prime: true,
                            badge: null,
                            description: item.name
                        };
                        onViewItem?.(product);
                    };
                    return (
                        <div key={i} className="order-card__item">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="order-card__item-img"
                                onClick={handleViewItem}
                                style={{ cursor: 'pointer' }}
                                title="View product"
                            />
                            <div className="order-card__item-info">
                                <p
                                    className="order-card__item-name"
                                    onClick={handleViewItem}
                                    style={{ cursor: 'pointer', color: '#0066c0' }}
                                >
                                    {item.name}
                                </p>
                                <p className="order-card__item-qty">Qty: {item.qty}</p>
                                <div className="order-card__item-actions">
                                    <button className="order-btn order-btn--primary" onClick={() => onBuyAgain(item)}>Buy it again</button>
                                </div>
                            </div>
                            <div className="order-card__item-price">${(item.price * item.qty).toFixed(2)}</div>
                        </div>
                    );
                })}
            </div>

            {expanded && (
                <div className="order-card__details">
                    <div className="order-card__details-row">
                        <div>
                            <h4>Shipping address</h4>
                            <p>{order.address}</p>
                        </div>
                        <div>
                            <h4>Payment method</h4>
                            <p>Visa ending in 1111</p>
                        </div>
                        <div>
                            <h4>Order summary</h4>
                            <p>Items: ${order.total.toFixed(2)}</p>
                            <p>Shipping &amp; handling: FREE</p>
                            <p>Tax: ${(order.total * 0.0875).toFixed(2)}</p>
                            <p><strong>Order total: ${(order.total * 1.0875).toFixed(2)}</strong></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function OrdersPage({ onViewChange, recentOrders = [] }) {
    const { addToCart } = useCart();
    const [filter, setFilter] = useState('last30');
    const allOrders = [...recentOrders, ...SAMPLE_ORDERS];

    const handleBuyAgain = (item) => {
        addToCart({ id: `order-${Date.now()}`, name: item.name, price: item.price, image: item.image, brand: '', category: '', rating: 5, reviewCount: 0, prime: true });
        onViewChange('cart');
    };

    return (
        <div className="orders-page">
            <div className="orders-page__top">
                <div>
                    <h1 className="orders-page__title">Your Orders</h1>
                    <p className="orders-page__count">{allOrders.length} orders placed</p>
                </div>
                <div className="orders-filter">
                    <label>Filter by: </label>
                    <select className="orders-filter__select" value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="last30">Last 30 days</option>
                        <option value="last3months">Last 3 months</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                </div>
            </div>

            <div className="orders-list">
                {allOrders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onBuyAgain={handleBuyAgain}
                        onViewItem={(product) => onViewChange('detail', product)}
                    />
                ))}
            </div>
        </div>
    );
}
