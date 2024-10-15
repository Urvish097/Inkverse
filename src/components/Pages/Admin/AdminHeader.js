import React from 'react';
import "./Admin.css";
import Logo from '../../Images/Logo.png';
import { IoHomeSharp } from 'react-icons/io5';
import { FaUsers, FaNewspaper, FaSignOutAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const AdminHeader = () => {
    const handleLogout = () => {
        localStorage.removeItem("admintoken")
    };

    return (
        <aside className="admin-sidebar">
            <div className="logo-container">
                <img src={Logo} className="logo" alt="Logo" />
            </div>
            <nav className="nav-menu">
                <NavLink
                    to="/Adminpanel"
                    className={({ isActive }) =>
                        isActive ? 'menu-item active-menu-item text-decoration-none text-white' : 'menu-item text-decoration-none text-white'
                    }
                >
                    <IoHomeSharp className="icon" /> Dashboard
                </NavLink>
                <NavLink
                    to="/AdminUser"
                    className={({ isActive }) =>
                        isActive ? 'menu-item active-menu-item text-decoration-none text-white' : 'menu-item text-decoration-none text-white'
                    }
                >
                    <FaUsers className="icon" /> Users
                </NavLink>
                <NavLink
                    to="/Adminpost"
                    className={({ isActive }) =>
                        isActive ? 'menu-item active-menu-item text-decoration-none text-white' : 'menu-item text-decoration-none text-white'
                    }
                >
                    <FaNewspaper className="icon" /> Blogs
                </NavLink>
                <button onClick={handleLogout} className="logout-button">
                    <FaSignOutAlt className="logout-icon" /> Logout
                </button>
            </nav>
        </aside>
    );
}

export default AdminHeader;
