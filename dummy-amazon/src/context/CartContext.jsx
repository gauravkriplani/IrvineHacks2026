import { createContext, useContext, useState, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            const existing = state.find(i => i.id === action.product.id);
            if (existing) {
                return state.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...state, { ...action.product, qty: 1 }];
        }
        case 'REMOVE':
            return state.filter(i => i.id !== action.id);
        case 'SET_QTY':
            if (action.qty <= 0) return state.filter(i => i.id !== action.id);
            return state.map(i => i.id === action.id ? { ...i, qty: action.qty } : i);
        case 'CLEAR':
            return [];
        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, []);
    const [wishlist, setWishlist] = useState([]);

    const addToCart = (product) => dispatch({ type: 'ADD', product });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE', id });
    const setQty = (id, qty) => dispatch({ type: 'SET_QTY', id, qty });
    const clearCart = () => dispatch({ type: 'CLEAR' });

    const toggleWishlist = (product) => {
        setWishlist(w =>
            w.some(i => i.id === product.id)
                ? w.filter(i => i.id !== product.id)
                : [...w, product]
        );
    };

    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const isInWishlist = (id) => wishlist.some(i => i.id === id);
    const isInCart = (id) => cart.some(i => i.id === id);

    return (
        <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, removeFromCart, setQty, clearCart, wishlist, toggleWishlist, isInWishlist, isInCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
