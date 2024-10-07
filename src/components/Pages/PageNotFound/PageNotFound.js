import React from 'react';
import { useNavigate } from 'react-router-dom'; // Update to useNavigate
import './PageNotFound.css'; // Import a CSS file for styling

const PageNotFound = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  return (
    <div className="page-not-found">
      <div className="content">
        <h1 className="error-code">404</h1>
        <h2 className="message">Oops! Page Not Found</h2>
        <p className="description">
          Sorry, the page you are looking for does not exist. 
          You can go back to the homepage or explore other sections.
        </p>
        <button className="home-button" onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
