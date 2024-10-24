// UserProfile.jsx
import React, { useEffect, useState } from 'react';
import "./UserProfile.css";
import { Link, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../../services/Url';

const UserProfile = () => {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);  // Loading state
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${BaseUrl}/user/userprofile/data`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log(data.data, ">>>>>>>>data");

                if (response.ok) {
                    setUserData(data.data);
                } else {
                    console.error('Error fetching profile data:', data.message);
                    if (data.message === "TokenExpiredError: jwt expired") {
                        localStorage.clear()
                        navigate('/login')
                    }
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false); // Hide loader after data is fetched
            }
        };

        fetchUserProfile();
    }, [token, BaseUrl]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <section className='UserProfile'>
            <div className="container">
                <div className="main-body">
                    <div className="row gutters-sm justify-content-center">
                        {loading ? (
                            // Display loader while fetching data
                            <div className="loader-container-profile">
                                <div className="loader-profile"></div>
                            </div>
                        ) : (
                            <>
                                <div className="col-lg-12 mb-5 mt-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-column align-items-center text-center">
                                                <img
                                                    src={userData.profile}
                                                    alt="User"
                                                    className="profileimage"
                                                />
                                                <div className="mt-3">
                                                    <h4>{userData.username}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10">
                                    <div className="card card_shadow mb-3">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Full Name</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">{userData.fname || "N/A"}</div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Username</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">{userData.username || "N/A"}</div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Email</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">{userData.email || "N/A"}</div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className='d-flex justify-content-between'>
                                                        <Link
                                                            to={`/UserProfileUpdate/${userData._id}`}
                                                            state={{ user: userData }}
                                                            className="btn btn-info fw-semibold"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button className='btn btn-danger fw-semibold' onClick={handleLogout}>Log Out</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;
