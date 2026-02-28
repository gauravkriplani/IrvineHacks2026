import { useState, useMemo } from 'react';
import { CartProvider } from './context/CartContext';
import { products } from './data/products';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import Checkout from './components/Checkout';
import OrdersPage from './components/OrdersPage';
import AddressModal from './components/AddressModal';
import AgentDashboard from './components/AgentDashboard/AgentDashboard';
import './App.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const DEFAULT_FILTERS = {
  category: 'All',
  brand: '',
  priceMin: 0,
  priceMax: Infinity,
  minRating: 0,
  prime: false,
};

const DEFAULT_ADDRESS = {
  fullName: 'John Doe',
  phone: '555-555-5555',
  address: '123 Main St',
  city: 'San Francisco',
  state: 'CA',
  zip: '94105',
  country: 'United States',
};

function App() {
  const [view, setView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('featured');
  const [deliveryAddress, setDeliveryAddress] = useState(DEFAULT_ADDRESS);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  const updateFilter = (update) => setFilters(f => ({ ...f, ...update }));

  const handleViewChange = (v, product) => {
    setView(v);
    if (v === 'detail' && product) setSelectedProduct(product);
    else if (v !== 'detail') setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (order) => {
    setRecentOrders(prev => [order, ...prev]);
  };

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.category !== 'All' && p.category !== filters.category) return false;
      if (filters.brand && p.brand !== filters.brand) return false;
      if (p.price < filters.priceMin) return false;
      if (p.price > filters.priceMax) return false;
      if (p.rating < filters.minRating) return false;
      if (filters.prime && !p.prime) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'newest': list = [...list].reverse(); break;
    }
    return list;
  }, [searchQuery, filters, sort]);

  return (
    <CartProvider>
      <div className="app">
        <Header
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); setView('home'); setSelectedProduct(null); }}
          onCategoryFilter={(cat) => updateFilter({ category: cat })}
          onViewChange={handleViewChange}
          deliveryAddress={deliveryAddress}
          onAddressClick={() => setShowAddressModal(true)}
        />

        {/* Address modal */}
        {showAddressModal && (
          <AddressModal
            currentAddress={deliveryAddress}
            onSave={(addr) => setDeliveryAddress(addr)}
            onClose={() => setShowAddressModal(false)}
          />
        )}

        <div className="app-body">
          {/* CART PAGE */}
          {view === 'cart' && (
            <CartPage
              onViewChange={handleViewChange}
              onCheckout={() => handleViewChange('checkout')}
            />
          )}

          {/* CHECKOUT */}
          {view === 'checkout' && (
            <Checkout
              deliveryAddress={deliveryAddress}
              onAddressChange={() => setShowAddressModal(true)}
              onBack={() => handleViewChange('home')}
              onOrderPlaced={handleOrderPlaced}
            />
          )}

          {/* ORDERS */}
          {view === 'orders' && (
            <OrdersPage
              recentOrders={recentOrders}
              onViewChange={handleViewChange}
            />
          )}

          {/* PRODUCT DETAIL */}
          {view === 'detail' && selectedProduct && (
            <div className="app-detail-wrap">
              <ProductDetail
                product={selectedProduct}
                onBack={() => handleViewChange('home')}
                onViewChange={handleViewChange}
                hasPurchased={recentOrders.length > 0}
              />
            </div>
          )}

          {/* HOME / PRODUCT GRID */}
          {view === 'home' && (
            <div className="app-main">
              <Sidebar filters={filters} onFilterChange={updateFilter} />
              <div className="app-content">
                {/* Results header */}
                <div className="results-header">
                  <div className="results-header__left">
                    {searchQuery && (
                      <p className="results-query">
                        Results for "<span>{searchQuery}</span>"
                      </p>
                    )}
                    <p className="results-count">
                      {filteredProducts.length.toLocaleString()} results{filters.category !== 'All' && ` in ${filters.category}`}
                    </p>
                  </div>
                  <div className="results-header__right">
                    <label className="sort-label">Sort by:</label>
                    <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                      {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Active filters bar */}
                {(filters.category !== 'All' || filters.brand || filters.priceMin > 0 || filters.priceMax < Infinity || filters.minRating > 0 || filters.prime) && (
                  <div className="active-filters">
                    <span className="active-filters__label">Active Filters:</span>
                    {filters.category !== 'All' && <span className="filter-tag" onClick={() => updateFilter({ category: 'All' })}>{filters.category} ✕</span>}
                    {filters.brand && <span className="filter-tag" onClick={() => updateFilter({ brand: '' })}>{filters.brand} ✕</span>}
                    {filters.priceMin > 0 && <span className="filter-tag" onClick={() => updateFilter({ priceMin: 0, priceMax: Infinity })}>Under ${filters.priceMax === Infinity ? '∞' : filters.priceMax} ✕</span>}
                    {filters.minRating > 0 && <span className="filter-tag" onClick={() => updateFilter({ minRating: 0 })}>{filters.minRating}+ Stars ✕</span>}
                    {filters.prime && <span className="filter-tag" onClick={() => updateFilter({ prime: false })}>Prime ✕</span>}
                  </div>
                )}

                {/* Product grid */}
                {filteredProducts.length > 0 ? (
                  <div className="product-grid">
                    {filteredProducts.map(p => (
                      <ProductCard key={p.id} product={p} onProductClick={handleProductClick} />
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <div className="no-results__icon">🔍</div>
                    <h2>No results for "{searchQuery || 'your search'}"</h2>
                    <p>Try checking your spelling or use more general terms.</p>
                    <button className="no-results__clear" onClick={() => { setSearchQuery(''); setFilters(DEFAULT_FILTERS); }}>Clear all filters</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <AgentDashboard />
      </div>
    </CartProvider>
  );
}

export default App;
