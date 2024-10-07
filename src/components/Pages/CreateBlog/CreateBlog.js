// src/components/CreateBlog/CreateBlog.jsx

import React, { useState, useEffect } from 'react';
import './CreateBlog.css';
import { Categary } from "../../Data/Data"; // Ensure Categary is an array of objects with a 'name' property
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateBlog = () => {
    const location = useLocation();
    const blogToEdit = location.state?.blog;
    const username = localStorage.getItem("username");

    const [formData, setFormData] = useState({
        name: blogToEdit ? blogToEdit.name : username,
        title: blogToEdit ? blogToEdit.title : '',
        category: blogToEdit ? blogToEdit.category : '',
        date: blogToEdit ? new Date(blogToEdit.date).toISOString().split('T')[0] : '',
        maindescription: blogToEdit ? blogToEdit.maindescription : '',
        adddescription1: blogToEdit ? blogToEdit.adddescription1 : '',
        adddescription2: blogToEdit ? blogToEdit.adddescription2 : '',
    });

    const [mainImagePreview, setMainImagePreview] = useState(blogToEdit ? blogToEdit.blogimg : null);
    const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Initialize additional images preview if editing
    useEffect(() => {
        if (blogToEdit?.additionalimg) {    
            setAdditionalImagesPreview(blogToEdit.additionalimg);
        }
    }, [blogToEdit]);

    // Cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (mainImagePreview) {
                URL.revokeObjectURL(mainImagePreview);
            }
            additionalImagesPreview.forEach(img => URL.revokeObjectURL(img));
        };
    }, [mainImagePreview, additionalImagesPreview]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // Handle main image upload and preview
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Revoke previous object URL if exists
            if (mainImagePreview) {
                URL.revokeObjectURL(mainImagePreview);
            }
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle additional images upload and preview
    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setAdditionalImagesPreview(prevImages => [...prevImages, ...filePreviews]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("Form Data Object:", formData);

            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            const formDataObj = new FormData();
            const mainImage = e.target.elements.blogimg?.files[0];
            const additionalImages = e.target.elements.additionalimg?.files;

            // Append main image if exists
            if (mainImage) {
                formDataObj.append('blogimg', mainImage);
            }

            // Append additional images if exist
            if (additionalImages) {
                for (let i = 0; i < additionalImages.length; i++) {
                    formDataObj.append('additionalimg', additionalImages[i]);
                }
            }

            // Append other form data
            for (const key in formData) {
                formDataObj.append(key, formData[key]);
            }

            // Debugging: Log FormData entries
            for (let pair of formDataObj.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            // Determine API endpoint and method based on whether editing or creating
            const url = blogToEdit
                ? `http://localhost:5000/user/updatepost/${blogToEdit._id}/${userId}`  // Adjust based on your blog ID field
                : 'http://localhost:5000/blog/blog-data';
            const method = blogToEdit ? 'PUT' : 'POST';

            // Fetch API call
            const response = await fetch(url, {
                method: method,
                headers: {
                    authorization: `Bearer ${token}`,
                    // **Do not set 'Content-Type' when using FormData**
                },
                body: formDataObj,
            });

            const data = await response.json();
            setLoading(false);

            // Handle the response based on success or error
            if (response.ok) {
                toast.success(data.message, { position: "top-right" });
                setTimeout(() => navigate('/'), 1000);
            } else {
                toast.error(data.message, { position: "top-right" });
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.message || 'An error occurred.', { position: "top-right" });
        }
    };

    return (
        <section className='CreateBlog'>
            {/* Loading Spinner */}
            <div className={`loader-overlay ${loading ? 'd-flex' : 'd-none'}`}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>

            <div className="container mt-5">
                <div className="card p-4 shadow-sm">
                    <h2 className="text-center mb-4">{blogToEdit ? 'Update Blog' : 'Create A New Blog'}</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={true}
                            />
                        </div>

                        {/* Title Field */}
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Category Field */}
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select
                                className="form-select"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {Categary.map(category => (
                                    <option key={category.name} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Field */}
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Main Description Field */}
                        <div className="mb-3">
                            <label htmlFor="maindescription" className="form-label">Main Description</label>
                            <textarea
                                className="form-control"
                                id="maindescription"
                                name="maindescription"
                                rows="4"
                                value={formData.maindescription}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        {/* Additional Description 1 Field */}
                        <div className="mb-3">
                            <label htmlFor="adddescription1" className="form-label">Additional Description 1</label>
                            <textarea
                                className="form-control"
                                id="adddescription1"
                                name="adddescription1"
                                rows="4"
                                value={formData.adddescription1}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {/* Additional Description 2 Field */}
                        <div className="mb-3">
                            <label htmlFor="adddescription2" className="form-label">Additional Description 2</label>
                            <textarea
                                className="form-control"
                                id="adddescription2"
                                name="adddescription2"
                                rows="4"
                                value={formData.adddescription2}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {/* Main Image Upload */}
                        <div className="mb-3">
                            <label htmlFor="blogimg" className="form-label">Main Image</label>
                            <input
                                type="file"
                                className="form-control"
                                id="blogimg"
                                name="blogimg"
                                accept="image/*"
                                onChange={handleMainImageChange}
                            />
                        
                        </div>
                        
                        {/* Additional Images Upload */}
                        <div className="mb-3">
                            <label htmlFor="additionalimg" className="form-label">Additional Images</label>
                            <input
                                type="file"
                                className="form-control"
                                id="additionalimg"
                                name="additionalimg"
                                accept="image/*"
                                multiple
                                onChange={handleAdditionalImagesChange}
                            />
                           
                        </div>

                        {/* Submit Button */}
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Submitting...' : blogToEdit ? 'Update Blog' : 'Submit Blog'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toast Notifications */}
            <ToastContainer />
        </section>
    );
};

export default CreateBlog;
