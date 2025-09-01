import React from 'react';
import Projects from './Projects';
import "./projects.css";

const Portfolio = () => {
  return (
    <section className="portfolio section" id="portfolio">
        <div className="portfolio__header">
          <h2 className="section__title portfolio__title">
            <span className="portfolio__title-word">My</span>
            <span className="portfolio__title-word">Playground</span>
          </h2>
          <span className="section__subtitle portfolio__subtitle">Building for fun, one project at a time ✨</span>
        </div>

        <Projects />
    </section>
  );
}

export default Portfolio;