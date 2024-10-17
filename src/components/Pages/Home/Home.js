import React, { useEffect, useState } from 'react';
import Header from '../../Header/Header';
import './Home.css';
import Postcard from '../../Cards/Card/Postcard';
import Descard from '../../Cards/Descard/Descard';
import { Categary, Destination } from '../../Data/Data';
import { BaseUrl } from '../../services/Url';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [showAll, setShowAll] = useState(false);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${BaseUrl}/user/alluserpost`, {
                    method: "GET"
                });
                const data = await response.json();
                if (data.success) {
                    setPosts(data.data);
                } else {
                    console.error('Failed to fetch blogs:', data.message);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchPosts();
    }, []);

    const [selectedCategory, setSelectedCategory] = useState("Business");
    const [categoryData, setCategoryData] = useState([]);

    const fetchCategoryBlogs = async (category) => {
        try {
            const response = await fetch(`${BaseUrl}/user/category/blog`);
            const data = await response.json();

            if (response.ok) {
                setCategoryData(data.data[category]);
            } else {
                console.error("Error fetching blogs:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const filteredData = selectedCategory
        ? categoryData.filter((item) => item.category === selectedCategory)
        : categoryData;

    useEffect(() => {
        fetchCategoryBlogs(selectedCategory);
    }, [selectedCategory]);

    const handleToggle = () => {
        setShowAll(!showAll);
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 500,
        autoplay: true,
        arrows: false,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <>
            <section className='sec-1'>
                <div className='bg_hero position-relative'>
                    <div className='position-absolute header_main w-100'>
                        <Header />
                    </div>
                    <div className='container-fluid'>
                        <div className='text-center'>
                            <h1 className='text-white Europa_Bold mb-0 travel'>INSIGHTS AND STORIES FROM EVERYDAY LIVES</h1>
                            <p className='text-white book Europa_Reg mb-3'>Discover unique perspectives and personal journeys</p>
                            <button className='btn bg-white border-0 rounded-0 Europa_Bold trip-btn'>Start Exploring the Stories</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className='sec-2'>
                <div className='container'>
                    <div className='row justify-content-center'>
                        {posts.slice(0, showAll ? posts.length : 3).map((post, index) => (
                            <div className='col-lg-4 col-md-6' key={index}>
                                <Postcard post={post} />
                            </div>
                        ))}
                    </div>
                    {posts.length > 3 && (
                        <div className='d-flex justify-content-center mt-3'>
                            <button className='load-btn Europa_Bold bg-white' onClick={handleToggle}>
                                {showAll ? 'Show Less' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section className='sec-3'>
                <div className='container-fluid container-lg'>
                    <div className='bg'>
                        <div className='bg-text-container text-center container'>
                            <span className='Europa_Bold travel text-white'>Blog</span>
                            <h2 className='text-white Europa_Bold about mb-2 mt-2'>Ricird Norton Sharing Real-Life Experiences</h2>
                            <p className='Europa_Reg text-white about-des mb-3'>
                                Progressively inspire unique stories and insights through engaging narratives. Dive into thought-provoking content that sparks conversations.
                            </p>
                            <button className='Europa_Bold plannig-btn'>Explore the Stories</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className='advertisement-section mb-3'>
                <div className='container'>
                    <Slider {...settings} className='advertisement-slider mb-3'>
                        <div className='slide'>
                            <img
                                className='advertisement-image'
                                src="https://i.ytimg.com/vi/tYcxuRZfB0g/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB0oZUmYfpDp5MR3w1hkVKVLJzfqA"
                                alt="Advertisement 1"
                            />
                        </div>
                        <div className='slide'>
                            <img
                                className='advertisement-image'
                                src="https://rukminim2.flixcart.com/image/720/864/km0x5zk0/board-game/s/7/9/ww-challengers-raw-deal-travel-board-game-holiday-game-great-for-original-imagfysdvn5xyqkh.jpeg?q=60&crop=false"
                                alt="Advertisement 2"
                            />
                        </div>
                        <div className='slide'>
                            <img
                                className='advertisement-image'
                                src="https://media.licdn.com/dms/image/v2/D5622AQH6jilI799vOw/feedshare-shrink_800/feedshare-shrink_800/0/1712901058383?e=2147483647&v=beta&t=F9H8AQFOaUNbv7AlleGr53vEVfaOQN1tvtOs8oQl3DM"
                                alt="Advertisement 3"
                            />
                        </div>
                    </Slider>
                    <div className='text-center'>
                        <Link className='btn btn-primary btn-lg' to={"/Advertisement"}>Advertise Now</Link>
                    </div>
                </div>
            </section>

            <section className='sec-4'>
                <div className='container'>
                    <h1 className='Europa_Bold'>Top Destinations</h1>
                    <p className='Europa_Bold fw-medium mb-5'>Tick one more destination off of your bucket list with one of our most popular vacation in 2022</p>
                    <div className='row justify-content-center'>
                        {Destination.map((item) => (
                            <div className='col mb-3'>
                                <div>
                                    <Descard Des={item} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className='sec-5'>
                <div className="container">
                    <div className="category">
                        {/* Category Buttons */}
                        <div className="d-lg-flex d-none gap-xl-5 gap-lg-4 flex-wrap justify-content-center category_name mb-4">
                            {[
                                "Business",
                                "Education",
                                "Food",
                                "Arts",
                                "Fashion",
                                "Entertainment",
                            ].map((category) => (
                                <p
                                    key={category}
                                    className={`mb-2 fw-bold fs-5 ${selectedCategory === category ? "activecategory" : ""
                                        }`}
                                    onClick={() => setSelectedCategory(category)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {category}
                                </p>
                            ))}
                        </div>

                        <div className="d-flex gap-xl-5 gap-lg-4 flex-wrap justify-content-center mb-3 category_name d-lg-none">
                            <h5 className='mb-4'>Select Category</h5>
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="" disabled>
                                    Select Category
                                </option>
                                {Categary.map((item) => (
                                    <option key={item.name} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Blog Posts */}
                        {categoryData.length > 0 ? (
                            <div className="row justify-content-between gap-3 gap-lg-0">
                                <div className="col-lg-6">
                                    <div className="category_left border p-3">
                                        <div className="category_left_img">
                                            <img src={categoryData[0].blogimg} className='blog-fliterimage-1' alt="" />
                                        </div>
                                        <p className="mt-4 europa_reg">
                                            {new Date(categoryData[0].date).toDateString()}
                                        </p>
                                        <h4 className="europa_bold">{categoryData[0].title}</h4>
                                        <p className="mt-3 europa_reg">
                                            {categoryData[0].maindescription}
                                        </p>
                                        <Link
                                            to={`/Profile/${categoryData[0]._id}`}
                                            className="text-decoration-none europa_bold text-black border-bottom border-black pb-2"
                                        >
                                            View Post
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-12">
                                    {categoryData.length > 1 ? (
                                        <div className="category_right border">
                                            {categoryData.slice(1, 5).map((item) => (
                                                <Link
                                                    to={`/Profile/${item._id}`}
                                                    className="text-decoration-none text-black"
                                                    key={item._id}
                                                >
                                                    <div
                                                        className="row py-3 mx-2 border-bottom align-items-center"
                                                        key={item._id}
                                                    >
                                                        <div className="col-sm-5 ps-2 ps-lg-0 ps-xl-2 ">
                                                            <img
                                                                src={item.blogimg}
                                                                alt=""
                                                                width="100%"
                                                                className="category_side_img"
                                                            />
                                                        </div>
                                                        <div className="col-sm-7 px-0 category_right_inner">
                                                            <h4 className="europa_bold">{item.title}</h4>
                                                            <p className="europa_reg mb-0">
                                                                {new Date(item.date).toDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center mt-5 notfound">
                                            No Selected Category Blog Found
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center mt-5 notfound">
                                No Selected Category Blog Found
                            </p>
                        )}
                    </div>
                </div>
            </section>

        </>
    );
};

export default Home;
