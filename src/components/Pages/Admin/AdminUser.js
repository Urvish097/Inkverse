import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import './AdminUser.css';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BaseUrl } from '../../services/Url'

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BaseUrl}/admin/user`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const result = await response.json();

            console.log('Fetched user data:', result);

            if (Array.isArray(result.data)) {
                setUsers(result.data);
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching user data');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchTerm(query);

        if (query.length > 0) {
            try {
                const response = await fetch(`${BaseUrl}/admin/user/find?username=${query}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const result = await response.json();

                if (Array.isArray(result.data)) {
                    setUsers(result.data);
                } else {
                    setUsers([]);
                    toast.info('No users found');
                }
            } catch (error) {
                console.error(error);
                toast.error('Error fetching user data');
            }
        } else {
            fetchUsers();
        }
    };

    const handleDelete = async (userId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this user?');
        if (!isConfirmed) return;

        setLoading(true); // Set loading to true before the API call

        try {
            const response = await fetch(`${BaseUrl}/admin/user/delete/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
            toast.success('User deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Error deleting user');
        } finally {
            setLoading(false); // Set loading to false after the API call
        }
    };

    const capitalizeFirstLetter = (username) => {
        if (!username) return '';
        return username.charAt(0).toUpperCase() + username.slice(1);
    };

    return (
        <>
            <section className="admin-section">
                <AdminHeader />
                <div className="user-table-container">
                    <h2 className="table-title">Users</h2>
                    <input
                        type="search"
                        placeholder='Search Users'
                        className='form-control mb-4'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <div className="table-responsive">
                        <table className="user-table table table-striped">
                            <thead>
                                <tr>
                                    <th>Profile Image</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Created Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user._id}>
                                            <td>
                                                <img src={user.profile} className="profile-image" alt="Profile" />
                                            </td>
                                            <td>{capitalizeFirstLetter(user.username)}</td>
                                            <td>{user.email}</td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="action-btn btn-delete"
                                                    title="Delete User"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                                <button className="action-btn btn-block">Block</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminUser;
