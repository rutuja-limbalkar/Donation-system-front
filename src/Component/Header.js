import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // ✅ Fetch ACTIVE PAGES SAFELY
  useEffect(() => {
    fetch("http://localhost:8080/api/pages/active")
      .then((res) => {
        if (!res.ok) {
          throw new Error("API Error: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Active Pages API:", data);

        // ✅ SAFE ARRAY HANDLING
        if (Array.isArray(data)) {
          setPages(data);
        } else if (Array.isArray(data.data)) {
          setPages(data.data);
        } else if (Array.isArray(data.pages)) {
          setPages(data.pages);
        } else {
          setPages([]);
        }
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setPages([]);
      });
  }, []);

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

  {/* HOME */}
  <li className="nav-item">
    <Link className="nav-link text-light" to="/">
      मुख्य पृष्ठ
    </Link>
  </li>

  {/* ✅ STATIC LINKS */}
  <li className="nav-item">
    <Link className="nav-link text-light" to="/udesh">
      उद्देश्य
    </Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link text-light" to="/commite">
      समिति
    </Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link text-light" to="/donation">
      दान
    </Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link text-light" to="/gaushala-help">
      गौशाला सहायता
    </Link>
  </li>

  {/* 🔥 DYNAMIC CMS PAGES */}
  {Array.isArray(pages) &&
    pages.map((p) => (
      <li className="nav-item" key={p.id}>
        <Link className="nav-link text-light" to={`/pages/${p.slug}`}>
          {p.title}
        </Link>
      </li>
    ))}

  {/* OTHER STATIC */}
  <li className="nav-item">
    <Link className="nav-link text-light" to="/gallery">
      गैलरी
    </Link>
  </li>

  <li className="nav-item">
    <Link className="nav-link text-light" to="/contact">
      संपर्क
    </Link>
  </li>

</ul>
      </div>
    </nav>
  );
}

export default Header;