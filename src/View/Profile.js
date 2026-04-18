// src/View/Profile.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';   // Your axios instance with token

const Profile = () => {
    const [user, setUser] = useState(null);
    const [showRoleSection, setShowRoleSection] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Get current logged-in user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = currentUser.roles?.includes('ROLE_ADMIN');

    // Fetch user details (you can enhance this later with backend API)
    useEffect(() => {
        setUser(currentUser);
        // If you have a backend API to get full profile, call it here
    }, []);

    // Handle Role Checkbox Change
    const handleRoleChange = (role) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    // Assign Role (Only Admin can do this)
    const handleAssignRole = async () => {
        if (selectedRoles.length === 0) {
            setMessage("Please select at least one role");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await api.post('/auth/assign-role', {
                email: user.email,
                roleName: selectedRoles[0]   // You can allow multiple later
            });

            setMessage(response.data.message || "Role updated successfully!");
            setShowRoleSection(false);
            
            // Refresh user data
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <h2>Loading Profile...</h2>;
    }

    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
            <h2>My Profile</h2>
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>

                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Current Roles:</strong> {user.roles?.join(', ') || 'ROLE_USER'}</p>

                <hr />

                {/* Show "Manage Role" button ONLY to ADMIN */}
                {isAdmin && (
                    <div style={{ marginTop: '20px' }}>
                        <button 
                            onClick={() => setShowRoleSection(!showRoleSection)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            {showRoleSection ? 'Cancel Role Management' : 'Manage Role'}
                        </button>

                        {/* Role Management Section */}
                        {showRoleSection && (
                            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <h5>Assign Role to {user.name}</h5>
                                
                                <div style={{ margin: '15px 0' }}>
                                    <label style={{ display: 'block', marginBottom: '10px' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRoles.includes('ROLE_MANAGER')}
                                            onChange={() => handleRoleChange('ROLE_MANAGER')}
                                        />
                                        {' '} ROLE_MANAGER
                                    </label>

                                    <label style={{ display: 'block', marginBottom: '10px' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRoles.includes('ROLE_ADMIN')}
                                            onChange={() => handleRoleChange('ROLE_ADMIN')}
                                        />
                                        {' '} ROLE_ADMIN
                                    </label>
                                </div>

                                <button 
                                    onClick={handleAssignRole}
                                    disabled={loading || selectedRoles.length === 0}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: loading ? '#ccc' : '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? 'Assigning...' : 'Assign Selected Role'}
                                </button>

                                {message && (
                                    <p style={{ 
                                        marginTop: '15px', 
                                        color: message.includes('Error') ? 'red' : 'green' 
                                    }}>
                                        {message}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;