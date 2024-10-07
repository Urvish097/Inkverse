import React, { useState } from 'react';
import './Postcard.css';
import { CiShare2 } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Postcard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    // Here you can also handle API calls to persist the like status
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="postcard-card">
      <div className="postcard-image-container">
        <img src={post.blogimg} alt={post.title} className="postcard-image" />
        <div className="postcard-overlay">
          <Link to={`/Profile/${post._id}`} className="postcard-view-btn">View Post</Link>
        </div>
      </div>
      <div className="postcard-content">
        <div className="postcard-header">
          <div className="postcard-user">
            {post.userId?.profile ? (
              <img src={post.userId.profile} alt={post.name} className="postcard-user-image" />
            ) : (
              <div className="postcard-user-placeholder"></div>
            )}
            <div>
              <h5 className="postcard-username">{post.name}</h5>
              <span className="postcard-date">{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="postcard-share">
            <CiShare2 className="share-icon" /> {post.shareCount || '0'} Shares
          </div>
        </div>
        <h2 className="postcard-title">{post.title}</h2>
        <p className={`postcard-description ${showFullDescription ? 'expanded' : ''}`}>
          {post.maindescription || ''}
        </p>
        {post.maindescription && post.maindescription.length > 150 && (
          <button className="read-more-btn" onClick={toggleDescription}>
            {showFullDescription ? 'Show Less' : 'Read More'}
          </button>
        )}
        <div className="postcard-footer">
          <div className="postcard-likes">
            <span>{post.likes || '0'} Likes</span>
            <span onClick={toggleLike} className="like-icon">
              {liked ? <FaHeart className='liked' /> : <FaRegHeart />}
            </span>
          </div>
          {/* Add any additional footer content here */}
        </div>
      </div>
    </div>
  );
};

export default Postcard;
