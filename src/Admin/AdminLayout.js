import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current user role from localStorage
  const userRole = localStorage.getItem("role") || "admin"; // "admin", "manager", "donor"

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const breadParts = location.pathname.replace("/admin/", "").split("/");

  return (
    <div style={styles.wrapper}>
      <Sidebar role={userRole} />

      <div style={styles.main}>
        {/* TOP BAR */}
        <div style={styles.topbar}>
          <div style={styles.breadcrumb}>
            <span>🏠</span>
            <span style={styles.sep}>/</span>
            {breadParts.map((part, i) => (
              <span
                key={i}
                style={i === breadParts.length - 1 ? styles.currentCrumb : styles.crumb}
              >
                {i > 0 && <span style={styles.sep}>/</span>}
                {part.charAt(0).toUpperCase() + part.slice(1)}
              </span>
            ))}
          </div>

          {/* LOGOUT TOP RIGHT */}
          <button style={styles.logoutBtn} onClick={handleLogout}>
            ➜ Logout
          </button>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f0f4f8",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topbar: {
    background: "linear-gradient(90deg, #1565c0, #1976d2)",
    padding: "0 24px",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.85)",
  },
  sep: { color: "rgba(255,255,255,0.4)", margin: "0 2px" },
  crumb: { color: "rgba(255,255,255,0.65)" },
  currentCrumb: { color: "white", fontWeight: "600" },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    padding: "7px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },
  content: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
  },
};

export default AdminLayout;