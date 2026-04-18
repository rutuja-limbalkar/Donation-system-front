import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance'; 

const AssignRole = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Automatically fill email if coming from UserList
    const [email, setEmail] = useState(location.state?.userEmail || '');
    const [role, setRole] = useState('ROLE_USER');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await api.post('/auth/assign-role', {
                email: email.trim(),
                roleName: role
            });

            setMessage("✅ " + (response.data.message || "Role updated successfully!"));
            
            // Redirect back to UserList after 2 seconds to see the change
            setTimeout(() => navigate('/admin/userlist'), 2000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            setMessage("❌ Error: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Change User Role</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>User Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter user email"
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Select New Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="ROLE_USER">ROLE_USER (Basic Access)</option>
                        <option value="ROLE_MANAGER">ROLE_MANAGER (Moderate Access)</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN (Full Access)</option>
                    </select>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '10px 20px', backgroundColor: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
                >
                    {loading ? 'Updating...' : 'Update Role'}
                </button>
            </form>
            {message && <div style={{ marginTop: '20px', padding: '10px', backgroundColor: message.includes('❌') ? '#ffe6e6' : '#e6ffe6', borderRadius: '5px' }}>{message}</div>}
        </div>
    );
};

export default AssignRole;