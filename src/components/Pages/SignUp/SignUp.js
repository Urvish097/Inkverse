import React, { useState } from "react";
import signupimg from "../../Images/Group 2.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css";
import { BaseUrl } from "../../services/Url";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fname: "",
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);  // Loading state
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setProfileImage(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmpassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const formdata = new FormData();
        formdata.append("fname", formData.fname);
        formdata.append("username", formData.username);
        formdata.append("email", formData.email);
        formdata.append("password", formData.password);
        formdata.append("confirmpassword", formData.confirmpassword);
        formdata.append("profile", profileImage);

        setIsLoading(true);  // Show loader while making the request

        try {
            const response = await fetch(`${BaseUrl}/user/user-signup`, {
                method: "POST",
                body: formdata,
            });

            const data = await response.json();

            if (response.ok && data.message === "USER SIGNUP SUCCESSFUL") {
                navigate("/Login");
                toast.success("Signup successful! Redirecting...")
            } else {
                toast.error(data.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred during signup.");
        } finally {
            setIsLoading(false);  // Hide loader after the request is complete
        }
    };

    return (
        <>
            {isLoading && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}

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
                                <h5 className="inter fw-bold text-center mb-4">
                                    Please Fill out the form to Register!
                                </h5>
                                <div className="input_main mb-3">
                                    <div className="form-group mb-1">
                                        <label htmlFor="fname" className="inter">
                                            Full Name:
                                        </label>
                                        <input
                                            type="text"
                                            name="fname"
                                            className="form-control user_input mb-2"
                                            onChange={handleChange}
                                            value={formData.fname}
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
                                            className="form-control user_input mb-2"
                                            onChange={handleChange}
                                            value={formData.username}
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
                                            className="form-control user_input mb-2"
                                            onChange={handleChange}
                                            value={formData.email}
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
                                            className="form-control user_input mb-2"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-1">
                                        <label htmlFor="password" className="inter">
                                            Password:
                                        </label>
                                        <div className="password-input-container">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="form-control user_input"
                                                onChange={handleChange}
                                                value={formData.password}
                                                required
                                            />
                                            <span
                                                className="password-icon"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-group mb-1">
                                        <label htmlFor="confirmpassword" className="inter">
                                            Confirm Password:
                                        </label>
                                        <div className="password-input-container">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmpassword"
                                                className="form-control user_input"
                                                onChange={handleChange}
                                                value={formData.confirmpassword}
                                                required
                                            />
                                            <span
                                                className="password-icon"
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mb-4">
                                    <button
                                        className="btn signup_btn inter text-white"
                                        onClick={handleSubmit}
                                        disabled={isLoading}  // Disable button during loading
                                    >
                                        Register
                                    </button>
                                </div>
                                <p className="inter text-center">
                                    Yes, I have an account?{" "}
                                    <Link
                                        to="/Login"
                                        className="inter fw-bold text-decoration-none text-dark"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SignUp;
