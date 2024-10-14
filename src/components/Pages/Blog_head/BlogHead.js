import React, { useEffect, useState } from 'react';
import logo from '../../Images/BlogLogo.png';
import { Link, useNavigate } from 'react-router-dom';
import './BlogHead.css';
import { IoSearchSharp } from "react-icons/io5";
import { BaseUrl } from '../../services/Url';

const BlogHead = ({ onSearch }) => {

  const [userData, setUserData] = useState({});
  const token = localStorage.getItem('token');

  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (onSearch) {
      onSearch(value);
    }

  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${BaseUrl}/user/userprofile/data`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log(data.data, ">>>>>>>>data");

        if (response.ok) {
          setUserData(data.data);
        } else {
          console.error('Error fetching profile data:', data.message);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchUserProfile();
  }, [token]);

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
                onChange={handleSearchChange}
              />
              <span className='search-icon-blog position-absolute'>
                <IoSearchSharp className='fs-5' />
              </span>
            </div>
            <div className='profile-logo'>
              <Link to={"/UserProfile"}>
                <img src={userData.profile} className='profile-image' height={"50px"} width={"50px"} alt="" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogHead;
