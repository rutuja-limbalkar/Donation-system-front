import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ role = "admin" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Role-based navigation items
  const navItems = {
    admin: [
      { label: "Dashboard", icon: "⊞", path: "/admin/dashboard" },
      { label: "Donations", icon: "💳", path: "/admin/all-donations" },
      { label: "Gallery", icon: "🖼️", path: "/admin/gallery" },
      { label: "Pages", icon: "📄", path: "/admin/create-page" },
      { label: "Gaushala", icon: "🐄", path: "/admin/gaushala" },
      { label: "Udesh", icon: "🎯", path: "/admin/udesh" },
      { label: "Contact", icon: "📬", path: "/admin/contact" },
      {label:"Users", icon: "👥", path: "/admin/userlist"}
    ],
    manager: [
      { label: "Dashboard", icon: "⊞", path: "/admin/manager-dashboard" },
      { label: "Donations", icon: "💳", path: "/admin/all-donations" },
      { label: "Add Donation", icon: "🐄", path: "/admin/offline-donation" },
      { label: "Reports", icon: "📊", path: "/admin/manager-reports" },
    ],
    donor: [
      { label: "Dashboard", icon: "⊞", path: "/admin/donor-dashboard" },
      { label: "My Donations", icon: "💰", path: "/my-donations" },
      { label: "My Profile", icon: "🖼️", path: "/profile" },
      { label: "Contact", icon: "📬", path: "/admin/contact" },
    ],
  };

  const currentNav = navItems[role] || navItems.admin;

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoArea}>
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            {role === "admin" ? "⚙️" : role === "manager" ? "👔" : "❤️"}
          </div>
          <div>
            <div style={styles.logoText}>
              {role === "admin"
                ? "Jeevdaya Admin Panel"
                : role === "manager"
                ? "Manager Portal"
                : "Donor Portal"}
            </div>
            <div style={styles.roleTag}>{role.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav style={styles.nav}>
        {currentNav.map((item) => (
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

      {/* Logout at bottom */}
      <div style={styles.logoutArea}>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          ➜ Logout
        </button>
      </div>
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
  roleTag: {
    fontSize: "10px",
    color: "#fb923c",
    fontWeight: "600",
    letterSpacing: "0.5px",
    marginTop: "2px",
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
  logoutArea: {
    padding: "16px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  logoutBtn: {
    width: "100%",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default Sidebar;