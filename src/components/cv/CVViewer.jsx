import React from 'react';
import './cv.css';

const CVViewer = () => {
  return (
    <div className="cv-viewer-container">
      <div className="cv-viewer-header">
        <h1 className="cv-viewer-title">Resume</h1>
        <a 
          href="/resume.pdf" 
          download="Yeon_Lee_Resume.pdf" 
          className="cv-download-btn"
        >
          Download PDF
        </a>
      </div>
      <div className="cv-viewer-content">
        <iframe
          src="/resume.pdf"
          title="Resume"
          className="cv-iframe"
          type="application/pdf"
        />
      </div>
    </div>
  );
};

export default CVViewer;

