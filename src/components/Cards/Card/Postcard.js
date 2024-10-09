import React, { useEffect, useState } from 'react';
import './Postcard.css';
import { CiShare2 } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BaseUrl } from '../../services/Url';

const Postcard = ({ post }) => {
  const [liked, setLiked] = useState(false);  // To store like status
  const [count, setCount] = useState(0);  // To store like count
  const [showFullDescription, setShowFullDescription] = useState(false);  // To toggle description
  const Navigate = useNavigate();

  // Function to handle the like/unlike action
  const toggleLike = async (blogId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      Navigate("/login");
      return;
    }

    // Define the like/unlike API endpoint with blogId and userId
    const likeUrl = `${BaseUrl}/user/blog/like/unlike/${blogId}/${userId}`;

    try {
      // Perform the API call
      const response = await fetch(likeUrl, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      const result = await response.json();
      console.log('Like/Unlike response:', result);

      // Check if the current userId is in the like array and update the liked state
      if (result.data.like.includes(userId)) {
        setLiked(true);
      } else {
        setLiked(false);
      }

      // Optionally refetch the like count after updating
      LikeCount(blogId);
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  // Function to fetch the current like count
  const LikeCount = async (blogId) => {
    try {
      const res = await fetch(`${BaseUrl}/user/blog/likeCounts/${blogId}`);
      const data = await res.json();
      setCount(data.data);  // Assuming 'data.data' contains the like count
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  // Check if the user has liked the post when the component mounts
  const checkUserLikedStatus = async () => {
    const userId = localStorage.getItem("userId");
    if (post.like.includes(userId)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  };

  // Fetch like count and check if the user has liked the post on component mount
  useEffect(() => {
    LikeCount(post._id);  // Fetch like count
    checkUserLikedStatus();  // Check if the user has already liked the post
  }, [post._id]);

  // Function to toggle full description visibility
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
            <span>{count} Likes</span>
            <span onClick={() => toggleLike(post._id)} className="like-icon">
              {liked ? <FaHeart className='liked' /> : <FaRegHeart />}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Postcard;
