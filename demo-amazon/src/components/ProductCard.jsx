import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { AOMLink, AOMAction } from '../../../aom-wrappers';
import './ProductCard.css';

function Stars({ rating }) {
    return (
        <div className="product-stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ color: i <= Math.round(rating) ? '#FFA41C' : '#ccc', fontSize: 14 }}>★</span>
            ))}
            <span className="product-stars__count">{rating.toFixed(1)}</span>
        </div>
    );
}

export default function ProductCard({ product, onProductClick }) {
    const { addToCart, isInCart, toggleWishlist, isInWishlist } = useCart();
    const [added, setAdded] = useState(false);
    const inCart = isInCart(product.id);
    const wishlisted = isInWishlist(product.id);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const discount = product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <AOMLink id={`product.${product.id}.view_details`} description={`View details for ${product.name}`} destination="Product Detail">
            <div className="product-card" onClick={() => onProductClick(product)}>

                {/* Wishlist */}
                <AOMAction id={`product.${product.id}.toggle_wishlist`} description={`${wishlisted ? 'Remove' : 'Add'} ${product.name} ${wishlisted ? 'from' : 'to'} wishlist`}>
                    <button
                        className={`product-wishlist ${wishlisted ? 'product-wishlist--active' : ''}`}
                        onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
                        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        {wishlisted ? '♥' : '♡'}
                    </button>
                </AOMAction>

                {/* Image */}
                <div className="product-card__img-wrap">
                    <img src={product.image} alt={product.name} className="product-card__img" loading="lazy" />
                </div>

                {/* Info */}
                <div className="product-card__body">
                    <p className="product-card__name">{product.name}</p>
                    <Stars rating={product.rating} />
                    <p className="product-card__reviews">{product.reviewCount.toLocaleString()} ratings</p>

                    {product.prime && (
                        <div className="product-prime">
                            <span className="prime-badge">prime</span>
                        </div>
                    )}

                    <div className="product-card__price">
                        <span className="product-card__price-sym">$</span>
                        <span className="product-card__price-main">{Math.floor(product.price)}</span>
                        <span className="product-card__price-cents">{String(product.price.toFixed(2)).split('.')[1]}</span>
                        {discount > 0 && (
                            <span className="product-card__price-orig">${product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>

                    <AOMAction id={`product.${product.id}.add_to_cart`} description={`Add ${product.name} to cart`}>
                        <button
                            className={`product-card__add-btn ${added ? 'product-card__add-btn--added' : ''} ${inCart ? 'product-card__add-btn--in-cart' : ''}`}
                            onClick={handleAddToCart}
                        >
                            {added ? '✓ Added to Cart' : inCart ? 'Add Again' : 'Add to Cart'}
                        </button>
                    </AOMAction>
                </div>
            </div>
        </AOMLink>
    );
}
