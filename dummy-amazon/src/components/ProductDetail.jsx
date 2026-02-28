import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { AOMLink, AOMAction, AOMInput } from '../../../aom-wrappers';
import './ProductDetail.css';

const BackIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>;

function Stars({ rating, count }) {
    return (
        <div className="pd-stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ color: i <= Math.round(rating) ? '#FFA41C' : '#ccc', fontSize: 18 }}>★</span>
            ))}
            <span className="pd-stars__count">{rating.toFixed(1)} ({count.toLocaleString()} ratings)</span>
        </div>
    );
}

const FEATURES = [
    'Free Returns on eligible items',
    'Ships in Amazon packaging',
    '30-day return window',
];

// Initial fake reviews with stable vote counts
const INITIAL_REVIEWS = [
    { name: 'David M.', rating: 5, title: 'Absolutely love it!', body: 'This product exceeded my expectations. The quality is top-notch and it arrived super fast.', date: 'January 15, 2025', helpfulYes: 47, helpfulNo: 3 },
    { name: 'Sarah K.', rating: 4, title: 'Great product, minor issues', body: 'Really happy with this purchase overall. Would definitely recommend to anyone looking for a quality product at a fair price.', date: 'December 8, 2024', helpfulYes: 28, helpfulNo: 5 },
    { name: 'Mike P.', rating: 5, title: 'Best purchase this year', body: 'The product quality is amazing. Fast shipping and great packaging. Will buy again!', date: 'November 20, 2024', helpfulYes: 61, helpfulNo: 2 },
];

