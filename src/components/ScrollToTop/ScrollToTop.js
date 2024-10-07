import React, { useEffect, useState } from 'react';
import { FaAngleUp } from 'react-icons/fa';

const ScrollToTop = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

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
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <button
        
        className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
            onClick={scrollToTop}
            style={{
                background: `conic-gradient(black ${scrollPosition}%, #d3d3d3 ${scrollPosition}%)`
            }}
        >
            <FaAngleUp/>
        </button>
    );
};

export default ScrollToTop;
