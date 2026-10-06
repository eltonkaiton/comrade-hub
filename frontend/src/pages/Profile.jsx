import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const API_BASE_URL = 'http://localhost:5000/api';
const accountTypes = ['Comrade', 'Seller', 'Landlord', 'Motorist', 'Business'];

function getInitials(user) {
  return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'C';
}

function Profile({ startEditing = false }) {
  const { user, token, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(startEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [formData, setFormData] = useState(() => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    accountType: user?.accountType || 'Comrade',
  }));

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Comrade';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      accountType: user?.accountType || 'Comrade',
    });
    setError('');
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update your profile.');
      }

      updateUser(data.user);
      setIsEditing(false);
      setNotice('Your profile has been updated.');
    } catch (saveError) {
      setError(saveError.message || 'Unable to update your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <Link to="/" className="profile-brand" aria-label="ComradeHub home">
          <span className="profile-brand-mark">C</span>
          <span>Comrade<span>Hub</span></span>
        </Link>

        <p className="profile-nav-label">EXPLORE</p>
        <nav className="profile-main-nav" aria-label="Main navigation">
          <Link to="/">⌂ <span>Home</span></Link>
          <Link to="/marketplace">▦ <span>Marketplace</span></Link>
          <Link to="/houses">⌂ <span>Houses</span></Link>
          <Link to="/transport">↗ <span>Transport</span></Link>
          <Link to="/laundry">◌ <span>Laundry</span></Link>
          <Link to="/services">◇ <span>Services</span></Link>
          <Link to="/advertise">▧ <span>Advertise</span></Link>
        </nav>

        <div className="profile-sidebar-account">
          <div className="profile-avatar profile-avatar-small">{getInitials(user)}</div>
          <div className="profile-sidebar-user">
            <strong>{fullName}</strong>
            <span>{user?.accountType || 'Comrade'}</span>
          </div>
          <button type="button" onClick={logout} aria-label="Log out" title="Log out">
            ↪
          </button>
        </div>
      </aside>

      <main className="profile-workspace">
        <header className="profile-topbar">
          <div className="profile-breadcrumb"><Link to="/">Home</Link><span>/</span>My Profile</div>
          <Link className="profile-view-link" to="/">Back to ComradeHub <span>↗</span></Link>
        </header>

        <div className="profile-content">
          <div className="profile-heading">
            <div>
              <p className="profile-kicker">ACCOUNT SETTINGS</p>
              <h1>Profile Settings</h1>
              <p>Manage your account information and preferences.</p>
            </div>
            <span className="profile-status"><i /> Account active</span>
          </div>

          <div className="profile-layout">
            <nav className="profile-settings-nav" aria-label="Profile sections">
              <span>YOUR ACCOUNT</span>
              <a className="selected" href="#my-profile">My Profile</a>
              <a href="#personal-information">Personal information</a>
              <a href="#account-type">Account type</a>
            </nav>

            <div className="profile-panels">
              <section className="profile-panel" id="my-profile">
                <div className="profile-panel-heading">
                  <div>
                    <h2>My Profile</h2>
                    <p>Your ComradeHub account details</p>
                  </div>
                  {!isEditing && (
                    <button className="profile-edit-button" type="button" onClick={() => setIsEditing(true)}>
                      Edit <span aria-hidden="true">↗</span>
                    </button>
                  )}
                </div>
                <div className="profile-identity">
                  <div className="profile-avatar">{getInitials(user)}</div>
                  <div className="profile-identity-copy">
                    <strong>{fullName}</strong>
                    <span>{user?.email || 'No email added'}</span>
                    <span>{user?.phone || 'No phone number added'}</span>
                  </div>
                  <span className="profile-member-tag">{user?.accountType || 'Comrade'}</span>
                </div>
              </section>

              <form className="profile-form" onSubmit={handleSubmit}>
                <section className="profile-panel" id="personal-information">
                  <div className="profile-panel-heading">
                    <div>
                      <h2>Personal Information</h2>
                      <p>Contact details associated with your account</p>
                    </div>
                    {!isEditing && (
                      <button className="profile-edit-button" type="button" onClick={() => setIsEditing(true)}>
                        Edit <span aria-hidden="true">↗</span>
                      </button>
                    )}
                  </div>

                  <div className="profile-field-grid">
                    <label className="profile-field">
                      <span>First name</span>
                      <input name="firstName" value={formData.firstName} onChange={handleChange} readOnly={!isEditing} required />
                    </label>
                    <label className="profile-field">
                      <span>Last name</span>
                      <input name="lastName" value={formData.lastName} onChange={handleChange} readOnly={!isEditing} required />
                    </label>
                    <label className="profile-field">
                      <span>Email address</span>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} readOnly={!isEditing} required />
                    </label>
                    <label className="profile-field">
                      <span>Phone number</span>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleChange} readOnly={!isEditing} required />
                    </label>
                  </div>
                </section>

                <section className="profile-panel" id="account-type">
                  <div className="profile-panel-heading">
                    <div>
                      <h2>Account Type</h2>
                      <p>How you use ComradeHub</p>
                    </div>
                  </div>
                  <label className="profile-field profile-account-field">
                    <span>Account type</span>
                    <select name="accountType" value={formData.accountType} onChange={handleChange} disabled={!isEditing}>
                      {accountTypes.map((accountType) => <option key={accountType}>{accountType}</option>)}
                    </select>
                  </label>
                </section>

                {error && <p className="profile-message profile-error" role="alert">{error}</p>}
                {notice && <p className="profile-message profile-success" role="status">{notice}</p>}

                {isEditing && (
                  <div className="profile-form-actions">
                    <button className="profile-cancel-button" type="button" onClick={handleCancel} disabled={isSaving}>Cancel</button>
                    <button className="profile-save-button" type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;