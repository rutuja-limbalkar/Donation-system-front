import React, { useState, useEffect } from 'react';
import PageHead from '../Component/pageHead';

function UserDonation() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Please login to view donation history.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/payment/my-donations", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setDonations(Array.isArray(data) ? data : []);
      } else {
        setError("Failed to load donation history.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Secure authenticated download with token
  const downloadReceipt = async (id, orderId) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Please login again to download receipt.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/payment/receipt/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 403) {
        alert("❌ You are not authorized to download this receipt.");
        return;
      }
      if (!res.ok) {
        alert("❌ Failed to download receipt. Please try again.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt_${orderId || id}.pdf`;   // nice filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("❌ Download failed. Check console for details.");
    }
  };

  if (loading) return <div className="text-center mt-5"><h4>Loading donation history...</h4></div>;

  return (
    <>
      <PageHead title="Donation History" />

      <div className="container mt-4" style={{ maxWidth: "1200px" }}>
        <h2 className="mb-4">My Donation History</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {donations.length === 0 && !error && (
          <div className="alert alert-info">You haven't made any donations yet.</div>
        )}

        {donations.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Amount (₹)</th>
                  <th>Type ID</th>
                  <th>Mode</th>
                  <th>Payment ID</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td>{d.paymentDate ? new Date(d.paymentDate).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="fw-bold">₹ {Number(d.donationAmount || 0).toLocaleString('en-IN')}</td>
                    <td>{d.productId || '-'}</td>
                    <td>{d.isOffline ? (d.paymentMode || 'Offline') : 'Online'}</td>
                    <td className="text-truncate" style={{ maxWidth: "180px" }}>{d.paymentId || '-'}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => downloadReceipt(d.id, d.orderId)}
                      >
                        📄 Download Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default UserDonation;