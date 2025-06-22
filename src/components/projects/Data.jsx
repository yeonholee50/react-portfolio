import Project1 from "../../assets/ampyfin.webp";
import Project2 from "../../assets/nyxhub.webp";
import Project3 from "../../assets/leetcodetwitter.webp";
import Project4 from "../../assets/minidog.webp";
import Project5 from "../../assets/jin.webp";

export const projectsData = [
    {
        id: 1,
        image: Project1,
        link: "https://ampyfin.com/",
        title: "AmpyFin Trading System",
        category: "AmpyFin",
        github: "https://github.com/AmpyFin/ampyfin",
        description: "A sophisticated trading platform leveraging high-fidelity market data from Data Bento across 6 Oracle Cloud clusters. Features include automated NASDAQ-100 trading strategies, optional Dockerized deployments, and a proprietary backtesting library powering seven production ensemble models. The system has delivered 30%+ year-to-date returns, outperforming market benchmarks and attracting partnership inquiries from hedge funds and trading firms.",
        tech: ["Oracle Cloud", "Docker", "Python", "Machine Learning", "Data Bento API"]
    },
    {
        id: 2,
        image: Project2,
        link: "https://nyxhub.shop/",
        title: "NyxHub",
        category: "NyxHub",
        github: "https://github.com/yeonholee50/NyxHub",
        description: "A secure web file sharing application designed for safe and efficient file transfers. Built with React, MongoDB, and Flask, NyxHub supports various file types including media, PDFs, documents, and images. Users can sign up, login, and share files with peers by communicating usernames, with robust security features including audit logs and user management.",
        tech: ["React", "MongoDB", "Flask", "JWT", "REST API"]
    },
    {
        id: 3,
        image: Project3,
        link: "https://leetcodetwitter.onrender.com/",
        title: "LeetCode Twitter",
        category: "LeetCode Twitter",
        github: "https://github.com/yeonholee50/LeetCodeTwitter",
        description: "A functional social media platform inspired by a LeetCode system design problem, bringing the coding challenge solution to life. Features include login/signup, posting tweets, following/unfollowing users, and viewing a personalized news feed. Built using React, MongoDB, JWT authentication, CORS, and FastAPI to create a lightweight, interactive application.",
        tech: ["React", "MongoDB", "FastAPI", "JWT", "CORS"]
    },
    {
        id: 4,
        image: Project4,
        link: "https://youtu.be/1oapv1quKkc",
        title: "MiniDog",
        category: "MiniDog",
        github: "https://github.com/yeonholee50/MiniDog",
        description: "An innovative robot designed for cost-effective luggage transportation. MiniDog uses a Raspberry Pi and proximity sensors to calculate hand movement speed and adjust its pace accordingly. The Arduino-based control system includes a wireless remote controller backup. This project won 1st place at the CS 3651 robotics showcase for its smooth and reliable functionality.",
        tech: ["Raspberry Pi", "Arduino", "Python", "Sensors", "Robotics"]
    },
    {
        id: 5,
        image: Project5,
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