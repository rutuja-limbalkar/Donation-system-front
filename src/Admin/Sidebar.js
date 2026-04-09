import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: "⊞", path: "/admin/dashboard" },
  
  { label: "Donations", icon: "💳", path: "/admin/donations" },
  
  { label: "Gallary", icon: "🖼️", path: "/admin/gallery" },
  { label: "Pages", icon: "📄", path: "/admin/pages" },
   { label: "Gaushala", icon: "🐄", path: "/admin/gaushala" },
  { label: "Udesh", icon: "🎯", path: "/admin/udesh" },
  { label: "Contact", icon: "📬", path: "/admin/contact" },

];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>

      <div style={styles.logoArea}>
        <div style={styles.logoRow}>
          {/* ✅ Changed the Icon and the Gradient Background */}
          <div style={styles.logoIcon}>⚙️</div>
          <div>
            <div style={styles.logoText}>Jeevdaya Admin Panel</div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    background: "linear-gradient(180deg, #1e3a5f 0%, #0f2544 100%)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
  },
  logoArea: {
    padding: "18px 16px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #f97316, #ef4444)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },
  logoText: {
    color: "white",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "1.3",
  },
  nav: {
    flex: 1,
    padding: "10px 8px",
    overflowY: "auto",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "8px",
    color: "rgba(255,255,255,0.6)",
    fontSize: "13.5px",
    marginBottom: "2px",
    textDecoration: "none",
    transition: "all 0.15s",
    borderLeft: "3px solid transparent",
  },
  navItemActive: {
    background: "rgba(249,115,22,0.15)",
    color: "#fb923c",
    borderLeft: "3px solid #f97316",
  },
  navIcon: {
    fontSize: "16px",
    width: "20px",
    textAlign: "center",
  },
};

export default Sidebar;