import React, { useState, useEffect } from 'react';
import computer from '../../../Images/Computer.png';
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BaseUrl } from '../../../services/Url';

const OTP_VALIDITY_DURATION = 60;

const Otp = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(OTP_VALIDITY_DURATION);
    const navigate = useNavigate();

    const { userId } = useParams();

    useEffect(() => {
        // Check if OTP generation time is stored
        const storedOtpTime = localStorage.getItem('otpGenerationTime');
        let expiryTime;

        if (storedOtpTime) {
            expiryTime = parseInt(storedOtpTime, 10) + OTP_VALIDITY_DURATION;
        } else {
            // If not stored, set current time as generation time
            const currentTime = Math.floor(Date.now() / 1000);
            localStorage.setItem('otpGenerationTime', currentTime);
            expiryTime = currentTime + OTP_VALIDITY_DURATION;
        }

        const updateTimer = () => {
            const currentTime = Math.floor(Date.now() / 1000);
            const remainingTime = expiryTime - currentTime;
            setTimer(remainingTime > 0 ? remainingTime : 0);
        };

        // Initial timer setup
        updateTimer();

        // Set interval to update timer every second
        const countdown = setInterval(() => {
            updateTimer();
        }, 1000);

        return () => clearInterval(countdown);
    }, []);

    useEffect(() => {
        if (timer === 0) {
            handleOtpExpiry();
        }
    }, [timer]);

    const handleOtpChange = (e, index) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 3) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const otpString = otp.join('');

        try {
            const response = await fetch(`${BaseUrl}/user/verifyotp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp: otpString, userId }), // Ensure userId is sent if required
            });

            const data = await response.json();
            console.log("Verified userId:", data.data.userId);

            if (response.ok) {
                toast.success(data.message || 'OTP verified successfully!');
                
                localStorage.removeItem('otpGenerationTime');
                setTimeout(() => {
                    navigate(`/Newpassword/${data.data.userId}`);
                }, 2000);
            } else {
                toast.error(data.message || 'Failed to verify OTP. Please try again.');
            }
        } catch (error) {
            toast.error('Enter Correct OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpExpiry = async () => {
        // Clear stored OTP generation time
        localStorage.removeItem('otpGenerationTime');

        if (userId) {
            try {
                const response = await fetch(`${BaseUrl}/user/delete-otp/${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    toast.warning('OTP expired!');
                    setTimeout(() => {
                        navigate("/Email");
                    }, 2000);
                } else {
                    toast.error('Failed to delete OTP. Please try again.');
                }
            } catch (error) {
                toast.error('Error deleting expired OTP.');
            }
        } else {
            toast.error("UserId is not available, delete API not called.");
        }
    };

    return (
        <>
            <section className='login'>
                <div className='row m-0 bg'>
                    <div className='col-lg-6'>
                        <div className='container'>
                            <div className='login_main'>
                                <h5 className='inter text-center welcome mb-5'>Enter Your OTP:</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className='input_main mb-3'>
                                        <div className='d-flex justify-content-center'>
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    maxLength="1"
                                                    className='form-control user_input otp_input mb-2 mx-1'
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(e, index)}
                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                    required
                                                    style={{
                                                        width: '50px',
                                                        textAlign: 'center',
                                                        fontSize: '24px',
                                                        margin: '0 5px',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        padding: '10px',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className='text-center mb-4'>
                                        OTP expires in {timer}s
                                    </p>
                                    <div className='d-flex justify-content-center mb-3 '>
                                        <button
                                            type='submit'
                                            className='btn login_btn inter text-white'
                                            disabled={loading || timer === 0}
                                        >
                                            {loading ? 'Verifying...' : 'Submit'}
                                        </button>
                                    </div>
                                </form>
                                <ToastContainer />
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

export default Otp;
