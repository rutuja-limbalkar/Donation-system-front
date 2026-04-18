import React, { useState, useEffect } from 'react';
import PageHead from '../Component/pageHead';
import api from '../api/axiosInstance'; 

function OfflineDonationForm() {
  const initialFormState = {
    name: '',
    email: '',
    mobile: '',
    adharCard: '',
    panNumber: '',
    address: '',
    donationAmount: '',
    productId: '',
    paymentMode: 'Cash',
    transactionId: '',
    chequeNumber: '',
    chequeDate: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // 🔥 INDUSTRY FIX: Auto-hide success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000); // 5000ms = 5 seconds
      return () => clearTimeout(timer);
    }
  }, [success]);

  const paymentModes = [
    { value: 'Cash', label: 'Cash' },
    { value: 'UPI', label: 'UPI' },
    { value: 'NEFT', label: 'NEFT' },
    { value: 'RTGS', label: 'RTGS' },
    { value: 'Cheque', label: 'Cheque' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const val = value.replace(/\D/g, ""); 
      if (val.length <= 10) setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }

    if (name === "adharCard") {
      const val = value.replace(/\D/g, ""); 
      if (val.length <= 12) setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }

    if (name === "panNumber") {
      if (value.length <= 10) setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Mapping payload
    const payload = {
      id: null, // Forces a fresh entry in DB
      name: formData.name.trim(),
      email: formData.email,
      mobile: formData.mobile,
      adharCard: formData.adharCard,
      panNumber: formData.panNumber,
      address: formData.address || null,
      donationAmount: parseFloat(formData.donationAmount) || 0,
      productId: parseInt(formData.productId, 10),
      isOffline: true,
      paymentMode: formData.paymentMode,
      referenceNumber: formData.transactionId || formData.chequeNumber || null,
      notes: formData.notes || null,
      status: "SUCCESS"
      // 🔥 Timestamp is NOT sent here; Backend handles it for accuracy
    };

    try {
      const res = await api.post("/payment/admin/offline-donation", payload);
      if (res.status === 200 || res.status === 201) {
        setSuccess("✅ Offline Donation Added Successfully!");
        setFormData(initialFormState);
      }
    } catch (err) {
      const backendError = err.response?.data || "Something went wrong.";
      setError("Failed: " + backendError);
      // Auto-hide error after 7 seconds
      setTimeout(() => setError(''), 7000);
    }
  };

  const needsTransactionId = ['UPI', 'NEFT', 'RTGS', 'Bank Transfer'].includes(formData.paymentMode);
  const isCheque = formData.paymentMode === 'Cheque';

  return (
    <>
      <PageHead title="Add Offline Donation" />

      <div className="container mt-4" style={{ maxWidth: "780px" }}>
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Add Manual / Offline Donation</h4>
          </div>

          <div className="card-body">
            {/* SUCCESS MESSAGE BOX */}
            {success && (
              <div className="alert alert-success alert-dismissible fade show">
                {success}
                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
              </div>
            )}

            {/* ERROR MESSAGE BOX */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show">
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Donation Type *</label>
                  <select className="form-select" name="productId" value={formData.productId} onChange={handleChange}>
                    <option value="">Select Donation Type</option>
                    <option value="1">Monthly Donation</option>
                    <option value="2">Birthday Donation</option>
                    <option value="3">Anniversary Donation</option>
                    <option value="4">Gaushala Donation</option>
                    <option value="5">General Donation</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Donor Full Name *</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" required />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" required />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Mobile Number</label>
                  <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10 digit number" maxLength="10" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Aadhar Number</label>
                  <input type="text" className="form-control" name="adharCard" value={formData.adharCard} onChange={handleChange} placeholder="12 digit number" maxLength="12" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">PAN Number</label>
                  <input type="text" className="form-control" name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="ABCDE1234F" maxLength="10" />
                </div>

                <div className="col-12">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Full address" rows="2" />
                </div>

                <div className="col-12">
                  <label className="form-label">Donation Amount (₹) *</label>
                  <input type="number" className="form-control" name="donationAmount" value={formData.donationAmount} onChange={handleChange} placeholder="Min ₹1" required min="1" />
                </div>

                <div className="col-12">
                  <label className="form-label">Payment Mode *</label>
                  <select className="form-select" name="paymentMode" value={formData.paymentMode} onChange={handleChange} required>
                    {paymentModes.map((mode) => (
                      <option key={mode.value} value={mode.value}>{mode.label}</option>
                    ))}
                  </select>
                </div>

                {needsTransactionId && (
                  <div className="col-12">
                    <label className="form-label">Transaction ID / UTR Number *</label>
                    <input type="text" className="form-control" name="transactionId" value={formData.transactionId} onChange={handleChange} required placeholder="Enter UTR or Txn ID" />
                  </div>
                )}

                {isCheque && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">Cheque Number *</label>
                      <input type="text" className="form-control" name="chequeNumber" value={formData.chequeNumber} onChange={handleChange} required placeholder="6 digits" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Cheque Date *</label>
                      <input type="date" className="form-control" name="chequeDate" value={formData.chequeDate} onChange={handleChange} required />
                    </div>
                  </>
                )}

                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional notes" rows="3" />
                </div>
              </div>

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-success btn-lg">Add Offline Donation</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default OfflineDonationForm;