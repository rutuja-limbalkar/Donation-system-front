import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHead from '../Component/pageHead';
import PageBody from '../Component/pageBody'; 
import { Form, Card, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';

const donationTypes = [
  { id: 1, name: "Monthly Donation", icon: "🗓️", desc: "Support us every month" },
  { id: 2, name: "Birthday Donation", icon: "🎂", desc: "Celebrate with a cause" },
  { id: 3, name: "Anniversary Donation", icon: "💍", desc: "Share your milestone" },
  { id: 4, name: "Gaushala Donation", icon: "🐄", desc: "Help our cow shelter" },
  { id: 5, name: "General Donation", icon: "🙏", desc: "Support where it's needed" },
];

function Donation() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const markup = {
    __html: '<p>आप यहाँ से सीधे दान कर सकते हैं | संपर्क: ०८९८३ ७८३ ७८३</p>',
  };

  // Helper to load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const savedCard = localStorage.getItem("pendingDonation");

    if (token) {
      setIsLoggedIn(true);
      if (savedCard) {
        const parsedCard = JSON.parse(savedCard);
        setSelectedCard(parsedCard);
      }
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '', email: '', mobile: '', adharCard: '',
      panNumber: '', address: '', product_id: '', donation_amount: '',
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Required";
      if (!values.email) errors.email = "Required";
      if (!values.donation_amount || values.donation_amount < 10) errors.donation_amount = "Min ₹10";
      return errors;
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) return alert("Razorpay SDK failed to load.");

        // 1. Create Order on Backend
        const orderRes = await fetch(`http://localhost:8080/payment/create-order?amount=${values.donation_amount}`, { 
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        const order = JSON.parse(await orderRes.text());

        const options = {
          key: "rzp_test_SahHHcqfDLxNc9",
          amount: parseFloat(values.donation_amount) * 100,
          currency: "INR",
          name: "Jevdaya",
          order_id: order.id,
          handler: async function (response) {
            const verifyPayload = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              customerName: values.name,
              customerEmail: values.email,
              customerContact: values.mobile,
              adharCard: values.adharCard,
              panNumber: values.panNumber,
              address: values.address,
              amount: values.donation_amount,
              productId: selectedCard.id
            };

            // 2. Verify and SAVE to Database
            const verifyRes = await fetch("http://localhost:8080/payment/verify", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
              },
              body: JSON.stringify(verifyPayload)
            });

            if (verifyRes.ok) {
              setSuccessMessage("✅ Donation Recorded in Database!");
              localStorage.removeItem("pendingDonation");
              formik.resetForm();
              setSelectedCard(null);
            } else {
              alert("Payment verified but Database failed to save.");
            }
          },
          prefill: { name: values.name, email: values.email, contact: values.mobile },
          theme: { color: "#fd7e14" }
        };
        new window.Razorpay(options).open();
      } catch (e) {
        console.error("Payment Error:", e);
        alert("Failed to connect to server.");
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  // Sync Formik product_id whenever selectedCard changes
  useEffect(() => {
    if (selectedCard) {
      formik.setFieldValue('product_id', selectedCard.id);
    }
  }, [selectedCard]);

  const handleCardClick = (type) => {
    localStorage.setItem('pendingDonation', JSON.stringify(type));
    localStorage.setItem('redirectAfterLogin', '/donation');
    
    if (localStorage.getItem("jwtToken")) {
      setSelectedCard(type);
      setIsLoggedIn(true);
    } else {
      navigate('/login');
    }
  };

  // ==================== UPDATED INPUT RESTRICTIONS ====================
  const handleRestrictedChange = (e, fieldName, maxLength, regex) => {
    let value = e.target.value;

    // 1. Aadhaar: Digits only and limit to 12
    if (fieldName === 'adharCard') {
      value = value.replace(/[^0-9]/g, ''); // Ensure only digits
      if (value.length <= 12) {
        formik.setFieldValue(fieldName, value);
      }
      return;
    }

    // 2. PAN: UpperCase automatically and limit to 10
    if (fieldName === 'panNumber') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Upper and Alphanumeric
      if (value.length <= 10) {
        formik.setFieldValue(fieldName, value);
      }
      return;
    }

    // Default behavior for other fields (like Name)
    if (regex) value = value.replace(regex, '');
    if (maxLength) value = value.slice(0, maxLength);
    formik.setFieldValue(fieldName, value);
  };

  // ==================== UPDATED INPUT FIELDS IN RENDER ====================
  // Ensure these are inside your Form return section:
  <div className="row g-3">
    <Input label="Full Name *" name="name" placeholder="Full Name" formik={formik} full onChange={(e) => handleRestrictedChange(e, 'name', 50, /[^A-Za-z\s]/g)} />
    <Input label="Email *" name="email" placeholder="Email" formik={formik} />
    <Input label="Mobile *" name="mobile" placeholder="Mobile" formik={formik} onChange={(e) => handleRestrictedChange(e, 'mobile', 10, /[^0-9]/g)} />
    
    {/* Aadhaar Input with 12-digit restriction */}
    <Input label="Aadhar *" name="adharCard" placeholder="12-digit Aadhar" formik={formik} onChange={(e) => handleRestrictedChange(e, 'adharCard')} />
    
    {/* PAN Input with Uppercase restriction */}
    <Input label="PAN *" name="panNumber" placeholder="PAN Number" formik={formik} onChange={(e) => handleRestrictedChange(e, 'panNumber')} />
    
    <Input full label="Address *" name="address" placeholder="Address" formik={formik} />
  </div>
  return (
    <>
      <PageHead title="ऑनलाइन दान" />
      <div className="container mt-4" style={{ maxWidth: "1100px" }}>
        <PageBody data={markup} />
        <hr />

        {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

        {isLoggedIn && selectedCard ? (
          <Form onSubmit={formik.handleSubmit}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>Donor Details for: <span className="text-primary">{selectedCard.name}</span></h4>
              <button 
                type="button"
                className="btn btn-outline-secondary btn-sm" 
                onClick={() => {
                  localStorage.removeItem("pendingDonation");
                  setSelectedCard(null);
                }}
              >
                Change Category
              </button>
            </div>

            <div className="row g-3">
              <Input label="Full Name *" name="name" placeholder="Full Name" formik={formik} full onChange={(e) => handleRestrictedChange(e, 'name', 50, /[^A-Za-z\s]/g)} />
              <Input label="Email *" name="email" placeholder="Email" formik={formik} />
              <Input label="Mobile *" name="mobile" placeholder="Mobile" formik={formik} onChange={(e) => handleRestrictedChange(e, 'mobile', 10, /[^0-9]/g)} />
              <Input label="Aadhar *" name="adharCard" placeholder="12-digit Aadhar" formik={formik} onChange={(e) => handleRestrictedChange(e, 'adharCard', 12, /[^0-9]/g)} />
              <Input label="PAN *" name="panNumber" placeholder="PAN Number" formik={formik} onChange={(e) => handleRestrictedChange(e, 'panNumber', 10, /[^A-Z0-9]/gi)} />
              <Input full label="Address *" name="address" placeholder="Address" formik={formik} />
            </div>

            <div className="col-md-4 mt-4">
              <label className="fw-bold">Donation Amount (₹)</label>
              <input 
                type="number" 
                className="form-control form-control-lg" 
                name="donation_amount" 
                value={formik.values.donation_amount} 
                onChange={formik.handleChange} 
                placeholder="Enter Amount" 
              />
              {formik.touched.donation_amount && formik.errors.donation_amount && (
                <div className="text-danger small">{formik.errors.donation_amount}</div>
              )}
            </div>

            <div className="text-center mt-5">
              <button type="submit" className="btn btn-primary btn-lg px-5" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : `Donate ₹${formik.values.donation_amount || 0}`}
              </button>
            </div>
          </Form>
        ) : (
          <>
            <h4 className="text-center mb-4">Select a Cause to Support</h4>
            <Row className="g-4">
              {donationTypes.map((type) => (
                <Col md={4} key={type.id}>
                  <Card 
                    className="h-100 text-center shadow-sm border-0 donation-card" 
                    onClick={() => handleCardClick(type)}
                    style={{ cursor: 'pointer', borderRadius: '15px' }}
                  >
                    <Card.Body className="p-4">
                      <div className="display-4 mb-3">{type.icon}</div>
                      <Card.Title className="fw-bold">{type.name}</Card.Title>
                      <Card.Text className="text-muted small">{type.desc}</Card.Text>
                      <div className="btn btn-primary w-100 mt-3">Select</div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>

      <style>{`
        .donation-card { transition: all 0.3s ease; }
        .donation-card:hover { transform: translateY(-8px); border: 1px solid #fd7e14 !important; }
      `}</style>
    </>
  );
}

const Input = ({ label, name, placeholder, formik, full = false, onChange }) => (
  <div className={full ? "col-12" : "col-md-6"}>
    <label className="form-label small fw-bold">{label}</label>
    <input
      className="form-control"
      name={name}
      type={name === "email" ? "email" : "text"}
      value={formik.values[name] || ""}
      onChange={onChange || formik.handleChange}
      onBlur={formik.handleBlur}
      placeholder={placeholder}
    />
    {formik.touched[name] && formik.errors[name] && <div className="text-danger small">{formik.errors[name]}</div>}
  </div>
);

export default Donation;