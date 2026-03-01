import { useCart } from '../context/CartContext';
import './Cart.css';

const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>;

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
    const { cart, cartTotal, cartCount, removeFromCart, setQty } = useCart();

    if (!isOpen) return null;

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-drawer" onClick={e => e.stopPropagation()}>
                <div className="cart-drawer__header">
                    <h2 className="cart-drawer__title">Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h2>
                    <button className="cart-drawer__close" onClick={onClose}><CloseIcon /></button>
                </div>

                <div className="cart-drawer__body">
                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty__icon">🛒</div>
                            <p>Your Amazon Cart is empty.</p>
                            <p style={{ fontSize: 13, color: '#555' }}>Your shopping cart is waiting. Give it purpose – fill it with groceries, clothing, household supplies, electronics, and more.</p>
                        </div>
                    ) : (
                        <>
                            {cart.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-item__img" />
                                    <div className="cart-item__info">
                                        <p className="cart-item__name">{item.name}</p>
                                        {item.prime && <span className="prime-badge" style={{ fontSize: 10 }}>prime</span>}
                                        <p className="cart-item__price">${(item.price * item.qty).toFixed(2)}</p>
                                        <p className="cart-item__unit-price">${item.price.toFixed(2)} each</p>
                                        <div className="cart-item__controls">
                                            <div className="cart-qty">
                                                <button className="cart-qty__btn" onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                                                <span className="cart-qty__num">{item.qty}</span>
                                                <button className="cart-qty__btn" onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                                            </div>
                                            <button className="cart-item__delete" onClick={() => removeFromCart(item.id)}>
                                                <TrashIcon /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-drawer__footer">
                        <div className="cart-subtotal">
                            <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):</span>
                            <span className="cart-subtotal__amount">${cartTotal.toFixed(2)}</span>
                        </div>
                        <label className="cart-gift-check">
                            <input type="checkbox" /> This order contains a gift
                        </label>
                        <button className="cart-checkout-btn" onClick={() => { onClose(); onCheckout(); }}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
