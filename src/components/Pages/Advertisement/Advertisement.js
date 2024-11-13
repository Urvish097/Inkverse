import React, { useState, useEffect } from 'react';
import BlogHead from '../Blog_head/BlogHead';
import './Advertisement.css';
import { toast, ToastContainer } from 'react-toastify';
import { load } from '@cashfreepayments/cashfree-js';
import { BaseUrl } from '../../services/Url';
import { Link, useNavigate } from 'react-router-dom';

const Advertisement = () => {
    const [showModal, setShowModal] = useState(false);
    const [price, setPrice] = useState(999);
    const [duration, setDuration] = useState('7');
    const [title, setTitle] = useState('');
    const [phone, setphone] = useState('')
    const [poster, setPoster] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ads, setAds] = useState([]);
    const [invoiceall, setInvoiceAll] = useState([]);
    const [showInvoice, setShowInvoice] = useState(false);
    const [view, setView] = useState('adsss');
    const [disable, setDisable] = useState(0);
    const [cashfree, setCashfree] = useState(null);
    const [currentFilter, setCurrentFilter] = useState('all');

    const Navigate = useNavigate()

    const userId = localStorage.getItem('userId');
    let orderId = "";

    useEffect(() => {
        const initializeSDK = async () => {
            try {
                const cfInstance = await load({
                    mode: "sandbox",
                });
                setCashfree(cfInstance);
            } catch (error) {
                console.error("Failed to load Cashfree SDK", error);
                toast.error("Failed to load payment gateway");
            }
        };

        initializeSDK();
    }, []);

    const getSessionId = async (adId) => {
        try {
            const res = await fetch(`${BaseUrl}/user/payment/${adId}`);
            if (res.ok) {
                const data = await res.json();
                orderId = data.data.order_id
                return data.data.payment_session_id;
            } else {
                console.log("Error:", res.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const verifyPayment = async (adId) => {
        try {
            const res = await fetch(`${BaseUrl}/user/payment/verfy/${orderId}/${adId}`);

            if (res.ok) {
                const data = await res.json();
                console.log(data, ">>>>>>>>data");

                if (data.data.order_status === "PAID") {
                    alert("Payment verified");
                }
                fetchAds()
            } else {
                console.log("Error:", res.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClick = async (adId) => {
        try {
            const sessionId = await getSessionId(adId);
            console.log(sessionId, "=====>");

            if (cashfree) {
                const checkoutOptions = {
                    paymentSessionId: sessionId,
                    redirectTarget: "_modal",
                };

                cashfree.checkout(checkoutOptions)
                    .then(() => {
                        console.log("Payment Initialized");
                    }).then(() => {
                        verifyPayment(adId)
                    })
                    .catch((error) => {
                        console.error("Error during checkout:", error);
                        toast.error("Payment initialization failed");
                    });
            } else {
                toast.error("Payment gateway not initialized");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred during payment processing");
        }
    };
    const fetchAds = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BaseUrl}/user/allad/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setAds(data.data);
                setDisable(data.data.paynow);
            } else {
                toast.error(data.message || 'Failed to fetch advertisements');
                if (data.message === "TokenExpiredError: jwt expired") {
                    localStorage.clear()
                    Navigate('/login')
                }
            }
        } catch (error) {
            toast.error('Something went wrong while fetching ads');
        } finally {
            setLoading(false);
        }
    };

    const invoice = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BaseUrl}/getall/invoice/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setInvoiceAll(data.data);
                setShowInvoice(true);
            } else {
                toast.error(data.message || 'Failed to fetch invoices');
            }
        } catch (error) {
            toast.error('Something went wrong while fetching invoices');
        } finally {
            setLoading(false);
        }
    };

    const toggleInvoices = () => {
        setView('invoices');
        invoice();
    };

    useEffect(() => {
        fetchAds();
    }, [userId]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!poster) {
            toast.error("Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('ad_duration', duration);
        formData.append('price', price);
        formData.append('poster', poster);
        formData.append('phone', phone)

        try {
            setLoading(true);
            const response = await fetch(`${BaseUrl}/user/ad`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Advertisement added successfully');
                setTitle('');
                setPoster(null);
                setDuration('7');
                setPrice(999);
                handleCloseModal();
                fetchAds();
            } else {
                toast.error(data.message || 'Failed to add advertisement');
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later');
        } finally {
            setLoading(false);
        }
    };

    const handleDurationChange = (e) => {
        const selectedDuration = e.target.value;
        setDuration(selectedDuration);

        if (selectedDuration === '7') {
            setPrice(999);
        } else if (selectedDuration === '15') {
            setPrice(1899);
        } else if (selectedDuration === '30') {
            setPrice(3799);
        }
    };

    const fetchFilteredAds = async (filter) => {
        setLoading(true);
        try {
            const response = await fetch(`${BaseUrl}/user/adFilter/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const filteredAds = filter === 'active' ? data.data.active : filter === 'pending' ? data.data.pending : data.data;
                setAds(filteredAds);
            } else {
                toast.error(data.message || 'Failed to fetch advertisements');
            }
        } catch (error) {
            toast.error('Something went wrong while fetching ads');
        } finally {
            setLoading(false);
        }
    };

    const handleClickfilter = (filter) => {
        setCurrentFilter(filter);
        fetchFilteredAds(filter);
        setView('adsss');
    };

    return (
        <>
            <div className='mb-5'>
                <BlogHead display={"none"} />
            </div>

            <section className='Blog'>
                <div className='container mb-4'>
                    <div className='d-flex justify-content-between align-items-center mb-5'>
                        <p className='blog-total mb-0'>All({ads.length})</p>
                        <button
                            className='new-post-btn d-flex justify-content-center align-items-center'
                            onClick={handleOpenModal}
                        >
                            <span className='fs-4'>+</span> New Advertisement
                        </button>
                    </div>

                    <div className='d-flex gap-3 mb-5'>
                        <button className='btn btn-warning' onClick={() => handleClickfilter('pending')}>Pending</button>
                        <button className='btn btn-success' onClick={() => handleClickfilter('active')}>Active</button>
                        <button className='btn btn-success' onClick={toggleInvoices}>Invoice</button>
                    </div>

                    {view === 'adsss' && ads.length === 0 ? (
                        <h3 className='text-center'>No advertisements found.</h3>
                    ) : view === 'adsss' ? (
                        ads.map((ad) => (
                            <div className='blog-main mb-4' key={ad._id}>
                                <div className='d-flex justify-content-md-between flex-wrap align-items-center'>
                                    <div className='d-flex gap-4 align-items-center'>
                                        <div className='title'>
                                            <img
                                                src={ad.poster || "default-image-url"}
                                                className='Blog-title-image'
                                                alt="Advertisement"
                                            />
                                        </div>
                                        <div>
                                            <p className='blog-name mb-1'>{ad.title}</p>
                                            <p className='blog-publish mb-0'>Published On {new Date(ad.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center gap-3'>
                                        {ad.paymentClear ? (
                                            <button className='btn btn-secondary' disabled>
                                                Paid
                                            </button>
                                        ) : (
                                            <button className='btn btn-success' disabled={!ad.paynow} onClick={() => handleClick(ad._id)}>
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : null}

                    {view === 'invoices' && invoiceall.length === 0 ? (
                        <h3 className='text-center'>No Invoice found.</h3>
                    ) : view === 'invoices' ? (
                        invoiceall.map((invoiceItem) => (
                            <div className='blog-main mb-4' key={invoiceItem._id}>
                                <div className='d-flex justify-content-md-between flex-wrap align-items-center'>
                                    <div className='d-flex gap-4 align-items-center'>
                                        <div className='title'>
                                            <img
                                                src={invoiceItem.poster || "default-image-url"}
                                                className='Blog-title-image'
                                                alt="Advertisement"
                                            />
                                        </div>
                                        <div>
                                            <p className='blog-name mb-1'>{invoiceItem.title}</p>
                                            <p className='blog-publish mb-0'>Price : {invoiceItem.price}</p>
                                            <p className='blog-publish mb-0'>phone : {invoiceItem.phone}</p>
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center gap-3'>
                                        <Link to={`/invoice/${invoiceItem._id}`}>
                                            <button className='btn btn-success' >Download Invoice</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : null}
                </div>
            </section>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Create New Advertisement</h2>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Phone">Phone No</label>
                                <input
                                    type="text"
                                    id="number"
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                                            setphone(inputValue);
                                        }
                                    }}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Poster</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="poster"
                                    accept="image/*"
                                    required
                                    onChange={(e) => setPoster(e.target.files[0])}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="duration">Duration</label>
                                <select
                                    id="duration"
                                    name="ad_duration"
                                    value={duration}
                                    onChange={handleDurationChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="7">7 days</option>
                                    <option value="15">15 days</option>
                                    <option value="30">30 days</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    value={price}
                                    disabled
                                    className="form-input"
                                />
                            </div>
                            <div className="modal-actions d-flex justify-content-between">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Create Advertisement"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />

        </>
    );
};

export default Advertisement;
