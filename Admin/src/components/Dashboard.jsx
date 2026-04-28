import React from 'react'
import '../css/AdminHome.css'

function Dashboard() {
  return (
    <div>
      <h1 className="admin-home-title">Dashboard 📊</h1>
      <div className="admin-home-grid">
        <div className="admin-stat-card blue">
          <p className="admin-stat-label">Total Products</p>
          <p className="admin-stat-value">0</p>
        </div>
        <div className="admin-stat-card green">
          <p className="admin-stat-label">Total Orders</p>
          <p className="admin-stat-value">0</p>
        </div>
        <div className="admin-stat-card yellow">
          <p className="admin-stat-label">Total Users</p>
          <p className="admin-stat-value">0</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
