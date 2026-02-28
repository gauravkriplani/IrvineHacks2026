import { useCart } from '../context/CartContext';
import './CartPage.css';

const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>;

export default function CartPage({ onViewChange, onCheckout }) {
    const { cart, cartTotal, cartCount, removeFromCart, setQty } = useCart();
    const tax = cartTotal * 0.0875;
    const shipping = cartTotal >= 25 ? 0 : 5.99;
    const total = cartTotal + tax + shipping;

    return (
        <div className="cart-page">
            <div className="cart-page__header">
                <h1 className="cart-page__title">Shopping Cart</h1>
            </div>

            <div className="cart-page__body">
                {/* Item list */}
                <div className="cart-page__items">
                    {cart.length === 0 ? (
                        <div className="cart-page__empty">
                            <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
                            <h2>Your Amazon Cart is empty.</h2>
                            <p style={{ color: '#555', marginTop: 8 }}>Your shopping cart is waiting. Give it purpose – fill it with groceries, clothing, household supplies, electronics, and more.</p>
                            <button className="cart-page__continue-btn" onClick={() => onViewChange('home')}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-page__items-header">
                                <span style={{ color: '#555', fontSize: 13 }}>Price</span>
                            </div>
                            {cart.map(item => (
                                <div key={item.id} className="cart-page__item">
                                    <input type="checkbox" defaultChecked className="cart-page__item-check" />
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="cart-page__item-img"
                                        onClick={() => onViewChange('detail', item)}
                                        style={{ cursor: 'pointer' }}
                                        title="View product"
                                    />
                                    <div className="cart-page__item-info">
                                        <p
                                            className="cart-page__item-name"
                                            onClick={() => onViewChange('detail', item)}
                                            style={{ cursor: 'pointer', color: '#0066c0' }}
                                        >
                                            {item.name}
                                        </p>
                                        <p className="cart-page__item-stock">In Stock</p>
                                        {item.prime && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' }}>
                                                <span className="prime-badge">prime</span>
                                                <span style={{ fontSize: 12, color: '#555' }}>FREE Delivery</span>
                                            </div>
                                        )}
                                        <div className="cart-page__item-controls">
                                            <div className="cart-qty">
                                                <button className="cart-qty__btn" onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                                                <span className="cart-qty__num">{item.qty}</span>
                                                <button className="cart-qty__btn" onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                                            </div>
                                            <span className="cart-page__divider">|</span>
                                            <button className="cart-page__action-link" onClick={() => removeFromCart(item.id)}>
                                                <TrashIcon /> Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-page__item-price">
                                        ${(item.price * item.qty).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            <div className="cart-page__subtotal-bottom">
                                Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):
                                <span className="cart-page__subtotal-amount">${cartTotal.toFixed(2)}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Summary sidebar */}
                {cart.length > 0 && (
                    <div className="cart-page__summary">
                        <div className="cart-page__summary-card">
                            {cartTotal >= 25 && (
                                <div className="cart-page__free-shipping">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#007600"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                                    Your order qualifies for FREE Shipping.
                                </div>
                            )}
                            <p className="cart-page__summary-sub">
                                Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):
                                <span className="cart-page__summary-price">${cartTotal.toFixed(2)}</span>
                            </p>
                            <div className="cart-page__summary-rows">
                                <div className="cart-page__summary-row">
                                    <span>Shipping:</span>
                                    <span style={{ color: shipping === 0 ? '#007600' : '#111' }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="cart-page__summary-row">
                                    <span>Tax (8.75%):</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="cart-page__summary-divider" />
                                <div className="cart-page__summary-row cart-page__summary-row--total">
                                    <span>Order total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button className="cart-page__checkout-btn" onClick={() => onCheckout()}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
