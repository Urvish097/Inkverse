import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import signupimg from "../../Images/Group 2.png";
import { toast, ToastContainer } from 'react-toastify';
import { BaseUrl } from '../../services/Url';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = location.state;
    const [formData, setFormData] = useState({
        fname: user.fname || "",
        username: user.username || "",
        email: user.email || "",
        profile: null
    });
    const [loading, setLoading] = useState(false); // Loading state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profile: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true before the API call

        const { fname, username, email, profile } = formData;
        const userId = user._id;
        const token = localStorage.getItem('token');

        const updatedProfileData = new FormData();
        updatedProfileData.append('fname', fname);
        updatedProfileData.append('username', username);
        updatedProfileData.append('email', email);
        if (profile) {
            updatedProfileData.append('profile', profile);
        }

        try {
            const response = await fetch(`${BaseUrl}/user/updateprofile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: updatedProfileData,
            });

            if (response.ok) {
                navigate('/UserProfile');
                toast.success('Profile updated successfully!');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to update profile.');
            }
        } catch (error) {
            toast.error('An error occurred while updating the profile.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="signup bgs">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="d-flex comimage">
                                <img src={signupimg} alt="Sign Up" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form_main">
                                {loading ? (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100px'
                                    }}>
                                        <div className="simple-loader"></div>
                                    </div>
                                ) : (
                                    <>
                                        <h5 className="inter fw-bold text-center mb-4">
                                            Edit Your Profile
                                        </h5>
                                        <form onSubmit={handleSubmit}>
                                            <div className="input_main mb-3">
                                                <div className="form-group mb-1">
                                                    <label htmlFor="fname" className="inter">
                                                        Full Name:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="fname"
                                                        value={formData.fname}
                                                        onChange={handleInputChange}
                                                        className="form-control user_input mb-2"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group mb-1">
                                                    <label htmlFor="username" className="inter">
                                                        Username:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleInputChange}
                                                        className="form-control user_input mb-2"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group mb-1">
                                                    <label htmlFor="email" className="inter">
                                                        Email:
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="form-control user_input mb-2"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group mb-1">
                                                    <label htmlFor="profile" className="inter">
                                                        Profile Image:
                                                    </label>
                                                    <input
                                                        type="file"
                                                        name="profile"
                                                        onChange={handleFileChange}
                                                        className="form-control user_input mb-2"
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-center mb-4">
                                                <button className="btn signup_btn inter text-white">
                                                    Update Profile
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <style>{`
                .simple-loader {
                    border: 5px solid #f3f3f3; /* Light grey */
                    border-top: 5px solid #3498db; /* Blue */
                    border-radius: 50%;
                    width: 40px; /* Size of the loader */
                    height: 40px; /* Size of the loader */
                    animation: spin 1s linear infinite; /* Animation */
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}

export default UpdateProfile;
