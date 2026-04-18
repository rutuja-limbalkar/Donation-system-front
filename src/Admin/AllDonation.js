import React, { useState, useEffect } from 'react';
import PageHead from '../Component/pageHead';

function AllDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Use the correct key from your Login logic
  const token = localStorage.getItem("jwtToken");

  const fetchDonations = async () => {
    setLoading(true);
    // Fixed URL to match your DonationController (@GetMapping("/admin/all-donations"))
    let url = "http://localhost:8080/payment/admin/all-donations";
    
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    try {
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.status === 403) {
        alert("Session Expired or Unauthorized. Please login again.");
        return;
      }

      const data = await res.json();
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const downloadReceipt = async (id, orderId) => {
    try {
      const res = await fetch(`http://localhost:8080/payment/receipt/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        // If 403, it means the token is missing or the role is not ADMIN/MANAGER
        if(res.status === 403) alert("Access Denied: You don't have permission to download this.");
        else alert("Failed to download receipt");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Filename logic
      link.download = `receipt_${orderId || id}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download Error:", err);
      alert("Download failed");
    }
  };

  return (
    <>
      <PageHead title="All Donations" />

      <div className="container mt-4" style={{ maxWidth: "1450px" }}>
        <h2 className="mb-4">All Donations History</h2>

        {/* Date Filter */}
        <div className="row mb-4 align-items-end bg-light p-3 rounded">
          <div className="col-md-3">
            <label className="form-label fw-bold">From Date</label>
            <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">To Date</label>
            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="col-md-4 mt-4">
            <button className="btn btn-primary me-2" onClick={fetchDonations}>Apply Filter</button>
            <button className="btn btn-secondary" onClick={() => { setStartDate(''); setEndDate(''); fetchDonations(); }}>
              Clear Filter
            </button>
          </div>
        </div>

        {loading ? (
          <h4 className="text-center">Loading donations...</h4>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Donor Name</th>
                  <th>Email</th>
                  <th>Amount (₹)</th>
                  <th>Payment Mode</th>
                  <th>Ref Number / Order ID</th>
                  <th>Source</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.length === 0 ? (
                  <tr><td colSpan="8" className="py-4">No donations found</td></tr>
                ) : (
                  donations.map((d) => (
                    <tr key={d.id}>
                      <td>{d.paymentDate ? new Date(d.paymentDate).toLocaleDateString('en-IN') : '-'}</td>
                      {/* FIXED: Changed d.firstName to d.name to match your Java Entity */}
                      <td>{d.name || "N/A"}</td>
                      <td>{d.email}</td>
                      <td className="fw-bold">₹ {Number(d.donationAmount || 0).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${d.offline ? 'bg-warning text-dark' : 'bg-primary'}`}>
                          {d.paymentMode || 'Online'}
                        </span>
                      </td>
                      {/* Show Order ID for online, Reference Number for offline */}
                      <td className="small">{d.paymentId || d.referenceNumber || d.orderId || '-'}</td>
                      <td>
                        <span className={`badge ${d.offline ? 'bg-secondary' : 'bg-success'}`}>
                          {d.offline ? 'Offline' : 'Online'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-success" onClick={() => downloadReceipt(d.id, d.orderId)}>
                          📥 Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default AllDonations;