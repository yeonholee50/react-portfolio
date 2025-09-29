import React from 'react';
import { BiLinkExternal, BiCodeAlt } from 'react-icons/bi';

const ProjectItems = ({ item }) => {
    const handleNavigation = (url) => {
      window.open(url, "_blank");
    };

    // Check if this is an ampy project that needs upper-left positioning
    const isAmpyProject = ['Ampy-Proto', 'Ampy-Observability', 'Ampy-Bus'].includes(item.title);
    const imgClass = `project__img ${isAmpyProject ? 'project__img--ampy' : ''}`;
  
    return (
      <div 
        className="project__card" 
        key={item.id}
        style={{
          background: 'var(--container-color)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="project__card-inner" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="project__img-container" style={{ position: 'relative', overflow: 'hidden', borderRadius: '1rem 1rem 0 0' }}>
            <img 
              className={imgClass} 
              src={item.image} 
              alt={item.title}
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                transition: 'transform 0.5s ease'
              }}
            />
          </div>
          
          <div className="project__content" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <h3 className="project__title" style={{ fontSize: 'var(--h3-font-size)', fontWeight: 'var(--font-medium)', marginBottom: '1rem', color: 'var(--title-color)' }}>
              {item.title}
            </h3>
            
            <div className="project__description-card" style={{ fontSize: 'var(--small-font-size)', color: 'var(--text-color)', lineHeight: 1.6, marginBottom: '1rem' }}>
              {item.description}
            </div>
            
            <div className="project__tech-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {item.tech && item.tech.map((tech, index) => (
                <span 
                  key={index} 
                  className="project__tech-badge"
                  style={{
                    background: 'var(--gradient-secondary)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: 'var(--smaller-font-size)',
                    fontWeight: 'var(--font-medium)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="project__buttons" style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
              <button
                onClick={() => handleNavigation(item.link)}
                className="project__button"
                aria-label="View Demo"
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'var(--font-medium)',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>Demo</span>
                <BiLinkExternal className="project__button-icon" />
              </button>
              
              <button
                onClick={() => handleNavigation(item.github)}
                className="project__button"
                aria-label="View Github"
                style={{
                  background: 'var(--gradient-secondary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'var(--font-medium)',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>Github</span>
                <BiCodeAlt className="project__button-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProjectItems;
  