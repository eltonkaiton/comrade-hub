import React from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      change: "+12.5%",
      icon: "👥",
      type: "users",
    },
    {
      title: "Total Listings",
      value: "856",
      change: "+8.2%",
      icon: "📋",
      type: "listings",
    },
    {
      title: "Transport Posts",
      value: "184",
      change: "+5.4%",
      icon: "🚌",
      type: "transport",
    },
    {
      title: "Reports",
      value: "24",
      change: "-3.2%",
      icon: "🚨",
      type: "reports",
    },
  ];

  const recentListings = [
    {
      title: "Single Room Available",
      category: "Accommodation",
      user: "Brian Mwangi",
      location: "Meru",
      status: "Active",
      date: "Today",
    },
    {
      title: "Gas Cylinder 6KG",
      category: "Gas",
      user: "Kevin Maina",
      location: "Nairobi",
      status: "Active",
      date: "Today",
    },
    {
      title: "Meru - Nairobi Transport",
      category: "Transport",
      user: "David Kimani",
      location: "Meru",
      status: "Pending",
      date: "Yesterday",
    },
    {
      title: "Laptop for Sale",
      category: "Products",
      user: "Ann Wanjiku",
      location: "Nakuru",
      status: "Active",
      date: "Yesterday",
    },
    {
      title: "Laundry Services",
      category: "Services",
      user: "Mary Njeri",
      location: "Eldoret",
      status: "Active",
      date: "2 days ago",
    },
  ];

  const activities = [
    {
      icon: "👤",
      title: "New user registered",
      description: "Samuel joined ComradeHub",
      time: "10 minutes ago",
    },
    {
      icon: "🏠",
      title: "New listing posted",
      description: "Single room available in Meru",
      time: "25 minutes ago",
    },
    {
      icon: "🚌",
      title: "Transport listing added",
      description: "Meru to Nairobi transport",
      time: "1 hour ago",
    },
    {
      icon: "🚨",
      title: "Listing reported",
      description: "A listing requires your attention",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin. Here's what's happening on ComradeHub.</p>
        </div>

        <div className="header-actions">
          <button className="notification-btn">
            🔔
            <span className="notification-dot"></span>
          </button>

          <div className="admin-profile">
            <div className="profile-avatar">A</div>
            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>

            <div className={`stat-icon ${stat.type}`}>
              {stat.icon}
            </div>

            <div className="stat-content">
              <span>{stat.title}</span>
              <h2>{stat.value}</h2>

              <p
                className={
                  stat.change.startsWith("-")
                    ? "negative-change"
                    : "positive-change"
                }
              >
                {stat.change} <small>from last month</small>
              </p>
            </div>

          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="dashboard-grid">

        {/* Platform Activity */}
        <div className="dashboard-card activity-chart">

          <div className="card-header">
            <div>
              <h3>Platform Activity</h3>
              <p>User registrations and listings</p>
            </div>

            <select>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>

          <div className="chart">

            <div className="y-axis">
              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>

            <div className="chart-area">

              <div className="chart-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="bars">
                <div className="bar-group">
                  <div className="bar users-bar" style={{ height: "55%" }}></div>
                  <div className="bar listings-bar" style={{ height: "35%" }}></div>
                  <small>Mon</small>
                </div>

                <div className="bar-group">
                  <div className="bar users-bar" style={{ height: "70%" }}></div>
                  <div className="bar listings-bar" style={{ height: "45%" }}></div>
                  <small>Tue</small>
                </div>

                <div className="bar-group">
                  <div className="bar users-bar" style={{ height: "45%" }}></div>
                  <div className="bar listings-bar" style={{ height: "60%" }}></div>
                  <small>Wed</small>
                </div>

                <div className="bar-group">
                  <div className="bar users-bar" style={{ height: "80%" }}></div>
                  <div className="bar listings-bar" style={{ height: "50%" }}></div>
                  <small>Thu</small>
                </div>

                <div className="bar-group">
                  <div className="bar users-bar" style={{ height: "65%" }}></div>
                  <div className="bar listings-bar" style={{ height: "75%" }}></div>
                  <small>Fri</small>
                </div>

                <div className="bar-group">
                  <div className="bar users-bar" style={{ height: "90%" }}></div>
                  <div className="bar listings-bar" style={{ height: "65%" }}></div>
                  <small>Sat</small>
                </div>

                <div className="bar-group">
                  <div className="bar users-bar" style={{ height: "75%" }}></div>
                  <div className="bar listings-bar" style={{ height: "55%" }}></div>
                  <small>Sun</small>
                </div>
              </div>

            </div>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-users"></i>
              Users
            </span>

            <span>
              <i className="legend-listings"></i>
              Listings
            </span>
          </div>

        </div>

        {/* Categories */}
        <div className="dashboard-card categories-card">

          <div className="card-header">
            <div>
              <h3>Listings by Category</h3>
              <p>Current distribution</p>
            </div>
          </div>

          <div className="category-list">

            <div className="category-item">
              <div className="category-info">
                <span className="category-icon">🏠</span>
                <div>
                  <strong>Accommodation</strong>
                  <small>320 listings</small>
                </div>
              </div>

              <strong>37%</strong>
            </div>

            <div className="progress">
              <span style={{ width: "37%" }}></span>
            </div>


            <div className="category-item">
              <div className="category-info">
                <span className="category-icon">🚌</span>
                <div>
                  <strong>Transport</strong>
                  <small>184 listings</small>
                </div>
              </div>

              <strong>21%</strong>
            </div>

            <div className="progress">
              <span style={{ width: "21%" }}></span>
            </div>


            <div className="category-item">
              <div className="category-info">
                <span className="category-icon">🔥</span>
                <div>
                  <strong>Gas & Cooking</strong>
                  <small>126 listings</small>
                </div>
              </div>

              <strong>15%</strong>
            </div>

            <div className="progress">
              <span style={{ width: "15%" }}></span>
            </div>


            <div className="category-item">
              <div className="category-info">
                <span className="category-icon">🛒</span>
                <div>
                  <strong>Products</strong>
                  <small>142 listings</small>
                </div>
              </div>

              <strong>17%</strong>
            </div>

            <div className="progress">
              <span style={{ width: "17%" }}></span>
            </div>


            <div className="category-item">
              <div className="category-info">
                <span className="category-icon">💼</span>
                <div>
                  <strong>Services</strong>
                  <small>84 listings</small>
                </div>
              </div>

              <strong>10%</strong>
            </div>

            <div className="progress">
              <span style={{ width: "10%" }}></span>
            </div>

          </div>

        </div>

      </div>


      {/* Recent Listings */}
      <div className="dashboard-card recent-listings">

        <div className="card-header">

          <div>
            <h3>Recent Listings</h3>
            <p>Latest listings posted on ComradeHub</p>
          </div>

          <button className="view-all-btn">
            View All
          </button>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Listing</th>
                <th>Category</th>
                <th>User</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {recentListings.map((listing, index) => (

                <tr key={index}>

                  <td>
                    <strong>{listing.title}</strong>
                  </td>

                  <td>
                    <span className="category-badge">
                      {listing.category}
                    </span>
                  </td>

                  <td>{listing.user}</td>

                  <td>{listing.location}</td>

                  <td>
                    <span
                      className={
                        listing.status === "Active"
                          ? "status active"
                          : "status pending"
                      }
                    >
                      {listing.status}
                    </span>
                  </td>

                  <td>{listing.date}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* Bottom Section */}
      <div className="bottom-grid">

        {/* Recent Activity */}
        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Latest platform activity</p>
            </div>

            <button className="view-all-btn">
              View All
            </button>
          </div>

          <div className="activity-list">

            {activities.map((activity, index) => (

              <div className="activity-item" key={index}>

                <div className="activity-icon">
                  {activity.icon}
                </div>

                <div className="activity-details">
                  <strong>{activity.title}</strong>
                  <p>{activity.description}</p>
                  <small>{activity.time}</small>
                </div>

              </div>

            ))}

          </div>

        </div>


        {/* Admin Actions */}
        <div className="dashboard-card quick-actions">

          <div className="card-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Manage your platform</p>
            </div>
          </div>

          <button>
            <span>👥</span>
            Manage Users
            <b>→</b>
          </button>

          <button>
            <span>📋</span>
            Manage Listings
            <b>→</b>
          </button>

          <button>
            <span>🚨</span>
            Review Reports
            <b>→</b>
          </button>

          <button>
            <span>⚙️</span>
            Platform Settings
            <b>→</b>
          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;