import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken"); 
        
        axios.get("http://localhost:8080/api/users/all", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            setUsers(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Database fetch failed:", error);
            setLoading(false);
        });
    }, []);

    // Function to handle redirection to AssignRole with data
    const handleEditRole = (email) => {
        navigate('/admin/assign-role', { state: { userEmail: email } });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User & Manager Management</h1>
            {loading ? (
                <p>Fetching data...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-50 text-center">
                                <td className="border p-2">{user.name}</td>
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        user.role.includes('ADMIN') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    <button 
                                        onClick={() => handleEditRole(user.email)}
                                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                                    >
                                        Edit Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserList;