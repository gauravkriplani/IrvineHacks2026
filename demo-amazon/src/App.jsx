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
import { AOMAction } from '../../aom-wrappers';
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
  const [isAgentOpen, setIsAgentOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const updateFilter = (update) => {
    setFilters(f => ({ ...f, ...update }));
    setCurrentPage(1);
  };

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
    // Phase 1: Filter only by actual hard filters (category, price, etc). DO NOT filter by search query yet.
    let list = products.filter(p => {
      if (filters.category !== 'All' && p.category !== filters.category) return false;
      if (filters.brand && p.brand !== filters.brand) return false;
      if (p.price < filters.priceMin) return false;
      if (p.price > filters.priceMax) return false;
      if (p.rating < filters.minRating) return false;
      if (filters.prime && !p.prime) return false;
      return true;
    });

    // Phase 2: If there's a search query, score every remaining item. 
    // We never return false here, we just score them so the most relevant bubble to the top.
    if (searchQuery) {
      const queryWords = searchQuery.toLowerCase().split(' ').filter(w => w.trim().length > 0);

      list = list.map(p => {
        let sc = 0;
        const nameLc = p.name.toLowerCase();
        const catLc = p.category.toLowerCase();
        const brandLc = p.brand.toLowerCase();

        for (const w of queryWords) {
          if (nameLc.includes(w)) sc += 3;
          if (catLc.includes(w)) sc += 2;
          if (brandLc.includes(w)) sc += 1;
        }

        // Slight boost for exact substring matches to preserve expected behavior
        if (nameLc.includes(searchQuery.toLowerCase())) sc += 5;

        return { ...p, relevanceScore: sc };
      });

      // Sort by relevance (highest score first)
      list.sort((a, b) => b.relevanceScore - a.relevanceScore);

      // If the sort option isn't 'featured', the user explicitly asked to sort by price/rating etc, 
      // so we will respect that overriding the relevance sort below.
    }

    // Phase 3: Apply user-selected sorting methods (overrides relevance sort if not 'featured')
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'newest': list = [...list].reverse(); break;
      case 'featured':
        // If sorting by featured AND we aren't already sorted by relevance query, sort by review/rating combo
        if (!searchQuery) {
          list = [...list].sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
        }
        break;
    }

    return list;
  }, [searchQuery, filters, sort]);

  return (
    <CartProvider>
      <div className="app" style={{ paddingRight: isAgentOpen ? '400px' : '0', transition: 'padding-right 0.3s ease' }}>
        <Header
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); setView('home'); setSelectedProduct(null); setCurrentPage(1); }}
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
                    {filters.category !== 'All' && (
                      <AOMAction id="clear_filter.category" description={`Remove category filter: ${filters.category}`}>
                        <span className="filter-tag" onClick={() => updateFilter({ category: 'All' })}>{filters.category} ✕</span>
                      </AOMAction>
                    )}
                    {filters.brand && (
                      <AOMAction id="clear_filter.brand" description={`Remove brand filter: ${filters.brand}`}>
                        <span className="filter-tag" onClick={() => updateFilter({ brand: '' })}>{filters.brand} ✕</span>
                      </AOMAction>
                    )}
                    {filters.priceMin > 0 && (
                      <AOMAction id="clear_filter.price" description="Remove active price filter">
                        <span className="filter-tag" onClick={() => updateFilter({ priceMin: 0, priceMax: Infinity })}>Under ${filters.priceMax === Infinity ? '∞' : filters.priceMax} ✕</span>
                      </AOMAction>
                    )}
                    {filters.minRating > 0 && (
                      <AOMAction id="clear_filter.rating" description={`Remove minimum rating filter`}>
                        <span className="filter-tag" onClick={() => updateFilter({ minRating: 0 })}>{filters.minRating}+ Stars ✕</span>
                      </AOMAction>
                    )}
                    {filters.prime && (
                      <AOMAction id="clear_filter.prime" description="Remove prime requirement filter">
                        <span className="filter-tag" onClick={() => updateFilter({ prime: false })}>Prime ✕</span>
                      </AOMAction>
                    )}
                  </div>
                )}

                {/* Product grid */}
                {filteredProducts.length > 0 ? (
                  <>
                    <div className="product-grid">
                      {filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(p => (
                        <ProductCard key={p.id} product={p} onProductClick={handleProductClick} />
                      ))}
                    </div>

                    {filteredProducts.length > ITEMS_PER_PAGE && (() => {
                      const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
                      return (
                        <div className="pagination">
                          <AOMAction id="pagination.prev" description="Go to previous page of products">
                            <button
                              className="pagination__btn"
                              disabled={currentPage === 1}
                              onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}>
                              &lt; Previous
                            </button>
                          </AOMAction>

                          <div className="pagination__pages">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <AOMAction key={page} id={`pagination.page_${page}`} description={`Go to page ${page} of products`}>
                                <button
                                  className={`pagination__page-btn ${currentPage === page ? 'active' : ''}`}
                                  onClick={() => { setCurrentPage(page); window.scrollTo(0, 0); }}
                                >
                                  {page}
                                </button>
                              </AOMAction>
                            ))}
                          </div>

                          <AOMAction id="pagination.next" description="Go to next page of products">
                            <button
                              className="pagination__btn"
                              disabled={currentPage === totalPages}
                              onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}>
                              Next &gt;
                            </button>
                          </AOMAction>
                        </div>
                      );
                    })()}
                  </>
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

        <AgentDashboard isOpen={isAgentOpen} onToggle={() => setIsAgentOpen(!isAgentOpen)} />
      </div>
    </CartProvider>
  );
}

export default App;
