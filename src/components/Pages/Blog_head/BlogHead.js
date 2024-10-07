import React, { useState } from 'react';
import logo from '../../Images/BlogLogo.png';
import { Link, useNavigate } from 'react-router-dom';
import './BlogHead.css';
import { IoSearchSharp } from "react-icons/io5";

const BlogHead = ({ onSearch }) => {  
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('profile'); 
    localStorage.removeItem('userId'); 
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Call the onSearch function passed from parent when search input changes
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <>
      <section className='BlogHead'>
        <div className="container-fluid">
          <div className='d-flex justify-content-between align-items-center'>
            <Link className="navbar-brand" to={"/"}>
              <img src={logo} alt='logo' width="100%" height="50px" />
            </Link>
            <div className='mx-auto position-relative input-main'>
              <input
                type="search"
                className='form-control search_filed'
                placeholder='Search Posts'
                value={searchValue}  
                onChange={handleSearchChange}  // Trigger search on input change
              />
              <span className='search-icon-blog position-absolute'>
                <IoSearchSharp className='fs-5' />
              </span>
            </div>
            <div className='profile-logo'>
              <img src={localStorage.getItem("profile")} className='profile-image' height={"50px"} width={"50px"} alt="" />
            </div>
            <button className='btn' onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogHead;
