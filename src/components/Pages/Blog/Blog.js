import React, { useEffect, useState } from 'react';
import BlogHead from '../Blog_head/BlogHead';
import './Blog.css';
import { MdDelete } from "react-icons/md";
import { IoMdShare } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { BaseUrl } from '../../services/Url';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState(null);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${BaseUrl}/user/userpost/${userId}`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setBlogs(data.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        fetchBlogs();
    }, [userId, token]);

    // Handle search functionality from BlogHead component
    const handleSearch = async (searchValue) => {

        if (!searchValue) {
            // If search value is empty, fetch all blogs again
            const fetchBlogs = async () => {
                try {
                    const response = await fetch(`${BaseUrl}/user/userpost/${userId}`, {
                        method: "GET",
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();
                    setBlogs(data.data);
                } catch (error) {
                    console.error("Error fetching blogs:", error);
                }
            };
            fetchBlogs();
            return;
        }

        try {
            const response = await fetch(`${BaseUrl}/user/find/blog?title=${searchValue}&userId=${userId}`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setBlogs(data.data);  // Update blogs based on the search result
            }
        } catch (error) {
            console.error("Error searching blogs:", error);
        }
    };

    const handleDeleteClick = async (blogId, e) => {
        e.stopPropagation();
        setLoading(true);
        setLoadingId(blogId);

        try {
            const response = await fetch(`${BaseUrl}/user/deletepost/${blogId}`, {
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });

            if (response.ok) {
                setBlogs(blogs.filter(blog => blog._id !== blogId));
            } else {
                console.error("Failed to delete the blog");
            }
        } catch (error) {
            console.error("Error deleting the blog:", error);
        } finally {
            setLoading(false);
            setLoadingId(null);
        }
    };

    const handleEditClick = (blog) => {
        navigate('/CreateBlog', { state: { blog } });
    };

    return (
        <>
            <div className='mb-5'>
                <BlogHead onSearch={handleSearch} /> 
            </div>
            <section className='Blog'>
                <div className='container mb-4'>
                    <div className='d-flex justify-content-between align-items-center mb-5'>
                        <p className='blog-total mb-0'>All({blogs?.length})</p>
                        <button className='btn new-post-btn d-flex justify-content-center align-items-center'>
                            <Link className='text-decoration-none text-black' to={"/CreateBlog"}>
                                <span className='fs-4'>+</span> New Post
                            </Link>
                        </button>
                    </div>
                    {blogs?.length > 0 ? (
                        blogs?.map((blog) => (
                            <div key={blog._id} className='blog-main mb-4'>
                                <div className='d-flex justify-content-md-between flex-wrap align-items-center'>
                                    <div className='d-flex gap-4 align-items-center'>
                                        <div className='title'>
                                            <img src={blog.blogimg} className='Blog-title-image' alt="Title-image" />
                                        </div>
                                        <div>
                                            <p className='blog-name mb-1'>{blog.title}</p>
                                            <p className='blog-publish mb-0'>Published <span className='ms-2'>{new Date(blog.date).toLocaleDateString()}</span></p>
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center gap-3'>
                                        {loading && loadingId === blog._id ? (
                                            <div className="spinner"></div>
                                        ) : (
                                            <>
                                                <span onClick={(e) => handleDeleteClick(blog._id, e)} role="button" aria-label="Delete Blog">
                                                    <MdDelete className='fs-4' />
                                                </span>
                                                <span onClick={() => handleEditClick(blog)} role="button" aria-label="Edit Blog">
                                                    <FaEdit className='fs-4' />
                                                </span>
                                                <span><IoMdShare className='fs-4' /></span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h5 className='text-center Europa_Bold'>No Blogs Found.</h5>
                    )}
                </div>
            </section>
        </>
    );
};

export default Blog;
