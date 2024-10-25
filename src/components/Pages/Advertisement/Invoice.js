import React, { useEffect, useState } from 'react';
import './invoice.css';
import { useParams } from 'react-router-dom';

const Invoice = () => {
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hide, sethide] = useState(false)

    const { adId } = useParams();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await fetch(`http://localhost:5000/invoice/${adId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch invoice');
                }

                const data = await response.json();
                setInvoiceData(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [adId]);

    const handelhide = () => {
        window.print()
        sethide(true)
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const paymentDetails = invoiceData.payment.length > 0 ? invoiceData.payment[0] : null;

    return (
        <div className="invoice-container">
            <div className="invoice-header">
                <img
                    src={invoiceData.userId?.profile || "fallback_image_url.jpg"}
                    alt="Profile"
                    className="invoice-profile"
                />
                <div className="invoice-header-details">
                    <h1>Invoice</h1>
                    <p className="invoice-date">Date: {new Date(invoiceData.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="invoice-body">
                <div className="invoice-details">
                    <h2>Customer Details</h2>
                    <table className="invoice-table">
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td>{invoiceData.userId?.fname}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{invoiceData.userId?.email}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{invoiceData.phone}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="invoice-details">
                    <h2>Advertisement Details</h2>
                    <table className="invoice-table">
                        <tbody>
                            <tr>
                                <th>Title</th>
                                <td>{invoiceData.title}</td>
                            </tr>
                            <tr>
                                <th>Duration</th>
                                <td>{invoiceData.ad_duration} days</td>
                            </tr>
                            <tr>
                                <th>Price</th>
                                <td>₹{invoiceData.price}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="invoice-payment">
                    <h2>Payment Details</h2>
                    {paymentDetails ? (
                        <table className="invoice-table">
                            <tbody>
                                <tr>
                                    <th>Order ID</th>
                                    <td>{paymentDetails.order_id}</td>
                                </tr>
                                <tr>
                                    <th>Amount</th>
                                    <td>₹{paymentDetails.order_amount}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>No payment details available.</p>
                    )}
                </div>
            </div>

            <div className='text-end'>
                <button className='btn btn-success print-hide' onClick={() => window.print()}>Download</button>
            </div>
        </div>
    );
};

export default Invoice;
