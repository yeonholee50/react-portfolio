import React from 'react';
import "./skills.css";
import ProgrammingLanguages from './ProgrammingLanguages';
import Technologies from './Technologies';
import DatabaseCloud from './DatabaseCloud';
import MachineLearning from './MachineLearning';
import Infrastructure from './Infrastructure';
import Tools from './Tools';

const Skills = () => {
  return (
    <section className="skills section" id="skills">
        <h2 className="section__title">Skills</h2>
        <span className="section__subtitle">Technical Expertise</span>
        <div className="skills__container container grid">
            <ProgrammingLanguages />
            <Technologies /> 
            <DatabaseCloud />
            <MachineLearning />
            <Infrastructure />
            <Tools />
        </div>
    </section>
  );
}

export default Skills;