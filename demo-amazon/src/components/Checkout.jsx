import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { AOMLink, AOMAction, AOMInput } from '../../../aom-wrappers';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Review', 'Confirmation'];

const DEFAULT_PAY = { cardNum: '', expiry: '', cvv: '', nameOnCard: '' };

export default function Checkout({ onBack, deliveryAddress, onAddressChange, onOrderPlaced }) {
    const { cart, cartTotal, cartCount, clearCart } = useCart();
    const [step, setStep] = useState(0);
    const [pay, setPay] = useState(DEFAULT_PAY);
    const [orderNum] = useState(() => `#AMZ-${Math.floor(Math.random() * 9000000 + 1000000)}`);

    const addr = deliveryAddress || { fullName: 'John Doe', address: '123 Main St', city: 'San Francisco', state: 'CA', zip: '94105', phone: '555-555-5555' };

    const tax = cartTotal * 0.0875;
    const shipping = cartTotal >= 25 ? 0 : 5.99;
    const total = cartTotal + tax + shipping;

    const handlePlaceOrder = () => {
        const order = { id: orderNum.replace('#', ''), date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), status: 'Delivered', deliveredDate: 'Tomorrow', total, items: cart.map(i => ({ ...i, image: i.image || '' })), address: `${addr.address}, ${addr.city}, ${addr.state} ${addr.zip}` };
        onOrderPlaced?.(order);
        setStep(3);
        clearCart();
    };

    if (step === 3) {
        return (
            <div className="checkout-confirm">
                <div className="checkout-confirm__card">
                    <div className="checkout-confirm__check">✓</div>
                    <h1 className="checkout-confirm__title">Order Placed!</h1>
                    <p className="checkout-confirm__order">Order {orderNum}</p>
                    <p className="checkout-confirm__sub">Thank you for your order! An email confirmation has been sent to your account.</p>
                    <div className="checkout-confirm__details">
                        <div className="checkout-confirm__row">
                            <span>Estimated Delivery:</span>
                            <strong>Tomorrow by 8 PM</strong>
                        </div>
                        <div className="checkout-confirm__row">
                            <span>Total charged:</span>
                            <strong>${total.toFixed(2)}</strong>
                        </div>
                        <div className="checkout-confirm__row">
                            <span>Shipping to:</span>
                            <strong>{addr.fullName}, {addr.city}, {addr.state}</strong>
                        </div>
                    </div>
                    <AOMLink id="checkout.continue_shopping" description="Return to Home after placing order" destination="Home">
                        <button className="checkout-confirm__home" onClick={onBack}>Continue Shopping</button>
                    </AOMLink>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout">
            {/* Progress */}
            <div className="checkout-progress">
                {STEPS.slice(0, 3).map((s, i) => (
                    <div key={s} className={`checkout-step ${i <= step ? 'checkout-step--active' : ''} ${i < step ? 'checkout-step--done' : ''}`} onClick={() => i < step && setStep(i)}>
                        <div className="checkout-step__num">{i < step ? '✓' : i + 1}</div>
                        <span className="checkout-step__label">{s}</span>
                        {i < STEPS.length - 2 && <div className="checkout-step__line" />}
                    </div>
                ))}
            </div>

            <div className="checkout-body">
                <div className="checkout-main">
                    {/* Step 0: Shipping */}
                    {step === 0 && (
                        <div className="checkout-section">
                            <h2 className="checkout-section__title">Shipping Address</h2>
                            <div className="checkout-form">
                                <div className="checkout-addr-card">
                                    <div className="checkout-addr-card__info">
                                        <p style={{ fontWeight: 700 }}>{addr.fullName}</p>
                                        <p>{addr.address}</p>
                                        <p>{addr.city}, {addr.state} {addr.zip}</p>
                                        <p style={{ color: '#555', fontSize: 13 }}>{addr.phone}</p>
                                    </div>
                                    <AOMAction id="checkout.shipping.change_address" description="Change shipping address">
                                        <button className="checkout-edit-link" onClick={onAddressChange}>
                                            Change address
                                        </button>
                                    </AOMAction>
                                </div>
                                <div className="checkout-field checkout-field--full">
                                    <h3 style={{ fontSize: 15, marginBottom: 8 }}>Delivery Options</h3>
                                    {[
                                        { label: 'FREE Delivery tomorrow', badge: 'prime', selected: true },
                                        { label: 'Standard Delivery (3-5 days)', badge: 'FREE', selected: false },
                                        { label: 'Expedited Delivery (2 days) - $7.99', badge: null, selected: false },
                                    ].map(opt => (
                                        <AOMInput key={opt.label} id={`checkout.shipping.delivery_speed.${opt.label.replace(/[^a-zA-Z]/g, '').toLowerCase()}`} description={`Select delivery option: ${opt.label}`} inputType="radio">
                                            <label className="checkout-delivery-opt">
                                                <input type="radio" name="delivery" defaultChecked={opt.selected} />
                                                <span>{opt.label}</span>
                                                {opt.badge && <span className={opt.badge === 'prime' ? 'prime-badge' : 'checkout-free-badge'}>{opt.badge}</span>}
                                            </label>
                                        </AOMInput>
                                    ))}
                                </div>
                                <AOMAction id="checkout.shipping.continue_to_payment" description="Proceed to payment step">
                                    <button className="checkout-next-btn" onClick={() => setStep(1)}>Continue to Payment</button>
                                </AOMAction>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Payment */}
                    {step === 1 && (
                        <div className="checkout-section">
                            <h2 className="checkout-section__title">Payment Method</h2>
                            <div className="checkout-form">
                                <div className="checkout-pay-methods">
                                    {[
                                        { id: 'card', label: '💳 Credit/Debit Card', selected: true },
                                        { id: 'amazon', label: 'Amazon Pay', selected: false },
                                        { id: 'gift', label: '🎁 Gift Card', selected: false },
                                    ].map(m => (
                                        <AOMInput key={m.id} id={`checkout.payment.method.${m.id}`} description={`Select payment method: ${m.label}`} inputType="radio">
                                            <label className={`checkout-pay-method ${m.selected ? 'checkout-pay-method--selected' : ''}`}>
                                                <input type="radio" name="payMethod" defaultChecked={m.selected} />
                                                {m.label}
                                            </label>
                                        </AOMInput>
                                    ))}
                                </div>
                                {[
                                    ['cardNum', 'Card Number'],
                                    ['nameOnCard', 'Name on Card'],
                                    ['expiry', 'Expiration Date (MM/YY)'],
                                    ['cvv', 'CVV'],
                                ].map(([key, label]) => (
                                    <div key={key} className="checkout-field">
                                        <label className="checkout-label">{label}</label>
                                        <AOMInput id={`checkout.payment.${key}`} description={`Payment logic: ${label}`} inputType={key === 'cvv' ? 'password' : 'text'}>
                                            <input
                                                className="checkout-input"
                                                value={pay[key]}
                                                onChange={e => setPay(p => ({ ...p, [key]: e.target.value }))}
                                                type={key === 'cvv' ? 'password' : 'text'}
                                            />
                                        </AOMInput>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <AOMAction id="checkout.payment.back_to_shipping" description="Go back to shipping step">
                                        <button className="checkout-back-btn" onClick={() => setStep(0)}>Back</button>
                                    </AOMAction>
                                    <AOMAction id="checkout.payment.review_order" description="Proceed to review order step">
                                        <button className="checkout-next-btn" onClick={() => setStep(2)}>Review Order</button>
                                    </AOMAction>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Review */}
                    {step === 2 && (
                        <div className="checkout-section">
                            <h2 className="checkout-section__title">Review Your Order</h2>
                            <div className="checkout-review-addr">
                                <h4>Shipping to:</h4>
                                <p>{addr.fullName}</p>
                                <p>{addr.address}</p>
                                <p>{addr.city}, {addr.state} {addr.zip}</p>
                                <AOMAction id="checkout.review.edit_shipping" description="Edit shipping address from review step">
                                    <button className="checkout-edit-link" onClick={() => setStep(0)}>Edit</button>
                                </AOMAction>
                            </div>
                            <div className="checkout-review-items">
                                {cart.map(item => (
                                    <div key={item.id} className="checkout-review-item">
                                        <img src={item.image} alt={item.name} className="checkout-review-item__img" />
                                        <div className="checkout-review-item__info">
                                            <p className="checkout-review-item__name">{item.name}</p>
                                            <p>Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                                            {item.prime && <span className="prime-badge" style={{ fontSize: 10 }}>prime</span>}
                                        </div>
                                        <p className="checkout-review-item__total">${(item.price * item.qty).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                                <AOMAction id="checkout.review.back_to_payment" description="Go back to payment step from review">
                                    <button className="checkout-back-btn" onClick={() => setStep(1)}>Back</button>
                                </AOMAction>
                                <AOMAction id="checkout.review.place_order_main" description="Finalize checkout and place the order" safety={0.9}>
                                    <button className="checkout-place-btn" onClick={handlePlaceOrder}>Place Your Order</button>
                                </AOMAction>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order summary sidebar */}
                <div className="checkout-summary">
                    <div className="checkout-summary__card">
                        {step === 2 && (
                            <AOMAction id="checkout.review.place_order_sidebar" description="Finalize checkout and place the order from summary sidebar" safety={0.9}>
                                <button className="checkout-place-btn" onClick={handlePlaceOrder} style={{ marginBottom: 16 }}>Place Your Order</button>
                            </AOMAction>
                        )}
                        <p style={{ fontSize: 12, color: '#555', marginBottom: 12 }}>
                            By placing your order, you agree to Amazon's <span style={{ color: '#0066c0' }}>privacy notice</span> and <span style={{ color: '#0066c0' }}>conditions of use</span>.
                        </p>
                        <h3 className="checkout-summary__title">Order Summary</h3>
                        <div className="checkout-summary__rows">
                            <div className="checkout-summary__row">
                                <span>Items ({cartCount}):</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="checkout-summary__row">
                                <span>Shipping & handling:</span>
                                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="checkout-summary__divider" />
                            <div className="checkout-summary__row">
                                <span>Total before tax:</span>
                                <span>${(cartTotal + shipping).toFixed(2)}</span>
                            </div>
                            <div className="checkout-summary__row">
                                <span>Estimated tax (8.75%):</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="checkout-summary__divider" />
                            <div className="checkout-summary__row checkout-summary__row--total">
                                <span>Order total:</span>
                                <span className="checkout-summary__total-price">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
