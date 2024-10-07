import React from 'react';
import './Footer.css';
import { FaFacebook, FaPinterestSquare, FaYoutube } from "react-icons/fa";
import { IoLogoInstagram, IoLogoTwitter } from "react-icons/io";

const Footer = () => {
    return (
        <>
            <footer>
                <div className='container'>

                    <div className='d-flex justify-content-center justify-content-md-between  flex-wrap align-items-center'>
                        <div>
                            <p className='text-white Europa_Reg mb-4 mb-md-0'>Designed & Developed By <span className='fw-bold mx-1'> XP DESIGN</span></p>
                        </div>
                        <div className='d-flex gap-4'>
                            <span className='text-white icon'><FaFacebook className='fs-5 text-white mb-1' />29K</span>
                            <span className='text-white icon'><IoLogoTwitter className='fs-5 text-white mb-1' />70K</span>
                            <span className='text-white icon'><IoLogoInstagram className='fs-5 text-white mb-1' />40K</span>
                            <span className='text-white icon'><FaPinterestSquare className='fs-5 text-white rounded-5 mb-1' />13K</span>
                            <span className='text-white icon'><FaYoutube className='fs-5 text-white mb-1' />168k</span>
                        </div>

                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer