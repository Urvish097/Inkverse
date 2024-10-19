import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { GoDotFill } from "react-icons/go";
import "./AdminAdvertisement.css";
import { BaseUrl } from '../../services/Url';

const AdminAdvertisement = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [ads, setAds] = useState([]);

    // Fetch ads data from the API with token
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const token = localStorage.getItem('admintoken'); // Assuming the token is stored in localStorage
                const response = await fetch(`${BaseUrl}/admin/allAds`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Pass the token in the Authorization header
                    }
                });

                const result = await response.json();

                if (result.success) {
                    setAds(result.data);
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        };

        fetchAds();
    }, []);

    const handleToggle = () => {
        setIsChecked(!isChecked);
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
                                                <img className='ad-profile-img' src={ad.userId.profile} alt="" />
                                                <p className='mb-0'>{ad.userId.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        Payment <GoDotFill className='text-success' />
                                    </div>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={isChecked} onChange={handleToggle} />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                            {isChecked ? 'On' : 'Off'}
                                        </label>
                                    </div>
                                    <div className='d-flex align-items-center gap-3 me-3'>
                                        <span>
                                            <button className='btn btn-success'>Active</button>
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
