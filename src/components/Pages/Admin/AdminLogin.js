import React, { useState } from 'react';
import '../Login/Login.css';
import computer from '../../Images/Computer.png';
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BaseUrl } from '../../services/Url';

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate(); // Initialize navigate function

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BaseUrl}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.message === "Admin LOGIN SUCSSEFULYY") {
                localStorage.setItem("admintoken", data.Token);
                toast.success("Login successful!");
                setTimeout(() => {
                    navigate('/adminpanel');
                }, 2000);
            } else {
                toast.error(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred during login.");
        }
    };

    return (
        <>
            <ToastContainer />
            <section className='login'>
                <div className='row m-0 bg'>
                    <div className='col-lg-6'>
                        <div className='container'>
                            <div className='login_main'>
                                <h5 className='inter text-center welcome mb-4'>Welcome Back!</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className='input_main mb-5'>
                                        <div className='form-group mb-1'>
                                            <label htmlFor="email" className='inter'>Email:</label> <br />
                                            <input
                                                type="email"
                                                name='email'
                                                className='form-control user_input mb-2'
                                                onChange={handleChange}
                                                value={formData.email}
                                                required
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor="password" className='inter'>Password:</label> <br />
                                            <div className="password-input-container">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name='password'
                                                    className='form-control user_input'
                                                    onChange={handleChange}
                                                    value={formData.password}
                                                    required
                                                />
                                                <span className="password-icon" onClick={togglePasswordVisibility}>
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-center mb-3 '>
                                        <button type='submit' className='btn login_btn inter text-white'>
                                            Login
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
        </>
    );
};

export default AdminLogin;
