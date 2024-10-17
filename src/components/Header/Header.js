import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Images/Logo.png';
import './Header.css';
import { Navbar } from "../Data/Data";
import { IoIosSearch } from "react-icons/io";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = (props) => {

    const navigate = useNavigate()
    // const userStatus = localStorage.getItem("status");

    const HaldelStatus = () => {
        // if (userStatus === "Pending") {
        //     toast.error("Your status is pending. You cannot create a Blog yet.", { autoClose: 3000 });
        // } else if (userStatus === "Block") {
        //     toast.error("Your Block by Admin. You cannot create a Blog Post", { autoClose: 3000 });
        // } else {
        // }
        navigate("/blog");
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: props.bg }}>
                <div className="container-lg container-fluid">
                    <Link className="navbar-brand"><img src={logo} className='logo' alt="Logo" style={{ height: props.logo }} /></Link>
                    <button className="navbar-toggler bg-white btn menu-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-text inter fw-bold text-black">Menu</span>
                    </button>
                    <div className="offcanvas offcanvas-start bg-black" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel"><img src={logo} className='smlogo' alt="Logo" /></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 menu-border">
                                {Navbar.map((item, index) => (
                                    <li className="nav-item" key={index}>
                                        <Link to={"/"} className="nav-link text-white Europa_Bold menu mb-2 mb-md-0" aria-current="page">{item.Name}</Link>
                                    </li>
                                ))}
                            </ul>
                            <div class="d-flex align-items-center gap-4 create_blog_main_btn">
                                <IoIosSearch className='text-white fs-4' />
                                <button className='btn  SegoeUI blog-btn fs-6 rounded-0' onClick={HaldelStatus} data-bs-dismiss="offcanvas" aria-label="Close" style={{ backgroundColor: props.btn_white, color: props.btn_text }}><Link className='text-decoration-none create-btn' style={{ color: props.btn_text }}>CREATE A BLOG</Link></button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <ToastContainer />
        </>
    );
}

export default Header;
