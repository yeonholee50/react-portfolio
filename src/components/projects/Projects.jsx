import React, { useEffect, useState } from 'react';
import { projectsData } from "./Data";
import { projectsNav } from './Data';
import ProjectCarousel from './ProjectCarousel';

const Projects = () => {
    // Since we removed navigation, just use all projects directly
    const projects = projectsData;

    return (
        <div>
            <ProjectCarousel projects={projects} />
        </div>
    );
}

export default Projects;