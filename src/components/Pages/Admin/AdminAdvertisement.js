import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import { GoDotFill } from "react-icons/go";
import "./AdminAdvertisement.css"

const AdminAdvertisement = () => {
    const [isChecked, setIsChecked] = useState(false);

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
                            <p className='blog-total mb-0'>All ()</p>
                        </div>

                        <div className='blog-main mb-4'>
                            <div className='d-flex justify-content-md-between flex-wrap align-items-center blog-content-wrapper'>
                                <div className='d-flex gap-4 align-items-center'>
                                    <div className='title'>
                                        <img src="https://i.ytimg.com/vi/tYcxuRZfB0g/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB0oZUmYfpDp5MR3w1hkVKVLJzfqA" className='Blog-title-image' alt="poster" />
                                    </div>
                                    <div>
                                        <p className='blog-name mb-2'>fresh Soda</p>
                                        <div className='ad-profile-img-main d-flex align-items-center gap-2'>
                                            <img className='ad-profile-img' src="https://i.ytimg.com/vi/tYcxuRZfB0g/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB0oZUmYfpDp5MR3w1hkVKVLJzfqA" alt="" />
                                            <p className='mb-0'>darshanchovatiya30@gmail.com</p>
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
                    </div>
                </section>
            </section>
        </>
    )
}

export default AdminAdvertisement;