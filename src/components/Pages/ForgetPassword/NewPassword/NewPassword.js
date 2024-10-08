import React, { useState } from 'react';
import computer from '../../../Images/Computer.png';
import { useNavigate, useParams } from "react-router-dom"; // useParams to get userId
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify'; // For toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import { BaseUrl } from '../../../services/Url';

const NewPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState(''); // New password state
    const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password state
    const [loading, setLoading] = useState(false); // Loading state

    const navigate = useNavigate();
    const { userId } = useParams(); 
    // Get userId from URL parameters

    // Toggle password visibility
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    // Navigate to the Login page
    const handleNavigate = () => navigate("/Login");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true); // Start loader

        // Validate that both passwords match
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            // Send PUT request to update password
            const response = await fetch(`${BaseUrl}/user/updatepassword/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newpassword: newPassword,
                    conformpassword: confirmPassword, // Backend expects this field name
                }),
            });

            // Handle the response
            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Password updated successfully!");

                // Call the delete OTP API after successful password update
                const deleteOtpResponse = await fetch(`${BaseUrl}/user/delete-otp/${userId}`, {
                    method: 'DELETE', // Assuming DELETE is the correct method
                });

                if (deleteOtpResponse.ok) {
                } else {
                    const deleteOtpData = await deleteOtpResponse.json();
                    toast.error(deleteOtpData.message || "Error deleting OTP.");
                }

                setTimeout(() => {
                    handleNavigate(); // Redirect to Login after successful password update
                }, 2000);
            } else {
                toast.error(data.message || "Error updating password.");
            }

        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false); // Stop loader
        }
    };

    return (
        <section className='login'>
            <ToastContainer /> {/* Toast notification container */}
            <div className='row m-0 bg'>
                <div className='col-lg-6'>
                    <div className='container'>
                        <div className='login_main'>
                            <h5 className='inter text-center welcome mb-4'>Update Password</h5>
                            <form onSubmit={handleSubmit}>
                                <div className='input_main mb-5'>
                                    {/* New Password Field */}
                                    <div className='form-group'>
                                        <label htmlFor="newpassword" className='inter mb-1'>New Password:</label>
                                        <div className="password-input-container mb-3">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name='newpassword'
                                                className='form-control user_input'
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                            <span className="password-icon" onClick={togglePasswordVisibility}>
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className='form-group'>
                                        <label htmlFor="confirmPassword" className='inter mb-1'>Confirm Password:</label>
                                        <div className="password-input-container">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name='confirmPassword'
                                                className='form-control user_input'
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <span className="password-icon" onClick={toggleConfirmPasswordVisibility}>
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className='d-flex justify-content-center mb-3'>
                                    <button type='submit' className='btn login_btn inter text-white' disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className='col-lg-6 p-0'>
                    <div className='position-relative'>
                        <div className='bg_img'>
                            <img src={computer} className='position-absolute com_images' alt="Computer" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NewPassword;
