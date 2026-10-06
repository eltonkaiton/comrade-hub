import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './ProductDetails.css';

const API_BASE_URL = 'https://comradehub-api.onrender.com';
const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/1000x1000?text=No+Image';

const getProductImageUrl = (image) => {
  if (!image) return PLACEHOLDER_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_BASE_URL}/${image.replace(/^\/+/, '')}`;
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (response.status === 404) {
          throw new Error('This product was not found.');
        }
        if (!response.ok) {
          throw new Error(`Failed to load product (${response.status})`);
        }

        const data = await response.json();

        // Backend may return the product directly, or wrap it in { product } / { data }
        const raw = data?.product ?? data?.data ?? data;

        if (!raw || (!raw._id && !raw.id)) {
          throw new Error('Invalid product data received.');
        }

        const seller = raw.seller || raw.owner || {};

        const normalized = {
          id: raw._id ?? raw.id,
          name: raw.name ?? raw.title ?? 'Untitled product',
          price: Number(raw.price ?? 0),
          category: raw.category ?? 'Other',
          condition: raw.condition ?? 'Used',
          location: raw.location ?? 'Location not specified',
          description: raw.description ?? 'No description provided.',
          features: Array.isArray(raw.features)
            ? raw.features
            : typeof raw.features === 'string'
            ? raw.features.split(',').map((f) => f.trim()).filter(Boolean)
            : [],
          images: (
            Array.isArray(raw.images) && raw.images.length > 0
              ? raw.images
              : raw.image
              ? [raw.image]
              : [PLACEHOLDER_IMAGE]
          ).map(getProductImageUrl),
          seller: {
            name:
              seller.name ||
              seller.fullName ||
              raw.sellerName ||
              'ComradeHub User',
            phone: seller.phone || raw.phone || '',
            email: seller.email || raw.contactEmail || '',
            verified: Boolean(seller.verified ?? true),
          },
        };

        if (isMounted) {
          setProduct(normalized);
          setActiveImage(0);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) setError(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) fetchProduct();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="product-details-page">
        <nav className="product-details-nav">
          <Link to="/" className="product-details-logo">
            🎓 Comrade<span>Hub</span>
          </Link>
        </nav>
        <div className="product-details-state">
          <p>Loading product details…</p>
        </div>
      </div>
    );
  }

  // ---------- Error ----------
  if (error || !product) {
    return (
      <div className="product-details-page">
        <nav className="product-details-nav">
          <Link to="/" className="product-details-logo">
            🎓 Comrade<span>Hub</span>
          </Link>
        </nav>
        <div className="product-details-state">
          <h2>😕 {error || 'Product not found'}</h2>
          <p>The listing you are looking for may have been removed or sold.</p>
          <Link to="/marketplace" className="product-details-cta">
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello ${product.seller.name}, I found your "${product.name}" listing on ComradeHub. Is it still available?`
  );

  const phoneDigits = product.seller.phone.replace(/\D/g, '');
  const hasPhone = phoneDigits.length > 0;

  return (
    <div className="product-details-page">
      <nav className="product-details-nav">
        <Link to="/" className="product-details-logo">
          🎓 Comrade<span>Hub</span>
        </Link>

        <div className="product-details-links">
          <Link to="/">Home</Link>
          <Link to="/marketplace" className="active">
            Marketplace
          </Link>
          <Link to="/houses">Houses</Link>
          <Link to="/transport">Transport</Link>
          <Link to="/services">Services</Link>
        </div>

        <Link to="/marketplace/post" className="sell-product-btn">
          + Sell Something
        </Link>
      </nav>

      <main className="product-details-container">
        <div className="product-breadcrumb">
          <button onClick={() => navigate(-1)}>← Back</button>
          <span>/</span>
          <Link to="/marketplace">Marketplace</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-details-grid">
          <section className="product-image-section">
            <div className="product-main-image">
              <img
                src={product.images[activeImage] || PLACEHOLDER_IMAGE}
                alt={product.name}
              />

              {product.images.length > 1 && (
                <>
                  <button
                    className="product-gallery-control product-gallery-previous"
                    type="button"
                    onClick={() =>
                      setActiveImage(
                        (current) =>
                          (current - 1 + product.images.length) %
                          product.images.length
                      )
                    }
                    aria-label="View previous product photo"
                  >
                    ‹
                  </button>
                  <button
                    className="product-gallery-control product-gallery-next"
                    type="button"
                    onClick={() =>
                      setActiveImage((current) =>
                        (current + 1) % product.images.length
                      )
                    }
                    aria-label="View next product photo"
                  >
                    ›
                  </button>
                  <span className="product-gallery-count">
                    {activeImage + 1} / {product.images.length}
                  </span>
                </>
              )}

              <button
                className="product-favorite"
                type="button"
                aria-label="Save product"
              >
                ♡
              </button>
            </div>

            {product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    className={
                      activeImage === index
                        ? 'product-thumb active-thumb'
                        : 'product-thumb'
                    }
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="product-info-section">
            <span className="product-category">{product.category}</span>

            <h1>{product.name}</h1>

            <div className="product-condition">
              <span>{product.condition}</span>
              <span>📍 {product.location}</span>
            </div>

            <div className="product-detail-price">
              KES {product.price.toLocaleString()}
            </div>

            <div className="seller-card">
              <div className="seller-avatar">
                {product.seller.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <span>Seller</span>
                <strong>{product.seller.name}</strong>
                {product.seller.verified && (
                  <small>✓ ComradeHub member</small>
                )}
              </div>
            </div>

            <div className="product-actions">
              {hasPhone ? (
                <>
                  <a
                    href={`tel:${phoneDigits}`}
                    className="buy-contact-btn"
                  >
                    📞 Call Seller
                  </a>

                  <a
                    href={`https://wa.me/${phoneDigits}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="product-whatsapp-btn"
                  >
                    💬 WhatsApp Seller
                  </a>
                </>
              ) : (
                <p className="no-contact">Contact details not provided.</p>
              )}

              {product.seller.email && (
                <a
                  href={`mailto:${product.seller.email}?subject=${encodeURIComponent(
                    `Enquiry about "${product.name}"`
                  )}`}
                  className="product-message-btn"
                >
                  ✉ Message Seller
                </a>
              )}
            </div>

            <div className="product-safety">
              <strong>🛡️ Buy Safely</strong>
              <p>
                Meet in a public place, inspect the product before paying and
                never share your PIN or password.
              </p>
            </div>
          </section>
        </div>

        <div className="product-bottom-grid">
          <section className="product-description-card">
            <h2>Product Description</h2>
            <p>{product.description}</p>

            {product.features.length > 0 && (
              <>
                <h2>Product Features</h2>
                <div className="product-features">
                  {product.features.map((feature) => (
                    <div key={feature}>✓ {feature}</div>
                  ))}
                </div>
              </>
            )}
          </section>

          <aside className="product-location-card">
            <h2>Seller Location</h2>
            <div className="product-map">
              📍
              <strong>{product.location}</strong>
              <span>Contact seller for exact location.</span>
            </div>
          </aside>
        </div>
      </main>

      <footer className="product-details-footer">
        <strong>ComradeHub</strong>
        <span>Everything Comrades Need, In One Place.</span>
      </footer>
    </div>
  );
}

export default ProductDetails;