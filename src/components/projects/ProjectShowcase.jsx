import React, { useState, useEffect } from 'react';
import './ProjectShowcase.css';

const ProjectShowcase = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div 
      className="project-showcase"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className={`cursor-glow ${isHovering ? 'cursor-glow--active' : ''}`}
        style={{
          left: mousePosition.x - 25,
          top: mousePosition.y - 25,
        }}
      />
      <div className="project-showcase__grid">
        {children}
      </div>
    </div>
  );
};

export default ProjectShowcase;
