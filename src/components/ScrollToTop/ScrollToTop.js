import React, { useEffect, useState, useRef } from 'react';
import { FaAngleUp } from 'react-icons/fa';
import './ScrollToTop.css'; // Import external CSS for animation

const ScrollToTop = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const timerRef = useRef(null);

    const handleScroll = () => {
        const position = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (position / totalHeight) * 100;
        setScrollPosition(scrollProgress);

        // Show button when user has scrolled down 100px
        if (position > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }

        // Reset scrolling state and timer
        setIsUserScrolling(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsUserScrolling(false), 2000); // Hide button after 2 seconds of inactivity
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <button
            className={`scroll-to-top ${isVisible && isUserScrolling ? 'visible' : 'hidden'}`}
            onClick={scrollToTop}
            style={{
                background: `conic-gradient(black ${scrollPosition}%, #d3d3d3 ${scrollPosition}%)`,
            }}
        >
            <FaAngleUp />
        </button>
    );
};

export default ScrollToTop;
