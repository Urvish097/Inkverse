import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { GoDotFill } from "react-icons/go";
import "./AdminAdvertisement.css";
import { BaseUrl } from '../../services/Url';
import { useNavigate } from 'react-router-dom';

const AdminAdvertisement = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const token = localStorage.getItem('admintoken');
                const response = await fetch(`${BaseUrl}/admin/allAds`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success) {
                    setAds(result.data);
                } else {
                    console.error(result.message);
                    if (result.message === "TokenExpiredError: jwt expired") {
                        localStorage.clear();
                        navigate('/adminlogin');
                    }
                }
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        };

        fetchAds();
    }, []);

    const handleToggle = async (adId) => {
        setLoading((prev) => ({ ...prev, [adId]: true }));

        try {
            const token = localStorage.getItem('admintoken');
            const response = await fetch(`${BaseUrl}/admin/enableForPayment/${adId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                setAds((prevAds) =>
                    prevAds.map((ad) =>
                        ad._id === adId ? { ...ad, paynow: 1 } : ad
                    )
                );
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error enabling payment:', error);
        } finally {
            setLoading((prev) => ({ ...prev, [adId]: false }));
        }
    };

    const handleStatusActive = async (adId) => {
        try {
            const token = localStorage.getItem('admintoken');
            const response = await fetch(`${BaseUrl}/admin/statusActive/${adId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                setAds((prevAds) =>
                    prevAds.map((ad) =>
                        ad._id === adId ? { ...ad, status: 'active' } : ad
                    )
                );
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error activating ad status:', error);
        }
    };

    return (
        <>
            <section className='admin-section'>
                <AdminHeader />
                <section className='blog-section admin-Advertisement adminBlog mt-2'>
                    <div className='container mb-4'>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <p className='blog-total mb-0'>All ({ads.length})</p>
                        </div>
                        {ads.map((ad) => (
                            <div className='blog-main mb-4' key={ad._id}>
                                <div className='d-flex justify-content-md-between flex-wrap align-items-center blog-content-wrapper'>
                                    <div className='d-flex gap-4 align-items-center'>
                                        <div className='title'>
                                            <img src={ad.poster} className='Blog-title-image' alt="poster" />
                                        </div>
                                        <div>
                                            <p className='blog-name mb-2'>{ad.title}</p>
                                            <div className='ad-profile-img-main d-flex align-items-center gap-2'>
                                                <img className='ad-profile-img' src={ad.userId?.profile} alt="" />
                                                <p className='mb-0'>{ad.userId?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        Payment
                                        <GoDotFill
                                            className={ad.paymentClear ? 'text-success fs-4' : 'text-danger fs-4'}
                                        />
                                    </div>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id={`flexSwitchCheckDefault-${ad._id}`}
                                            checked={ad.paynow === 1}
                                            onChange={() => handleToggle(ad._id)}
                                            disabled={ad.paynow === 1 || loading[ad._id]}
                                        />
                                        <label className="form-check-label" htmlFor={`flexSwitchCheckDefault-${ad._id}`}>
                                            {loading[ad._id] ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : ad.paynow === 1 ? 'On' : 'Off'}
                                        </label>
                                    </div>
                                    <div className='d-flex align-items-center gap-3 me-3'>
                                        <span>
                                            <button
                                                className='btn btn-success'
                                                onClick={() => handleStatusActive(ad._id)}
                                                disabled={ad.status === 'active'}
                                            >
                                                {ad.status === 'active' ? 'Activated' : 'Active'}
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
};

export default AdminAdvertisement;
