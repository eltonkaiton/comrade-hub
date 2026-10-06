import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './Marketplace.css';

const API_BASE_URL = 'http://localhost:5000/api';
const API_HOST = API_BASE_URL.replace('/api', '');

// Category tiles (visual clickable tiles)
const categoryTiles = [
  { icon: '📱', name: 'Phones', value: 'Phones' },
  { icon: '💻', name: 'Laptops', value: 'Laptops' },
  { icon: '👕', name: 'Fashion', value: 'Fashion' },
  { icon: '🪑', name: 'Furniture', value: 'Furniture' },
  { icon: '📚', name: 'Books', value: 'Books' },
  { icon: '🎧', name: 'Electronics', value: 'Electronics' },
  { icon: '🍔', name: 'Food', value: 'Food' },
  { icon: '🏀', name: 'Sports', value: 'Sports' },
];

const CATEGORIES = [
  'All',
  'Phones',
  'Laptops',
  'Fashion',
  'Furniture',
  'Books',
  'Electronics',
  'Food',
  'Sports',
  'Cooking Appliances',
  'Other',
];

const CONDITIONS = ['All', 'New', 'Like New', 'Used', 'Good', 'Fair'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

// =====================================================
// BRAND LOGO
// =====================================================
const Logo = ({ className = 'marketplace-logo' }) => (
  <Link to="/" className={className}>
    <span className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" width="34" height="34" role="img">
        <defs>
          <linearGradient id="chGradMarket" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#chGradMarket)" />
        <path
          d="M13 22c0-4 3-7 7-7s7 3 7 7"
          stroke="#fff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="20" cy="13" r="3.4" fill="#fff" />
      </svg>
    </span>
    <span className="logo-text">
      Comrade<span>Hub</span>
    </span>
  </Link>
);

function HeroProductShowcase({ products, loading, formatPrice, getImageUrl }) {
  const showcaseProducts = products.slice(0, 5);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeIndex = showcaseProducts.length
    ? selectedIndex % showcaseProducts.length
    : 0;
  const activeProduct = showcaseProducts[activeIndex];
  const imageUrl = activeProduct?.images?.[0]
    ? getImageUrl(activeProduct.images[0])
    : null;

  useEffect(() => {
    if (isPaused || showcaseProducts.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setSelectedIndex((current) => (current + 1) % showcaseProducts.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, showcaseProducts.length]);

  const changeProduct = (offset) => {
    setSelectedIndex((current) =>
      (current + offset + showcaseProducts.length) % showcaseProducts.length
    );
  };

  return (
    <aside
      className="hero-showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      aria-label="Available products"
    >
      <div className="hero-showcase-header">
        <div>
          <span className="hero-showcase-label">AVAILABLE NOW</span>
          <h2>Fresh finds</h2>
        </div>
        {showcaseProducts.length > 0 && (
          <span className="hero-showcase-count">
            {activeIndex + 1} / {showcaseProducts.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="hero-showcase-loading" aria-label="Loading products">
          <div />
          <span>Finding products...</span>
        </div>
      ) : activeProduct ? (
        <>
          <div className="hero-showcase-media">
            <Link
              to={`/marketplace/product/${activeProduct._id}`}
              aria-label={`View ${activeProduct.title}`}
            >
              {imageUrl ? (
                <img
                  key={activeProduct._id}
                  src={imageUrl}
                  alt={activeProduct.title}
                />
              ) : (
                <span className="hero-showcase-fallback" aria-hidden="true">
                  {categoryTiles.find(
                    (tile) => tile.value === activeProduct.category
                  )?.icon || '📦'}
                </span>
              )}
            </Link>
            {showcaseProducts.length > 1 && (
              <>
                <button
                  type="button"
                  className="hero-showcase-control hero-showcase-previous"
                  onClick={() => changeProduct(-1)}
                  aria-label="Previous product"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="hero-showcase-control hero-showcase-next"
                  onClick={() => changeProduct(1)}
                  aria-label="Next product"
                >
                  ›
                </button>
                <div className="hero-showcase-dots" aria-label="Choose a product">
                  {showcaseProducts.map((product, index) => (
                    <button
                      key={product._id}
                      type="button"
                      className={index === activeIndex ? 'active' : ''}
                      onClick={() => setSelectedIndex(index)}
                      aria-label={`Show ${product.title}`}
                      aria-current={index === activeIndex ? 'true' : undefined}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="hero-showcase-info">
            <div className="hero-showcase-meta">
              <span>{activeProduct.category}</span>
              <span>{activeProduct.condition}</span>
            </div>
            <h3>{activeProduct.title}</h3>
            <div className="hero-showcase-bottom">
              <div>
                <strong>{formatPrice(activeProduct.price)}</strong>
                <span>📍 {activeProduct.location}</span>
              </div>
              <Link
                to={`/marketplace/product/${activeProduct._id}`}
                className="hero-showcase-cta"
              >
                View listing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="hero-showcase-empty">
          <span aria-hidden="true">🛍️</span>
          <strong>No active listings yet</strong>
          <span>New finds will show up here.</span>
          <Link to="/marketplace/post" className="hero-showcase-cta">
            List a product <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </aside>
  );
}

function Marketplace() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---- Data state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ---- Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [condition, setCondition] = useState('All');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // ---- Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  // Sync category from URL
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, condition, location, minPrice, maxPrice, sortBy]);

  // ---- Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit, sort: sortBy };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category && category !== 'All') params.category = category;
      if (condition && condition !== 'All') params.condition = condition;
      if (location.trim()) params.location = location.trim();
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await axios.get(`${API_BASE_URL}/products`, { params });

      if (res.data.success) {
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, debouncedSearch, category, condition, location, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const selectCategory = (cat) => {
    const value = cat === 'All' ? '' : cat;
    setCategory(cat);
    setSearchParams(value ? { category: value } : {});
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setCondition('All');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  const formatPrice = (n) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(n || 0);

  const formatDate = (d) => {
    if (!d) return '';
    const diff = Math.floor((Date.now() - new Date(d)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return new Date(d).toLocaleDateString();
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_HOST}${path}`;
  };

  const activeFiltersCount =
    (category !== 'All' ? 1 : 0) +
    (condition !== 'All' ? 1 : 0) +
    (location ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0);

  return (
    <div className="marketplace-page">
      {/* ============ NAVBAR ============ */}
      <header className="marketplace-navbar">
        <Logo />

        <nav className="marketplace-nav-links">
          <Link to="/">Home</Link>
          <Link to="/marketplace" className="active">Marketplace</Link>
          <Link to="/houses">Houses</Link>
          <Link to="/transport">Transport</Link>
          <Link to="/laundry">Laundry</Link>
          <Link to="/services">Services</Link>
          <Link to="/advertise">Advertise</Link>
        </nav>

        <div className="marketplace-nav-actions">
          <button
            className="market-sell-btn"
            onClick={() => navigate('/marketplace/post')}
          >
            + Sell Something
          </button>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="marketplace-hero">
        <div className="marketplace-hero-inner">
          <div className="marketplace-hero-content">
            <span className="marketplace-badge">🛍️ Comrade Marketplace</span>
            <h1>
              Buy &amp; Sell Within<span> Your Community</span>
            </h1>
            <p>
              Find great deals from fellow comrades. Search, filter, and shop
              with confidence.
            </p>

            <form
              className="marketplace-search"
              onSubmit={(e) => e.preventDefault()}
            >
              <span>🔍</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search phones, laptops, clothes, furniture..."
              />
              <select
                value={category}
                onChange={(e) => selectCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button type="submit">Search</button>
            </form>

            <div className="hero-links">
              <span>Popular:</span>
              <button type="button" onClick={() => selectCategory('Phones')}>Phones</button>
              <button type="button" onClick={() => selectCategory('Laptops')}>Laptops</button>
              <button type="button" onClick={() => selectCategory('Furniture')}>Furniture</button>
              <button type="button" onClick={() => selectCategory('Fashion')}>Fashion</button>
            </div>
          </div>

          <HeroProductShowcase
            products={products}
            loading={loading}
            formatPrice={formatPrice}
            getImageUrl={getImageUrl}
          />
        </div>
      </section>

      {/* ============ MAIN ============ */}
      <main className="marketplace-container">
        {/* CATEGORY TILES */}
        <section className="market-section">
          <div className="market-section-header">
            <div>
              <span className="section-label">BROWSE</span>
              <h2>Shop by Category</h2>
            </div>
            <button className="view-all-btn" onClick={clearFilters}>
              View All →
            </button>
          </div>

          <div className="market-category-grid">
            {categoryTiles.map((tile) => (
              <button
                key={tile.name}
                className={`market-category-card ${
                  category === tile.value ? 'active' : ''
                }`}
                onClick={() => selectCategory(tile.value)}
              >
                <div className="category-icon">{tile.icon}</div>
                <div>
                  <h3>{tile.name}</h3>
                  <p>Browse listings</p>
                </div>
                <span className="category-arrow">→</span>
              </button>
            ))}
          </div>
        </section>

        {/* FILTER BAR */}
        <section className="market-section">
          <div className="market-section-header">
            <div>
              <span className="section-label">FILTERS</span>
              <h2>Refine Results</h2>
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="view-all-link">
                Clear Filters ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="filters-bar">
            <div className="filter-group">
              <label>Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="e.g. Nairobi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Min Price (KES)</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
            </div>

            <div className="filter-group">
              <label>Max Price (KES)</label>
              <input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* PRODUCT LISTINGS */}
        <section className="market-section">
          <div className="market-section-header">
            <div>
              <span className="section-label">LISTINGS</span>
              <h2>
                {loading
                  ? 'Loading...'
                  : `${total} ${total === 1 ? 'Product' : 'Products'} Found`}
              </h2>
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="marketplace-empty">
              <div className="empty-icon">🛒</div>
              <h3>No listings found</h3>
              <p>Try another search or category.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                    getImageUrl={getImageUrl}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ← Prev
                  </button>
                  <span className="page-info">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* SELL CTA */}
        <section className="sell-cta">
          <div className="sell-cta-icon">💰</div>
          <div className="sell-cta-content">
            <span>HAVE SOMETHING TO SELL?</span>
            <h2>Turn Your Unused Items Into Cash</h2>
            <p>
              List your product on ComradeHub and reach thousands of
              potential buyers. Add photos and short videos — we'll cycle
              them automatically.
            </p>
          </div>
          <button
            onClick={() => navigate('/marketplace/post')}
            className="sell-cta-btn"
          >
            + Post an Item
          </button>
        </section>
      </main>

      <footer className="marketplace-footer">
        <div>
          <Logo className="footer-market-logo" />
          <p>Everything Comrades Need, In One Place.</p>
        </div>
        <div className="market-footer-links">
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/houses">Houses</Link>
          <Link to="/transport">Transport</Link>
          <Link to="/services">Services</Link>
          <Link to="/help">Help</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="market-footer-bottom">
          © 2026 ComradeHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// =====================================================
// PRODUCT CARD
// =====================================================
function ProductCard({ product, formatPrice, formatDate, getImageUrl }) {
  const imageUrls = (product.images || []).map(getImageUrl).filter(Boolean);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (imageUrls.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % imageUrls.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [imageUrls.length]);

  const changeImage = (event, offset) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImage((current) =>
      (current + offset + imageUrls.length) % imageUrls.length
    );
  };

  return (
    <article className="product-card">
      <div className="product-image">
        <Link
          to={`/marketplace/product/${product._id}`}
          className="product-image-link"
          aria-label={`View ${product.title}`}
        >
          {imageUrls.map((imageUrl, index) => (
            <img
              key={`${imageUrl}-${index}`}
              src={imageUrl}
              alt={product.title}
              className={`product-frame product-img ${
                index === activeImage ? 'active' : ''
              }`}
              aria-hidden={index !== activeImage}
            />
          ))}
          {imageUrls.length === 0 && (
            <span className="product-frame product-emoji-frame active">
              📦
            </span>
          )}
        </Link>

        {imageUrls.length > 1 && (
          <>
            <button
              type="button"
              className="product-slide-control product-slide-previous"
              onClick={(event) => changeImage(event, -1)}
              aria-label={`Previous photo for ${product.title}`}
            >
              ‹
            </button>
            <button
              type="button"
              className="product-slide-control product-slide-next"
              onClick={(event) => changeImage(event, 1)}
              aria-label={`Next photo for ${product.title}`}
            >
              ›
            </button>
            <div className="cycle-dots" role="group" aria-label="Product photos">
              {imageUrls.map((imageUrl, index) => (
                <button
                  key={`${imageUrl}-${index}`}
                  type="button"
                  className={`dot ${index === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show photo ${index + 1} of ${product.title}`}
                  aria-current={index === activeImage ? 'true' : undefined}
                />
              ))}
            </div>
          </>
        )}

        <span className="condition-badge">{product.condition}</span>

        {product.status === 'sold' && (
          <span className="sold-badge">SOLD</span>
        )}

        <button
          className="favorite-btn"
          onClick={(e) => e.preventDefault()}
          aria-label="Add to favorites"
        >
          ♡
        </button>
      </div>

      <Link
        to={`/marketplace/product/${product._id}`}
        className="product-info-link"
      >
        <div className="product-info">
          <h3>{product.title}</h3>

          <div className="price-row">
            <strong>{formatPrice(product.price)}</strong>
          </div>

          <div className="product-meta">
            <span>📍 {product.location}</span>
            <span>• {formatDate(product.createdAt)}</span>
          </div>

          <div className="seller-info">
            <div className="seller-avatar">
              {(product.sellerId?.name || 'C').charAt(0).toUpperCase()}
            </div>
            <span>{product.sellerId?.name || 'Comrade'}</span>
            <span className="verified">✓</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default Marketplace;