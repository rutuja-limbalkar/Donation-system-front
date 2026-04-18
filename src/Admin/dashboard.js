import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "donor"; // "admin", "manager", "donor"

  const [counts, setCounts] = useState({ pages: 0, messages: 0, gaushala: 0, donations: 0 });

  useEffect(() => {
    // Common fetches
    fetch("http://localhost:8080/api/pages")
      .then(r => r.json()).then(d => setCounts(prev => ({ ...prev, pages: Array.isArray(d) ? d.length : 0 })))
      .catch(() => {});

    fetch("http://localhost:8080/api/contact/all")
      .then(r => r.json()).then(d => setCounts(prev => ({ ...prev, messages: Array.isArray(d) ? d.length : 0 })))
      .catch(() => {});

    // Role-specific fetches
    if (role === "admin" || role === "manager") {
      fetch("http://localhost:8080/api/gaushala")
        .then(r => r.json()).then(d => setCounts(prev => ({ ...prev, gaushala: Array.isArray(d) ? d.length : 0 })))
        .catch(() => {});
    }
  }, [role]);

  // Role-based menu cards
  const menuCards = {
    admin: [
      { label: "Users", icon: "👤", path: "/admin/users", color: "#3b82f6", bg: "#eff6ff", desc: "Manage all users" },
      { label: "Donations", icon: "💳", path: "/admin/donations", color: "#8b5cf6", bg: "#f5f3ff", desc: "View all donations" },
      { label: "Donation Type", icon: "🏷️", path: "/admin/donation-type", color: "#f59e0b", bg: "#fffbeb", desc: "Manage donation types" },
      { label: "Gallery", icon: "🖼️", path: "/admin/gallery", color: "#06b6d4", bg: "#ecfeff", desc: "Upload & manage gallery" },
      { label: "Pages", icon: "📄", path: "/admin/pages", color: "#6366f1", bg: "#eef2ff", desc: "Manage CMS pages" },
      { label: "Reports", icon: "📊", path: "/admin/reports", color: "#10b981", bg: "#ecfdf5", desc: "View reports" },
      { label: "Gaushala", icon: "🐄", path: "/admin/gaushala", color: "#f97316", bg: "#fff7ed", desc: "Gaushala help records" },
      { label: "Udesh", icon: "🎯", path: "/admin/udesh", color: "#ef4444", bg: "#fef2f2", desc: "Manage objectives" },
      { label: "Contact", icon: "📬", path: "/admin/contact", color: "#14b8a6", bg: "#f0fdfa", desc: "Contact messages" },
    ],
    manager: [
      { label: "Donations", icon: "💳", path: "/admin/donations", color: "#8b5cf6", bg: "#f5f3ff", desc: "View donations" },
      { label: "Gaushala", icon: "🐄", path: "/admin/gaushala", color: "#f97316", bg: "#fff7ed", desc: "Gaushala records" },
      { label: "Reports", icon: "📊", path: "/admin/reports", color: "#10b981", bg: "#ecfdf5", desc: "Generate reports" },
      { label: "Contact", icon: "📬", path: "/admin/contact", color: "#14b8a6", bg: "#f0fdfa", desc: "View messages" },
    ],
    donor: [
      { label: "My Donations", icon: "💰", path: "/admin/my-donations", color: "#3b82f6", bg: "#eff6ff", desc: "View your donations" },
      { label: "Gallery", icon: "🖼️", path: "/admin/gallery", color: "#06b6d4", bg: "#ecfeff", desc: "View gallery" },
      { label: "Contact", icon: "📬", path: "/admin/contact", color: "#14b8a6", bg: "#f0fdfa", desc: "Send message" },
    ]
  };

  const currentCards = menuCards[role] || menuCards.donor;

  return (
    <div>
      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <div>
          <h2 style={styles.welcomeTitle}>
            Welcome to Jeevdaya {role === "admin" ? "Admin Panel" : role === "manager" ? "Manager Portal" : "Donor Portal"} 🐄
          </h2>
          <p style={styles.welcomeSub}>
            {role === "admin" 
              ? "Manage your website content, donations, gallery and more."
              : role === "manager"
              ? "Manage donations, gaushala records and generate reports."
              : "View your donations and stay updated with our activities."}
          </p>
        </div>
        <div style={styles.welcomeIcon}>
          {role === "admin" ? "⚙️" : role === "manager" ? "👔" : "❤️"}
        </div>
      </div>

      {/* Stat Cards - Simple version */}
      <div style={styles.statsRow}>
        {role !== "donor" && (
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#eff6ff" }}>📄</div>
            <div>
              <div style={styles.statLabel}>Total Pages</div>
              <div style={{ ...styles.statNum, color: "#3b82f6" }}>{counts.pages}</div>
            </div>
          </div>
        )}
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#f0fdfa" }}>📬</div>
          <div>
            <div style={styles.statLabel}>Messages</div>
            <div style={{ ...styles.statNum, color: "#14b8a6" }}>{counts.messages}</div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div style={styles.sectionTitle}>Quick Access</div>
      <div style={styles.grid}>
        {currentCards.map((item) => (
          <div
            key={item.path}
            style={styles.menuCard}
            onClick={() => navigate(item.path)}
          >
            <div style={{ ...styles.menuIcon, background: item.bg, color: item.color }}>
              {item.icon}
            </div>
            <div style={{ ...styles.menuLabel, color: item.color }}>{item.label}</div>
            <div style={styles.menuDesc}>{item.desc}</div>
            <div style={{ ...styles.menuArrow, color: item.color }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  welcomeCard: {
    background: "linear-gradient(135deg, #1e3a5f, #1976d2)",
    borderRadius: "14px",
    padding: "24px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    boxShadow: "0 4px 16px rgba(25,118,210,0.25)",
  },
  welcomeTitle: { color: "white", fontSize: "18px", fontWeight: "700", margin: 0 },
  welcomeSub: { color: "rgba(255,255,255,0.7)", fontSize: "13px", marginTop: "6px" },
  welcomeIcon: { fontSize: "48px", opacity: 0.4 },

  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginBottom: "24px" },
  statCard: {
    background: "white", borderRadius: "12px", padding: "18px 20px",
    display: "flex", alignItems: "center", gap: "16px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9"
  },
  statIcon: { width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" },
  statLabel: { fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" },
  statNum: { fontSize: "28px", fontWeight: "700" },

  sectionTitle: { fontSize: "13px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" },
  menuCard: {
    background: "white", borderRadius: "12px", padding: "20px", cursor: "pointer",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9",
    transition: "transform 0.2s", position: "relative"
  },
  menuIcon: { width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "12px" },
  menuLabel: { fontSize: "15px", fontWeight: "700", marginBottom: "4px" },
  menuDesc: { fontSize: "12px", color: "#94a3b8" },
  menuArrow: { position: "absolute", top: "20px", right: "20px", fontSize: "16px", fontWeight: "700" }
};

export default Dashboard;