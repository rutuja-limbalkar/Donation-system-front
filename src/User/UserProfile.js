import React, { useState, useEffect } from 'react';
import PageHead from '../Component/pageHead';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Please login to view your profile.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/payment/my-profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError("Failed to load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><h4>Loading profile...</h4></div>;

  const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || "Donor";
  const fullAddress = [profile?.address1, profile?.address2].filter(Boolean).join(", ");

  return (
    <>
      <PageHead title="My Profile" />

      <div className="container mt-4" style={{ maxWidth: "900px" }}>
        <h2 className="mb-4">My Profile</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {profile && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">{fullName}</h4>

              <div className="row g-3">
                <div className="col-md-6"><strong>Email:</strong> {profile.email}</div>
                <div className="col-md-6"><strong>Mobile:</strong> {profile.mobile || '-'}</div>
                <div className="col-md-6"><strong>Aadhar Number:</strong> {profile.adharCard || '-'}</div>
                <div className="col-md-6"><strong>PAN Number:</strong> {profile.panNumber || '-'}</div>
                <div className="col-12"><strong>Address:</strong> {fullAddress || '-'}</div>
                <div className="col-md-4"><strong>City:</strong> {profile.city || '-'}</div>
                <div className="col-md-4"><strong>State:</strong> {profile.state || '-'}</div>
                <div className="col-md-4"><strong>Pincode:</strong> {profile.zipNo || '-'}</div>
              </div>

              <hr className="my-4" />

              <div className="row text-center">
                <div className="col-md-6">
                  <h4 className="text-success">₹ {Number(profile.totalDonated || 0).toLocaleString('en-IN')}</h4>
                  <small>Total Donated</small>
                </div>
                <div className="col-md-6">
                  <h4>{profile.donationCount || 0}</h4>
                  <small>Donations Made</small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserProfile;