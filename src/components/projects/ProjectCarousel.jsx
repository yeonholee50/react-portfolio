import React, { useState, useEffect, useRef } from 'react';
import { BiChevronLeft, BiChevronRight, BiPlay, BiPause } from 'react-icons/bi';
import ProjectItems from './ProjectItems';
import './ProjectCarousel.css';

const ProjectCarousel = ({ projects }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const intervalRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    // Create infinite loop by duplicating projects
    const infiniteProjects = [...projects, ...projects, ...projects];
    const projectWidth = 350 + 32; // card width + gap
    const centerOffset = projects.length * projectWidth;

    // Auto-play functionality
    useEffect(() => {
        if (isAutoPlaying && !isHovered && !isScrolling && projects && projects.length > 0) {
            intervalRef.current = setInterval(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollBy({
                        left: projectWidth,
                        behavior: 'smooth'
                    });
                }
            }, 3000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isAutoPlaying, isHovered, isScrolling, projects, projectWidth]);

    // Initialize scroll position to center
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = centerOffset;
            setScrollPosition(centerOffset);
        }
    }, [centerOffset]);

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        setScrollPosition(scrollLeft);
        setIsScrolling(true);

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Set timeout to detect when scrolling stops
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
        }, 150);

        // Handle infinite loop - seamless transitions
        const maxScroll = projects.length * projectWidth * 2;
        const minScroll = 0;

        console.log('Scroll position:', scrollLeft, 'Max scroll:', maxScroll, 'Center offset:', centerOffset);

        // Disable smooth scrolling temporarily for the jump
        if (scrollLeft >= maxScroll) {
            console.log('Jumping from end to beginning');
            const container = scrollContainerRef.current;
            container.style.scrollBehavior = 'auto';
            const newPosition = centerOffset + (scrollLeft - maxScroll);
            container.scrollLeft = newPosition;
            setScrollPosition(newPosition);
            console.log('New position:', newPosition);
            // Re-enable smooth scrolling
            setTimeout(() => {
                container.style.scrollBehavior = 'smooth';
            }, 10);
        } else if (scrollLeft <= minScroll) {
            console.log('Jumping from beginning to end');
            const container = scrollContainerRef.current;
            container.style.scrollBehavior = 'auto';
            const newPosition = centerOffset + scrollLeft;
            container.scrollLeft = newPosition;
            setScrollPosition(newPosition);
            console.log('New position:', newPosition);
            // Re-enable smooth scrolling
            setTimeout(() => {
                container.style.scrollBehavior = 'smooth';
            }, 10);
        }
    };

    const nextSlide = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: projectWidth,
                behavior: 'smooth'
            });
        }
    };

    const prevSlide = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -projectWidth,
                behavior: 'smooth'
            });
        }
    };


    const toggleAutoPlay = () => {
        setIsAutoPlaying(!isAutoPlaying);
    };

    // Calculate current project index based on scroll position
    const getCurrentIndex = () => {
        const relativePosition = scrollPosition - centerOffset;
        const index = Math.round(relativePosition / projectWidth);
        return ((index % projects.length) + projects.length) % projects.length;
    };

    // Safety check: Don't render if no projects
    if (!projects || projects.length === 0) {
        return (
            <div className="project-carousel">
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)' }}>
                    No projects to display
                </div>
            </div>
        );
    }

    return (
        <div 
            className="project-carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Carousel Header */}
            <div className="carousel-header">
                <div className="carousel-controls">
                    <button 
                        className="carousel-btn prev-btn"
                        onClick={prevSlide}
                        aria-label="Previous project"
                    >
                        <BiChevronLeft />
                    </button>
                    
                    <button 
                        className={`carousel-btn play-btn ${isAutoPlaying ? 'playing' : 'paused'}`}
                        onClick={toggleAutoPlay}
                        aria-label={isAutoPlaying ? 'Pause carousel' : 'Play carousel'}
                    >
                        {isAutoPlaying ? <BiPause /> : <BiPlay />}
                    </button>
                    
                    <button 
                        className="carousel-btn next-btn"
                        onClick={nextSlide}
                        aria-label="Next project"
                    >
                        <BiChevronRight />
                    </button>
                </div>
            </div>

            {/* Horizontal Scrolling Carousel */}
            <div className="carousel-scroll-container">
                <div 
                    className="carousel-scroll-track"
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                >
                    {infiniteProjects.map((project, index) => (
                        <div key={`${project.id}-${index}`} className="carousel-scroll-item">
                            <ProjectItems item={project} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Counter */}
            <div className="project-counter">
                <span className="current-project">{getCurrentIndex() + 1}</span>
                <span className="separator">/</span>
                <span className="total-projects">{projects.length}</span>
            </div>
        </div>
    );
};

export default ProjectCarousel;
