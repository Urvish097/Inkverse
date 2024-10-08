import React, { useEffect, useState } from 'react';
import Header from '../../Header/Header';
import "./Profile.css";
import { CiShare2 } from 'react-icons/ci';
import Postcard from '../../Cards/Card/Postcard';
import { Post } from '../../Data/Data';
import { useParams } from 'react-router-dom';
import { BaseUrl } from '../../services/Url';


const Profile = () => {

    const [showAll, setShowAll] = useState(false);
    const [Blog, setBlog] = useState({});

    const handleToggle = () => {
        setShowAll(!showAll);
    };
    const { blogId } = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${BaseUrl}/user/view/blogs/post/${blogId}`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                const data = await response.json();
                setBlog(data.data)
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchPosts();
    }, [blogId]);
    console.log(Blog, "===>blog");

    return (
        <>
            <div className='mb-5'>
                <Header bg={"black"} btn_white={"white"} btn_text={"black"} logo={"50px"} />
            </div>


            <section>
                <div className="container px-0">
                    <div className="blogsingle_hero text-white p-sm-4 p-2 d-flex justify-content-sm-end justify-content-center flex-column" style={{ backgroundImage: `url(${Blog.blogimg})` }}>
                        <h1 className="europa_bold text-uppercase">
                            {Blog.title}
                        </h1>
                        <p className="fs-sm-4 fs-5 europa_reg">
                            {Blog.maindescription}
                        </p>
                        <div className="d-flex flex-wrap">
                            <p className="me-4">by {Blog.name}</p>
                            <p className="me-4">{new Date(Blog.date).toDateString()}</p>
                            <p className="me-4">
                                {" "}
                                <CiShare2 />
                                1K shares
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="container">
                    <div className="abot_blog">
                        <h2>Tincidunt veni tellus orci aenean consectetuer</h2>
                        <p>
                            {Blog.adddescription1}
                        </p>
                        <div>
                            <img src={Blog.additionalimg} className='bolg-add-image-1' alt="" width={"100%"} height={"100%"} />
                        </div>
                        <p>
                            Sociis consequat adipiscing sit curabitur donec sem luctus cras
                            natoque vulputate dolor eget dapibus. Nec vitae eros ullamcorper
                            laoreet dapibus mus ac ante viverra. A aenean sit augue curabitur
                            et parturient nisi sed enim. Nulla nec quis sit quisque sem
                            commodo ultricies neque. Lorem eget venenatis dui ante luctus
                            ultricies tellus montes. Quis in sapien tempus.
                        </p>
                        <h2>Eu ridiculus fringilla</h2>
                        <p>
                            {Blog.adddescription2}
                        </p>
                        <div className="blog_img">
                            <div className="row justify-content-center">
                                {Blog?.additionalimg?.map((item) => (
                                    <div className="col-md-4 col-sm-12">
                                        <img src={item} className='profile-add-image w-100 mb-5' alt="" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="mb-0">
                            Venenatis ante veni nullam ridiculus penatibus vidi eu
                            consectetuer integer. Vulputate ipsum lorem nascetur rhoncus.
                            Aliquam vitae elit blandit enim eget laoreet. Dapibus leo sociis
                            quis nulla adipiscing amet integer sem ullamcorper in maecenas eu
                            imperdiet.
                        </p>
                        <p className="mb-0">
                            Ante blandit amet ultricies ut in nam massa rhoncus. Eget eu massa
                            nisi quis viverra dapibus aliquam. Id ridiculus lorem ut amet dis
                            orci tellus etiam aenean pellentesque.
                        </p>
                        <p>
                            Maecenas tempus aenean nulla viverra neque vel nec cras justo
                            sapien condimentum ut varius. Blandit sem etiam vel nullam
                            vulputate sociis amet varius dolor. Vitae a ut. Etiam rhoncus ante
                            sit. Nisi nullam donec dui eu phasellus a elementum elit faucibus
                            nec. Eros eu pulvinar pede luctus sit aenean lorem.
                        </p>
                    </div>
                </div>
            </section>

            <section className="subscribe_main">
                <div className="container">
                    <div className="subscribe text-white">
                        <h2 className="mb-3">Sign Up for Our Newsletters</h2>
                        <p>Get notified of the best deals on our WordPress themes.</p>
                        <div className="position-relative subscribe_fild">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="form-control py-3 fs-4"
                            />
                            <button className="subscribe_btn position-absolute btn btn-light border fs-5 px-4 py-2">
                                Subscribe
                            </button>
                        </div>
                        <div className="d-flex align-items-center mt-3 gap-3">
                            <input type="checkbox" />
                            <p className="mb-0">
                                By checking this box, you confirm that you have read and are
                                agreeing to our terms of use regarding the storage of the data
                                submitted through this form.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container">
                    <div className="blogs sec-2 my-5">
                        <div className="row justify-content-center">
                            {Post.slice(0, showAll ? Post.length : 3).map((item, index) => (
                                <div className='col-lg-4 col-md-6' key={index}>
                                    <Postcard post={item} />
                                </div>
                            ))}
                        </div>
                        <button
                            className="load-btn europa_bold bg-white"
                            onClick={handleToggle}
                        >
                            {showAll ? "Show Less" : "Load More"}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Profile;