export default function ProductDetail({ product, onBack, onViewChange, hasPurchased }) {
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);
    const [tab, setTab] = useState('description');
    const [cartFeedback, setCartFeedback] = useState(false);
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [myVotes, setMyVotes] = useState({});  // { reviewIndex: 'yes'|'no' }

    // New review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, title: '', body: '' });
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const discount = product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        setCartFeedback(true);
        setTimeout(() => setCartFeedback(false), 2000);
    };

    const handleBuyNow = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        onViewChange?.('cart');
    };

    const handleVote = (idx, vote) => {
        if (myVotes[idx] === vote) {
            // Undo vote
            setMyVotes(v => { const n = { ...v }; delete n[idx]; return n; });
            setReviews(rs => rs.map((r, i) => i !== idx ? r : {
                ...r,
                helpfulYes: vote === 'yes' ? r.helpfulYes - 1 : r.helpfulYes,
                helpfulNo: vote === 'no' ? r.helpfulNo - 1 : r.helpfulNo,
            }));
        } else {
            const prev = myVotes[idx];
            setMyVotes(v => ({ ...v, [idx]: vote }));
            setReviews(rs => rs.map((r, i) => i !== idx ? r : {
                ...r,
                helpfulYes: vote === 'yes' ? r.helpfulYes + 1 : (prev === 'yes' ? r.helpfulYes - 1 : r.helpfulYes),
                helpfulNo: vote === 'no' ? r.helpfulNo + 1 : (prev === 'no' ? r.helpfulNo - 1 : r.helpfulNo),
            }));
        }
    };

    const handleSubmitReview = () => {
        if (!newReview.title.trim() || !newReview.body.trim()) return;
        const r = {
            name: 'You',
            rating: newReview.rating,
            title: newReview.title,
            body: newReview.body,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            helpfulYes: 0,
            helpfulNo: 0,
        };
        setReviews(rs => [r, ...rs]);
        setNewReview({ rating: 5, title: '', body: '' });
        setShowReviewForm(false);
        setReviewSubmitted(true);
    };

    return (
        <div className="product-detail">
            <AOMLink id="product_detail.back_to_results" description="Go back to previous product list" destination="Results">
                <button className="pd-back" onClick={onBack}>
                    <BackIcon /> Back to results
                </button>
            </AOMLink>

            <div className="pd-body">
                {/* Left: Image */}
                <div className="pd-image-section">
                    <img src={product.image} alt={product.name} className="pd-main-img" />
                    <div className="pd-thumbs">
                        {[product.image, product.image, product.image].map((img, i) => (
                            <img key={i} src={img} alt="" className="pd-thumb" style={{ opacity: i === 0 ? 1 : 0.6, filter: `hue-rotate(${i * 30}deg)` }} />
                        ))}
                    </div>
                </div>

                {/* Center: Info */}
                <div className="pd-info">
                    <div className="pd-info__brand">{product.brand}</div>
                    <h1 className="pd-info__name">{product.name}</h1>
                    <Stars rating={product.rating} count={product.reviewCount} />

                    <div className="pd-divider" />

                    <div className="pd-price-block">
                        {discount > 0 && (
                            <span className="pd-discount-label">{discount}% off</span>
                        )}
                        <div className="pd-price">
                            <span className="pd-price__sym">$</span>
                            <span className="pd-price__main">{Math.floor(product.price)}</span>
                            <span className="pd-price__cents">.{String(product.price.toFixed(2)).split('.')[1]}</span>
                        </div>
                        {discount > 0 && (
                            <p className="pd-was">List Price: <span className="pd-was__price">${product.originalPrice.toFixed(2)}</span></p>
                        )}
                    </div>

                    {product.prime && (
                        <div className="pd-prime">
                            <span className="prime-badge">prime</span>
                            <span className="pd-prime__text">FREE delivery <strong>Tomorrow</strong></span>
                        </div>
                    )}

                    <div className="pd-tabs">
                        <AOMAction id="product_detail.tab_description" description="View product description tab">
                            <button className={`pd-tab ${tab === 'description' ? 'pd-tab--active' : ''}`} onClick={() => setTab('description')}>Description</button>
                        </AOMAction>
                        <AOMAction id="product_detail.tab_features" description="View product features tab">
                            <button className={`pd-tab ${tab === 'features' ? 'pd-tab--active' : ''}`} onClick={() => setTab('features')}>Features</button>
                        </AOMAction>
                    </div>

                    {tab === 'description' && (
                        <p className="pd-description">{product.description}</p>
                    )}
                    {tab === 'features' && (
                        <ul className="pd-features">
                            <li>✓ Brand: {product.brand}</li>
                            <li>✓ Category: {product.category}</li>
                            {FEATURES.map(f => <li key={f}>✓ {f}</li>)}
                            <li>✓ Rating: {product.rating} / 5.0</li>
                        </ul>
                    )}
                </div>

                {/* Right: Buy box */}
                <div className="pd-buy-box">
                    <div className="pd-buy-box__price">
                        <span className="pd-buy-box__price-sym">$</span>
                        <span className="pd-buy-box__price-main">{product.price.toFixed(2)}</span>
                    </div>
                    {product.prime && (
                        <div className="pd-buy-prime">
                            <span className="prime-badge">prime</span>
                            <span style={{ fontSize: 12 }}>FREE delivery Tomorrow</span>
                        </div>
                    )}
                    <p className="pd-buy-stock">In Stock</p>

                    <div className="pd-qty-selector">
                        <label style={{ fontSize: 13 }}>Quantity:</label>
                        <AOMInput id={`product.${product.id}.buy_quantity`} description={`Quantity of ${product.name} to buy`} inputType="select">
                            <select className="pd-qty-select" value={qty} onChange={e => setQty(Number(e.target.value))}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </AOMInput>
                    </div>

                    <AOMAction id={`product.${product.id}.add_to_cart_detail`} description={`Add ${qty} ${product.name} to cart`}>
                        <button
                            className={`pd-add-cart-btn ${cartFeedback ? 'pd-add-cart-btn--added' : ''}`}
                            onClick={handleAddToCart}
                        >
                            {cartFeedback ? '✓ Added to Cart!' : 'Add to Cart'}
                        </button>
                    </AOMAction>
                    <AOMAction id={`product.${product.id}.buy_now`} description={`Buy ${qty} ${product.name} immediately`} safety={0.8}>
                        <button className="pd-buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
                    </AOMAction>

                    <div className="pd-buy-details">
                        <p>Ships from <strong>Amazon</strong></p>
                        <p>Sold by <strong>{product.brand}</strong></p>
                        <p>Payment <strong>Secure transaction</strong></p>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="pd-reviews">
                <div className="pd-reviews__header-row">
                    <h2 className="pd-reviews__title">Customer Reviews</h2>
                    {hasPurchased && !reviewSubmitted && (
                        <AOMAction id={`product.${product.id}.write_review`} description="Write a customer review">
                            <button className="pd-write-review-btn" onClick={() => setShowReviewForm(v => !v)}>
                                {showReviewForm ? 'Cancel' : '✎ Write a review'}
                            </button>
                        </AOMAction>
                    )}
                    {reviewSubmitted && (
                        <span className="pd-review-submitted">✓ Your review was posted!</span>
                    )}
                </div>

                {showReviewForm && (
                    <div className="pd-review-form">
                        <h3>Write your review</h3>
                        <div className="pd-review-form__rating">
                            <label>Your rating:</label>
                            <div className="pd-review-form__stars">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <AOMAction
                                        key={n}
                                        id={`product.${product.id}.review_rating_${n}`}
                                        description={`Set review rating to ${n} stars`}
                                    >
                                        <button
                                            className={`pd-star-btn ${n <= newReview.rating ? 'pd-star-btn--on' : ''}`}
                                            onClick={() => setNewReview(r => ({ ...r, rating: n }))}
                                        >★</button>
                                    </AOMAction>
                                ))}
                            </div>
                        </div>
                        <AOMInput id={`product.${product.id}.review_title`} description="Review title" inputType="text">
                            <input
                                className="pd-review-form__input"
                                placeholder="Review title"
                                value={newReview.title}
                                onChange={e => setNewReview(r => ({ ...r, title: e.target.value }))}
                            />
                        </AOMInput>
                        <AOMInput id={`product.${product.id}.review_body`} description="Review body text" inputType="textarea">
                            <textarea
                                className="pd-review-form__textarea"
                                placeholder="Share your experience with this product..."
                                value={newReview.body}
                                onChange={e => setNewReview(r => ({ ...r, body: e.target.value }))}
                                rows={4}
                            />
                        </AOMInput>
                        <AOMAction id={`product.${product.id}.submit_review`} description="Submit the customer review">
                            <button className="pd-review-form__submit" onClick={handleSubmitReview}>Submit Review</button>
                        </AOMAction>
                    </div>
                )}

                <div className="pd-reviews__summary">
                    <div className="pd-reviews__overall">
                        <div className="pd-reviews__big-rating">{product.rating.toFixed(1)}</div>
                        <div>
                            {[1, 2, 3, 4, 5].map(i => (
                                <span key={i} style={{ color: i <= Math.round(product.rating) ? '#FFA41C' : '#ccc', fontSize: 24 }}>★</span>
                            ))}
                            <p style={{ fontSize: 12, color: '#555' }}>out of 5</p>
                        </div>
                    </div>
                    <div className="pd-reviews__bars">
                        {[5, 4, 3, 2, 1].map(n => {
                            const pct = n === 5 ? 62 : n === 4 ? 23 : n === 3 ? 9 : n === 2 ? 3 : 3;
                            return (
                                <div key={n} className="pd-review-bar">
                                    <span style={{ fontSize: 13, color: '#0066c0', whiteSpace: 'nowrap' }}>{n} star</span>
                                    <div className="pd-review-bar__track">
                                        <div className="pd-review-bar__fill" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span style={{ fontSize: 13, color: '#0066c0' }}>{pct}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="pd-reviews__list">
                    {reviews.map((r, i) => (
                        <div key={i} className="pd-review">
                            <div className="pd-review__header">
                                <div className="pd-review__avatar">{r.name[0]}</div>
                                <span className="pd-review__name">{r.name}</span>
                            </div>
                            <div className="pd-review__stars">
                                {[1, 2, 3, 4, 5].map(j => <span key={j} style={{ color: j <= r.rating ? '#FFA41C' : '#ccc', fontSize: 14 }}>★</span>)}
                                <span className="pd-review__title">{r.title}</span>
                            </div>
                            <p className="pd-review__date">Reviewed in the United States on {r.date}</p>
                            <p className="pd-review__body">{r.body}</p>
                            <div className="pd-review__helpful">
                                <span style={{ fontSize: 13, color: '#555' }}>Helpful?</span>
                                <AOMAction id={`product.${product.id}.review_${i}.vote_yes`} description={`Vote YES helpful for review by ${r.name}`}>
                                    <button
                                        className={`pd-review__helpful-btn ${myVotes[i] === 'yes' ? 'pd-review__helpful-btn--voted' : ''}`}
                                        onClick={() => handleVote(i, 'yes')}
                                        title="Yes, this was helpful"
                                    >
                                        👍 Yes ({r.helpfulYes})
                                    </button>
                                </AOMAction>
                                <AOMAction id={`product.${product.id}.review_${i}.vote_no`} description={`Vote NO helpful for review by ${r.name}`}>
                                    <button
                                        className={`pd-review__helpful-btn ${myVotes[i] === 'no' ? 'pd-review__helpful-btn--voted' : ''}`}
                                        onClick={() => handleVote(i, 'no')}
                                        title="No, this was not helpful"
                                    >
                                        👎 No ({r.helpfulNo})
                                    </button>
                                </AOMAction>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
