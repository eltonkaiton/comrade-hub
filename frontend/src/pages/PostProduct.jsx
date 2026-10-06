import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./PostProduct.css";

const API_BASE_URL = "http://localhost:5000/api";

function PostProduct() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    category: "",
    condition: "",
    price: "",
    location: "",
    description: "",
    phone: user?.phone || "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Safety net (ProtectedRoute already prevents this)
    if (!token) {
      alert("Please log in to post a product");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      images.forEach((img) => data.append("images", img));

      const res = await axios.post(`${API_BASE_URL}/products`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message || "Product listing created successfully!");
      navigate("/marketplace");
    } catch (error) {
      console.error(error);

      // Handle expired / invalid token
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }

      const msg =
        error.response?.data?.errors?.join("\n") ||
        error.response?.data?.message ||
        "Failed to create listing";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-product-page">
      <nav className="post-product-nav">
        <Link to="/" className="post-product-logo">
          🎓 Comrade<span>Hub</span>
        </Link>
        <Link to="/marketplace" className="product-back-link">
          ← Back to Marketplace
        </Link>
      </nav>

      <main className="post-product-container">
        <div className="product-form-heading">
          <span>🛍️</span>
          <div>
            <h1>Sell Something</h1>
            <p>
              Posting as <strong>{user?.name || user?.firstName || user?.email}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <section className="product-form-section">
            <h2>Product Information</h2>
            <div className="product-form-grid">
              <div className="product-form-group full">
                <label>Product Name *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Samsung Galaxy A15"
                  required
                />
              </div>

              <div className="product-form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select category</option>
                  <option>Phones</option>
                  <option>Laptops</option>
                  <option>Fashion</option>
                  <option>Furniture</option>
                  <option>Books</option>
                  <option>Electronics</option>
                  <option>Food</option>
                  <option>Sports</option>
                  <option>Cooking Appliances</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="product-form-group">
                <label>Condition *</label>
                <select name="condition" value={form.condition} onChange={handleChange} required>
                  <option value="">Select condition</option>
                  <option>New</option>
                  <option>Like New</option>
                  <option>Used</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>

              <div className="product-form-group">
                <label>Price (KES) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="18500"
                  min="0"
                  required
                />
              </div>

              <div className="product-form-group">
                <label>Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Nairobi"
                  required
                />
              </div>
            </div>
          </section>

          <section className="product-form-section">
            <h2>Description</h2>
            <div className="product-form-group">
              <label>Product Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="7"
                placeholder="Describe your item honestly. Include important specifications, condition and anything the buyer should know."
                required
              />
            </div>
          </section>

          <section className="product-form-section">
            <h2>Product Photos</h2>
            <div className="product-upload">
              <div className="product-upload-icon">📷</div>
              <h3>Add Product Photos</h3>
              <p>Clear photos help buyers understand what you are selling.</p>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            </div>
          </section>

          <section className="product-form-section">
            <h2>Contact Information</h2>
            <div className="product-form-group">
              <label>Phone Number *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+254 7XX XXX XXX"
                required
              />
            </div>
          </section>

          <div className="product-form-actions">
            <button
              type="button"
              className="product-cancel-btn"
              onClick={() => navigate("/marketplace")}
            >
              Cancel
            </button>

            <button type="submit" className="product-submit-btn" disabled={loading}>
              {loading ? "Publishing..." : "Publish Product →"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default PostProduct;