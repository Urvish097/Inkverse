import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import './AdminUser.css';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BaseUrl } from '../../services/Url';

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('admintoken');

    const fetchUsers = async (query = '') => {
        try {
            let url = `${BaseUrl}/admin/user`;

            const params = new URLSearchParams();
            if (query) {
                params.append('username', query);
            }
            if ([...params].length > 0) {
                url += `?${params.toString()}`;
            }

            setLoading(true);
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const result = await response.json();

            if (Array.isArray(result.data)) {
                setUsers(result.data);
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching user data');
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch users by status
    const fetchUsersByStatus = async (status) => {
        try {
            const url = `${BaseUrl}/admin/statusfilter`;
            setLoading(true);
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users by status');
            }
            const result = await response.json();

            if (result.data && result.data[status]) {
                setUsers(result.data[status]);
            } else {
                setUsers([]);
                toast.info('No users found for the selected status');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching users by status');
        } finally {
            setLoading(false);
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
                const response = await fetch(`${BaseUrl}/admin/user/find?username=${query}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

    // Handler for status filter change
    const handleStatusChange = (e) => {
        const selectedStatus = e.target.value;
        if (selectedStatus === 'All') {
            fetchUsers();
        } else {
            fetchUsersByStatus(selectedStatus);
        }
    };

    const handleDelete = async (userId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this user?');
        if (!isConfirmed) return;

        setLoading(true);

        try {
            const response = await fetch(`${BaseUrl}/admin/user/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
            setLoading(false);
        }
    };

    const updateUserStatus = async (userId, status) => {
        const isConfirmed = window.confirm(`Are you sure you want to ${status.toLowerCase()} this user?`);
        if (!isConfirmed) return;

        setLoading(true);

        try {
            const url = `${BaseUrl}/admin/user/status?userId=${userId}&status=${status}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to ${status.toLowerCase()} user`);
            }

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, status } : user
                )
            );

            toast.success(`User ${status.toLowerCase()}d successfully`);
        } catch (error) {
            console.error(error);
            toast.error(`Error ${status.toLowerCase()}ing user`);
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = (userId) => {
        updateUserStatus(userId, 'Active');
    };

    const handleBlock = (userId) => {
        updateUserStatus(userId, 'Block');
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
                    <div className="filters">
                        {/* Status Filter */}
                        <select
                            className="form-control mb-4 status-filter"
                            onChange={handleStatusChange}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Block">Block</option>
                        </select>
                        {/* Search Filter */}
                        <input
                            type="search"
                            placeholder="Search Users"
                            className="form-control mb-4"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="user-table table table-striped">
                            <thead>
                                <tr>
                                    <th>Profile Image</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Created Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>
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
                                            <td>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                                            <td>
                                                {user.status === 'Pending' || user.status === 'Block' ? (
                                                    <button
                                                        className="action-btn btn-active"
                                                        title="Activate User"
                                                        onClick={() => handleActivate(user._id)}
                                                    >
                                                        Activate
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="action-btn btn-block"
                                                        title="Block User"
                                                        onClick={() => handleBlock(user._id)}
                                                    >
                                                        Block
                                                    </button>
                                                )}
                                            </td>

                                            <td>
                                                <button
                                                    className="action-btn btn-delete"
                                                    title="Delete User"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>No users found.</td>
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
