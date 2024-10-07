import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import computer from '../../../Images/Computer.png';

const Email = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/user/resetpass/emailcheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            let userId = data.data.userId
            
            if (response.ok && data.success) {
                toast.success('OTP sent successfully!');
                setTimeout(() => {
                    navigate(`/Otp/${userId}`);
                    localStorage.setItem("IsOtp",true)
                }, 2000);
                
            } else {
                toast.error('Failed to send OTP, please try again.');
            }
        } catch (error) {
            toast.error('An error occurred, please try again.');
        } finally {
            setLoading(false);
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
                                <h5 className='inter text-center welcome mb-5'>Password Reset</h5>
                                <form onSubmit={handleNavigate}>
                                    <div className='input_main mb-3'>
                                        <div className='form-group mb-1'>
                                            <label htmlFor="email" className='inter'>Enter Your Email:</label> <br />
                                            <input
                                                type="email"
                                                name='email'
                                                className='form-control user_input mb-2'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-center mb-3'>
                                        <button type='submit' className='btn login_btn inter text-white' disabled={loading}>
                                            {loading ? (
                                                <div className="spinner"></div> // CSS spinner
                                            ) : (
                                                'Send OTP'
                                            )}
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

            {/* Spinner CSS */}
            <style>{`
                .spinner {
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top: 4px solid white;
                    width: 18px;
                    height: 18px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}

export default Email;
