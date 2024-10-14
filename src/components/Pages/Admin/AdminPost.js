import React, { useEffect, useState, useCallback } from 'react';
import AdminHeader from './AdminHeader';
import { BaseUrl } from '../../services/Url';
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import './AdminPost.css';
import debounce from 'lodash.debounce'; // Ensure lodash.debounce is installed
import { FaEye } from 'react-icons/fa';

const AdminPost = () => {
    const [blogs, setBlogs] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Function to fetch all blogs
    const fetchAllBlogs = async () => {
        setIsFetching(true);
        try {
            const response = await fetch(`${BaseUrl}/user/alluserpost`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }

            const data = await response.json();
            setBlogs(data.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            // Optionally, set an error state here to display to the user
        } finally {
            setIsFetching(false);
        }
    };

    // Function to search blogs by title
    const searchBlogs = async (query) => {
        if (!query) {
            fetchAllBlogs();
            return;
        }

        setIsFetching(true);
        try {
            const response = await fetch(`${BaseUrl}/admin/blog/find?title=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to search blogs');
            }

            const data = await response.json();
            if (data.success) {
                setBlogs(data.data);
            } else {
                setBlogs([]); // Or handle according to your API's response structure
            }
        } catch (error) {
            console.error("Error searching blogs:", error);
            // Optionally, set an error state here to display to the user
        } finally {
            setIsFetching(false);
        }
    };

    // Debounced version of the search function
    const debouncedSearch = useCallback(debounce(searchBlogs, 500), [token]);

    useEffect(() => {
        fetchAllBlogs();
        // Cleanup debounce on unmount
        return () => {
            debouncedSearch.cancel();
        };
    }, [userId, token, debouncedSearch]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        debouncedSearch(value);
    };

    const handleDeleteClick = async (blogId, e) => {
        e.stopPropagation();
        setDeletingId(blogId);

        try {
            const response = await fetch(`${BaseUrl}/user/deletepost/${blogId}`, {
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });

            if (response.ok) {
                setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
                // Optionally, show a success message to the user
            } else {
                console.error("Failed to delete the blog");
                // Optionally, show an error message to the user
            }
        } catch (error) {
            console.error("Error deleting the blog:", error);
            // Optionally, show an error message to the user
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section className='admin-section'>
            <AdminHeader />
            <section className='blog-section adminBlog mt-2'>
                <div className='container mb-4'>
                    <input
                        type="search"
                        className='form-control search-input mb-3'
                        placeholder='Search Blogs'
                        value={searchValue}
                        onChange={handleSearchChange}
                    />

                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <p className='blog-total mb-0'>All ({blogs?.length})</p>
                        {/* Optionally, add more controls or information here */}
                    </div>

                    {isFetching ? (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>
                    ) : blogs?.length > 0 ? (
                        blogs.map((blog) => (
                            <div key={blog._id} className='blog-main mb-4'>
                                <div className='d-flex justify-content-md-between flex-wrap align-items-center blog-content-wrapper'>
                                    <div className='d-flex gap-4 align-items-center'>
                                        <div className='title'>
                                            <img src={blog.blogimg} className='Blog-title-image' alt="Title" />
                                        </div>
                                        <div>
                                            <p className='blog-name mb-1'>{blog.title}</p>
                                            <p className='blog-publish mb-0'>
                                                Published <span className='ms-2'>{new Date(blog.date).toLocaleDateString()}</span>
                                            </p>
                                            <p className='blog-publish mt-2'>Created By : {blog.userId.username.charAt(0).toUpperCase() + blog.userId.username.slice(1)}</p>
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center gap-3 me-3'>
                                        {deletingId === blog._id ? (
                                            <div className="spinner"></div>
                                        ) : (
                                            <span onClick={(e) => handleDeleteClick(blog._id, e)} role="button" aria-label="Delete Blog">
                                                <MdDelete className='fs-4 delete-icon' />
                                            </span>
                                        )}
                                        <Link className="text-decoration-none text-black" to={`/AdminView/${blog._id}`}>
                                            <FaEye className='fs-4' />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h5 className='text-center Europa_Bold'>No Blogs Found.</h5>
                    )}
                </div>
            </section>
        </section>
    )
}

export default AdminPost;
