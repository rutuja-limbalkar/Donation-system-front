import React,{useState} from 'react'
import {Row, Col } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

function Header() {
  let history = useHistory();

  const logout = () => {
    sessionStorage.clear();
    history.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-md header">
      <Row>
        <Col xs={2}>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <div className="navbar-toggler-icon mb-2" style={{backgroundColor: "#fff",height: 2,display:"block"}}></div>
          <div className="navbar-toggler-icon mb-2" style={{backgroundColor: "#fff",height: 2,display:"block"}}></div>
          <div className="navbar-toggler-icon" style={{backgroundColor: "#fff",height: 2,display:"block"}}></div>
      </button>
      </Col>
        <Col md={12} xs={10}><a className="navbar-brand text-light websitename" href="/" ><b style={{textSize:"10px"}}>श्री आचार्य विद्यासागर जीवदया ट्रस्ट</b></a></Col>
      </Row>
      <div className="collapse navbar-collapse" id="navbarCollapse" style={{zIndex:999,backgroundColor:'#fd7e14'}}>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <a className="nav-link text-light" href="/" >मुख्य पृष्ठ</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-light" href="/Udesh">उद्देश</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-light" href="/Cometee">कमेटी</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-light" href="/Donation">ऑनलाइन दान</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-light" href="/Help">गौ शाला मदत</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-light" href="/Gallary">गैलरी</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-light" href="/Contact">संपर्क</a>
          </li>
          
          {sessionStorage.id?<li className="nav-item dropdown"  >
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false">
                   {sessionStorage.name}
                  </a>
                  <ul className="dropdown-menu" style={{backgroundColor:'#fd7e14'}}>
                    <li><a className="dropdown-item" href="/Profile" style={{color:"#000000"}}>Profile</a></li>
                    <li><a className="dropdown-item" href="/DonationHistory"  style={{color:"#000000"}}>Donation History</a></li>
                    <li><hr className="dropdown-divider"/></li>
                    <li><a className="dropdown-item" onClick={logout}  style={{color:"#000000"}}>Logout</a></li>
                  </ul>
                </li>: <li className="nav-item">
                  <a className="nav-link text-light" href="/login">Login</a>
                </li>}
          
        </ul>
      </div>
    </nav>
  )
}

export default Header
