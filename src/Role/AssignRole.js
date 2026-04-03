import React, { useState } from 'react';
import axios from 'axios';

const AssignRole = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('ROLE_USER');   // default
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:8080/auth/assign-role', {
                email: email.trim(),
                roleName: role
            });

            setMessage(response.data.message || "Role assigned successfully!");
            setEmail('');   // clear email after success
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to assign role";
            setMessage("Error: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Assign Role to User</h2>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>User Email:</label><br />
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
                    <label>Select Role:</label><br />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="ROLE_USER">ROLE_USER</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: loading ? '#ccc' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Assigning...' : 'Assign Role'}
                </button>
            </form>

            {message && (
                <div style={{ 
                    marginTop: '20px', 
                    padding: '10px', 
                    backgroundColor: message.includes('Error') ? '#ffe6e6' : '#e6ffe6',
                    borderRadius: '5px'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default AssignRole;