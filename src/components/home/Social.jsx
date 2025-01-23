import React from "react";
import { FiTwitter, FiGithub, FiLinkedin} from "react-icons/fi";

const Social = () => {
    return (
        <div className="home__social">
            <a href="https://x.com/YeonLee326780" className="home__social-icon" target="_blank" rel="noreferrer" >
                <FiTwitter />
            </a>
            <a href="https://www.github.com/yeonholee50" className="home__social-icon" target="_blank" rel="noreferrer" >
                <FiGithub />
            </a>
            <a href="https://www.linkedin.com/in/yeon-lee/" className="home__social-icon" target="_blank" rel="noreferrer" >
                <FiLinkedin />
            </a>
        </div> 
    ); 
}

export default Social;