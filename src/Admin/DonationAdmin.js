import React, { useState, useEffect } from 'react';

function DonationAdmin() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("Please login as Admin to view donations.");
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:8080/payment/donations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied. You need Admin or Manager role.");
        }
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      setError(err.message || "Failed to load donations. Please check if you are logged in as Admin.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><h4>Loading donations...</h4></div>;
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">{error}</h4>
        <button className="btn btn-primary mt-3" onClick={fetchDonations}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "1300px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Donations ({donations.length})</h2>
        <button className="btn btn-success" onClick={fetchDonations}>
          Refresh
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Type ID</th>
              <th>Amount ₹</th>
              <th>Payment ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-5">
                  No donations found yet.
                </td>
              </tr>
            ) : (
              donations.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.paymentDate ? new Date(d.paymentDate).toLocaleString() : '-'}</td>
                  <td>{d.firstName} {d.lastName}</td>
                  <td>{d.email}</td>
                  <td>{d.mobile}</td>
                  <td>{d.productId || '-'}</td>
                  <td>₹ {Number(d.donationAmount).toLocaleString('en-IN')}</td>
                  <td>{d.paymentId ? d.paymentId.substring(0, 20) + '...' : '-'}</td>
                  <td><span className="badge bg-success">Paid</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DonationAdmin;