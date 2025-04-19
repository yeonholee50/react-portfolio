import React, { useState } from 'react';
import { BiLinkExternal, BiCodeAlt } from 'react-icons/bi';

const ProjectItems = ({ item }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    const handleNavigation = (url) => {
      window.open(url, "_blank");
    };
  
    return (
      <div className="project__card" key={item.id} onMouseEnter={() => setShowDetails(true)} onMouseLeave={() => setShowDetails(false)}>
        <div className="project__card-inner">
          <div className="project__img-container">
            <img className="project__img" src={item.image} alt={item.title} />
            <div className={`project__overlay ${showDetails ? 'show-overlay' : ''}`}>
              <div className="project__description">{item.description}</div>
            </div>
          </div>
          
          <div className="project__content">
            <h3 className="project__title">{item.title}</h3>
            
            <div className="project__tech-stack">
              {item.tech && item.tech.map((tech, index) => (
                <span key={index} className="project__tech-badge">{tech}</span>
              ))}
            </div>
            
            <div className="project__buttons">
              <button
                onClick={() => handleNavigation(item.link)}
                className="project__button"
                aria-label="View Demo"
              >
                <span>Demo</span>
                <BiLinkExternal className="project__button-icon" />
              </button>
              
              <button
                onClick={() => handleNavigation(item.github)}
                className="project__button"
                aria-label="View Github"
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
  