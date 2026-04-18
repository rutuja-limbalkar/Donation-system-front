import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

function Header() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check login status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("jwtToken");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userStr));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  // Fetch active pages for dynamic menu
  useEffect(() => {
    fetch("http://localhost:8080/api/pages/active")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPages(data);
        else if (Array.isArray(data.data)) setPages(data.data);
        else if (Array.isArray(data.pages)) setPages(data.pages);
        else setPages([]);
      })
      .catch(() => setPages([]));
  }, []);

  // Check if user is Admin or Manager (for future use, but we hide Admin Panel link)
  const isAdminOrManager = user?.roles?.some(role => 
    role === "ROLE_ADMIN" || role === "ROLE_MANAGER"
  );

  return (
    <nav className="navbar navbar-expand-md header">
      <Row>
        <Col xs={2}>
          <button className="navbar-toggler" type="button">
            <div className="navbar-toggler-icon mb-2" style={{ backgroundColor: "#fff", height: 2 }}></div>
            <div className="navbar-toggler-icon mb-2" style={{ backgroundColor: "#fff", height: 2 }}></div>
            <div className="navbar-toggler-icon" style={{ backgroundColor: "#fff", height: 2 }}></div>
          </button>
        </Col>

        <Col md={12} xs={10}>
          <Link className="navbar-brand text-light websitename" to="/">
            <b>श्री आचार्य विद्यासागर जीवदया ट्रस्ट</b>
          </Link>
        </Col>
      </Row>

      <div className="collapse navbar-collapse" style={{ zIndex: 999, backgroundColor: "#fd7e14" }}>
        <ul className="navbar-nav ml-auto">

          <li className="nav-item">
            <Link className="nav-link text-light" to="/">मुख्य पृष्ठ</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light" to="/udesh">उद्देश्य</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light" to="/commite">समिति</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light" to="/donation">दान</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light" to="/gaushala-help">गौशाला सहायता</Link>
          </li>

          {/* Dynamic Pages */}
          {Array.isArray(pages) && pages.map((p) => (
            <li className="nav-item" key={p.id}>
              <Link className="nav-link text-light" to={`/pages/${p.slug}`}>
                {p.title}
              </Link>
            </li>
          ))}

          <li className="nav-item">
            <Link className="nav-link text-light" to="/gallery">गैलरी</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light" to="/contact">संपर्क</Link>
          </li>

          {/* ====================== AUTH LINKS ====================== */}
          {!isLoggedIn ? (
            <li className="nav-item">
              <Link className="nav-link text-light" to="/login">Login</Link>
            </li>
          ) : (
            <>
              {/* Removed "Admin Panel" button - No longer needed */}
              {/* 
              {isAdminOrManager && (
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/admin/dashboard">
                    Admin Panel
                  </Link>
                </li>
              )}
              */}

              <li className="nav-item">
                <button 
                  onClick={handleLogout}
                  className="nav-link text-light btn-logout"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px' }}
                >
                  Logout ({user?.name || 'User'})
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;