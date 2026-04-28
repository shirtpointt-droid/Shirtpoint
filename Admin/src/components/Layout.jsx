import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import '../css/Layout.css'

function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">⚙️ Admin Panel</div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <span className="sidebar-icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/home" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <span className="sidebar-icon">🏠</span> Home
          </NavLink>
          <NavLink to="/user-home" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <span className="sidebar-icon">👤</span> User Home
          </NavLink>
          <NavLink to="/design-lab" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <span className="sidebar-icon">🎨</span> Design Lab
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
