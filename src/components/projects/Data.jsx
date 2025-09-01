import Project1 from "../../assets/ampyfin.webp";
import Project2 from "../../assets/val.webp";
import Project3 from "../../assets/nyxhub.webp";
import Project4 from "../../assets/leetcodetwitter.webp";
import Project5 from "../../assets/minidog.webp";
import Project6 from "../../assets/jin.webp";

export const projectsData = [
    {
        id: 1,
        image: Project1,
        link: "https://ampyfin.com/",
        title: "AmpyFin Trading System",
        category: "AmpyFin",
        github: "https://github.com/AmpyFin/ampyfin",
        description: "AmpyFin is an organization, not a business—a nonprofit, open-source community project giving retail investors transparent, horizon-aligned guidance. Our platform keeps subsystem code open while a private orchestration layer handles safety and delivery. Decision systems emit standardized JSON (timestamps, IDs, hashes), predictive and reactive market-condition scores shape capital exposure, and dynamic fine-tuning adjusts subsystem weights to each user's cadence. We never trade on anyone's behalf and prioritize education, privacy, and user control.",
        tech: ["Oracle Cloud", "Docker", "Python", "Machine Learning", "Data Bento API"]
    },
    {
        id: 2,
        image: Project2,
        link: "https://ampyfin.com/",
        title: "Val System",
        category: "AmpyFin",
        github: "https://github.com/AmpyFin/Val",
        description: "A modular, adapter-driven equity valuation engine that pulls metrics from pluggable sources and runs proven strategies (DCF, EPV, Residual Income, etc.) through a simple pipeline to output consensus fair value with optional live GUI and UDP broadcast. Built with Python and PyQt5, featuring pluggable adapters for different data providers and extensible valuation strategies.",
        tech: ["Python", "PyQt5", "Financial Modeling", "UDP Broadcasting", "MongoDB", "Equity Analysis"]
    },
    {
        id: 3,
        image: Project3,
        link: "https://nyxhub.shop/",
        title: "NyxHub",
        category: "NyxHub",
        github: "https://github.com/yeonholee50/NyxHub",
        description: "A secure web file sharing application designed for safe and efficient file transfers. Built with React, MongoDB, and Flask, NyxHub supports various file types including media, PDFs, documents, and images. Users can sign up, login, and share files with peers by communicating usernames, with robust security features including audit logs and user management.",
        tech: ["React", "MongoDB", "Flask", "JWT", "REST API"]
    },
    {
        id: 4,
        image: Project4,
        link: "https://leetcodetwitter.onrender.com/",
        title: "LeetCode Twitter",
        category: "LeetCode Twitter",
        github: "https://github.com/yeonholee50/LeetCodeTwitter",
        description: "A functional social media platform inspired by a LeetCode system design problem, bringing the coding challenge solution to life. Features include login/signup, posting tweets, following/unfollowing users, and viewing a personalized news feed. Built using React, MongoDB, JWT authentication, CORS, and FastAPI to create a lightweight, interactive application.",
        tech: ["React", "MongoDB", "FastAPI", "JWT", "CORS"]
    },
    {
        id: 5,
        image: Project5,
        link: "https://youtu.be/1oapv1quKkc",
        title: "MiniDog",
        category: "MiniDog",
        github: "https://github.com/yeonholee50/MiniDog",
        description: "An innovative robot designed for cost-effective luggage transportation. MiniDog uses a Raspberry Pi and proximity sensors to calculate hand movement speed and adjust its pace accordingly. The Arduino-based control system includes a wireless remote controller backup. This project won 1st place at the CS 3651 robotics showcase for its smooth and reliable functionality.",
        tech: ["Raspberry Pi", "Arduino", "Python", "Sensors", "Robotics"]
    },
    {
        id: 6,
        image: Project6,
        link: "https://slackbot-5i97.onrender.com/",
        title: "Jin Slackbot",
        category: "Jin",
        github: "https://github.com/yeonholee50/Jin",
        description: "A feature-rich Slackbot designed to streamline workflows and enhance productivity through MongoDB integration. Jin supports message management, database interactions, notifications, and data insights. Built with Python and Slack's API, it offers functionalities like querying MongoDB data, setting reminders, creating polls, and visualizing data for a customizable assistant experience.",
        tech: ["Python", "Slack API", "MongoDB", "Data Visualization", "Automation"]
    }
];

export const projectsNav = [
    {
        name: "All",
    },
    {
        name: "AmpyFin",
    },
    {
        name: "NyxHub",
    },
    {
        name: "LeetCode Twitter",
    },
    {
        name: "MiniDog",
    },
    {
        name: "Jin",
    }
];