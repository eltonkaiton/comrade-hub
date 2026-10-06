import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ProtectedRoute from '../components/ProtectedRoute';

// =====================================================
// HOME PAGE
// =====================================================
import Home from './pages/Home';

// =====================================================
// AUTHENTICATION
// =====================================================
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';

// =====================================================
// MAIN PAGES
// =====================================================
import Marketplace from './pages/Marketplace';
import Houses from './pages/Houses';
import Transport from './pages/Transport';
import Laundry from './pages/Laundry';
import Services from './pages/Services';
import Advertise from './pages/Advertise';

// =====================================================
// MARKETPLACE DETAILS & POSTING
// =====================================================
import ProductDetails from './pages/ProductDetails';
import PostProduct from './pages/PostProduct';

// =====================================================
// HOUSE DETAILS & POSTING
// =====================================================
import HouseDetails from './pages/HouseDetails';
import PostHouse from './pages/PostHouse';

// =====================================================
// TRANSPORT DETAILS & POSTING
// =====================================================
import TransportDetails from './pages/TransportDetails';
import PostTransport from './pages/PostTransport';

// =====================================================
// LAUNDRY DETAILS & POSTING
// =====================================================
import LaundryDetails from './pages/LaundryDetails';
import PostLaundry from './pages/PostLaundry';

// =====================================================
// ADVERTISEMENT
// =====================================================
import CreateAdvertisement from './pages/CreateAdvertisement';

// =====================================================
// SUPPORT
// =====================================================
import Contact from './pages/Contact';
import Help from './pages/Help';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// =====================================================
// SIMPLE PAGE
// =====================================================
function SimplePage({ title, description, icon = '🚀' }) {
  return (
    <div className="simple-page">
      <div className="simple-page-card">
        <div className="simple-page-icon">{icon}</div>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link to="/" className="primary-btn">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

// =====================================================
// APP ROUTER
// =====================================================
function App() {
  return (
    <Routes>
      {/* =====================================================
          HOME
      ===================================================== */}
      <Route path="/" element={<Home />} />

      {/* =====================================================
          AUTHENTICATION
      ===================================================== */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/forgot-password"
        element={
          <SimplePage
            icon="🔑"
            title="Forgot Password"
            description="Password recovery will be implemented when we connect the authentication backend."
          />
        }
      />

      {/* =====================================================
          MARKETPLACE
          ⚠️ Static routes (/marketplace/post) MUST come before
             dynamic routes (/marketplace/product/:id)
      ===================================================== */}
      <Route path="/marketplace" element={<Marketplace />} />
      <Route
        path="/marketplace/post"
        element={
          <ProtectedRoute>
            <PostProduct />
          </ProtectedRoute>
        }
      />
      <Route path="/marketplace/product/:id" element={<ProductDetails />} />

      {/* =====================================================
          HOUSES
          ⚠️ /houses/post MUST come before /houses/:id
      ===================================================== */}
      <Route path="/houses" element={<Houses />} />
      <Route
        path="/houses/post"
        element={
          <ProtectedRoute>
            <PostHouse />
          </ProtectedRoute>
        }
      />
      <Route path="/houses/:id" element={<HouseDetails />} />

      {/* =====================================================
          TRANSPORT
          ⚠️ /transport/post MUST come before /transport/:id
      ===================================================== */}
      <Route path="/transport" element={<Transport />} />
      <Route
        path="/transport/post"
        element={
          <ProtectedRoute>
            <PostTransport />
          </ProtectedRoute>
        }
      />
      <Route path="/transport/:id" element={<TransportDetails />} />

      {/* =====================================================
          LAUNDRY
          /laundry/post MUST come before /laundry/:id
      ===================================================== */}
      <Route path="/laundry" element={<Laundry />} />
      <Route
        path="/laundry/post"
        element={
          <ProtectedRoute>
            <PostLaundry />
          </ProtectedRoute>
        }
      />
      <Route path="/laundry/:id" element={<LaundryDetails />} />

      {/* =====================================================
          SERVICES
      ===================================================== */}
      <Route path="/services" element={<Services />} />
      <Route
        path="/services/post"
        element={
          <SimplePage
            icon="💼"
            title="List Your Business"
            description="Business and service provider registration will be connected here."
          />
        }
      />
      <Route
        path="/services/:id"
        element={
          <SimplePage
            icon="🏪"
            title="Service Details"
            description="Service details will be connected here."
          />
        }
      />

      {/* =====================================================
          ADVERTISE
      ===================================================== */}
      <Route path="/advertise" element={<Advertise />} />
      <Route path="/advertise/create" element={<CreateAdvertisement />} />

      {/* =====================================================
          I NEED / REQUESTS
      ===================================================== */}
      <Route
        path="/requests"
        element={
          <SimplePage
            icon="🔎"
            title="I Need..."
            description="Post what you are looking for and allow sellers and service providers to find you."
          />
        }
      />
      <Route
        path="/requests/create"
        element={
          <SimplePage
            icon="📝"
            title="Post a Request"
            description="Tell the ComradeHub community what you need."
          />
        }
      />
      <Route
        path="/requests/:id"
        element={
          <SimplePage
            icon="🔍"
            title="Request Details"
            description="Request details and responses will appear here."
          />
        }
      />

      {/* =====================================================
          USER ACCOUNT
      ===================================================== */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <Profile startEditing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <SimplePage
            icon="💬"
            title="Messages"
            description="Your conversations with sellers, landlords, motorists and service providers will appear here."
          />
        }
      />
      <Route
        path="/notifications"
        element={
          <SimplePage
            icon="🔔"
            title="Notifications"
            description="Your ComradeHub notifications will appear here."
          />
        }
      />

      {/* =====================================================
          SUPPORT
      ===================================================== */}
      <Route path="/help" element={<Help />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* =====================================================
          404
      ===================================================== */}
      <Route
        path="*"
        element={
          <SimplePage
            icon="🔍"
            title="Page Not Found"
            description="Sorry, the page you are looking for does not exist."
          />
        }
      />
    </Routes>
  );
}

export default App;