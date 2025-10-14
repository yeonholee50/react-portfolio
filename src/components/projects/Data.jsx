import Project1 from "../../assets/ampyfin.webp";
import Project2 from "../../assets/val.webp";
import Project3 from "../../assets/ampy-proto.png";
import Project4 from "../../assets/ampy-obs.png";
import Project5 from "../../assets/yfinance-go.png";
import Project6 from "../../assets/ampy-config.png";
import Project7 from "../../assets/ampy-bus.png";
import Project8 from "../../assets/nyxhub.webp";
import Project9 from "../../assets/leetcodetwitter.webp";
import Project10 from "../../assets/minidog.webp";
import Project11 from "../../assets/jin.webp";

export const projectsData = [
    {
        id: 1,
        image: Project1,
        link: "https://ampyfin.com/",
        title: "OSS AmpyFin",
        category: "AmpyFin",
        github: "https://github.com/AmpyFin/ampyfin",
        description: "AmpyFin is a nonprofit, open-source project dedicated to developing tools for the investing community. As the best-value, long-term investing research tool, we emphasize valuation, evidence-based backtests, and explainable outputs—not copy-trading. Our mission is to help investors learn, make informed decisions, and spend less time on screens and more time living. The platform keeps subsystem code open while maintaining safety through a private orchestration layer. We never trade on anyone's behalf and prioritize education, transparency, and user control.",
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
        link: "https://pkg.go.dev/github.com/AmpyFin/ampy-proto",
        title: "Ampy-Proto",
        category: "AmpyFin",
        github: "https://github.com/AmpyFin/ampy-proto",
        description: "Cross-language Protobuf schemas for AmpyFin serving as a single source of truth for trading data including bars, ticks, FX, news, orders, fills, positions, and metrics. Features bindings in Python, Go, and C++ with precision-focused scaled decimals, proper time discipline, and comprehensive metadata for traceability. Built with semantic versioning and backward compatibility in mind.",
        tech: ["Protocol Buffers", "Python", "Go", "C++", "CMake", "Financial Data"]
    },
    {
        id: 4,
        image: Project4,
        link: "https://pkg.go.dev/github.com/AmpyFin/ampy-observability/go/ampyobs",
        title: "Ampy-Observability",
        category: "AmpyFin",
        github: "https://github.com/AmpyFin/ampy-observability",
        description: "Uniform observability infrastructure for AmpyFin providing Go & Python SDKs for JSON logging, metrics collection, and distributed tracing. Includes a ready-to-run observability stack with OpenTelemetry, Prometheus, and Grafana for comprehensive monitoring and debugging of trading systems.",
        tech: ["OpenTelemetry", "Prometheus", "Grafana", "Go", "Python", "Distributed Tracing"]
    },
    {
        id: 5,
        image: Project5,
        link: "https://pkg.go.dev/github.com/AmpyFin/yfinance-go",
        title: "yfinance-go",
        category: "AmpyFin",
        github: "https://github.com/AmpyFin/yfinance-go",
        description: "A high-performance Go implementation for fetching financial data from Yahoo Finance. Designed to provide reliable and efficient market data retrieval for the AmpyFin ecosystem, supporting various financial instruments and time series data with proper error handling and rate limiting.",
        tech: ["Go", "Yahoo Finance API", "Financial Data", "HTTP Client", "Rate Limiting"]
    },
    {
        id: 6,
        image: Project6,
        link: "https://pkg.go.dev/github.com/AmpyFin/ampy-config/go/ampyconfig",
        title: "Ampy-Config",
        category: "AmpyFin",
        github: "https://github.com/AmpyFin/ampy-config",
        description: "Typed configuration and secrets management façade for AmpyFin featuring schema validation, layered configuration, secret redaction, and hot-reloading capabilities via NATS/JetStream. Supports both Python and optional Go implementations for flexible deployment scenarios.",
        tech: ["Python", "Go", "NATS", "JetStream", "Configuration Management", "Schema Validation"]
    },
    {
        id: 7,
        image: Project7,
        link: "https://pkg.go.dev/github.com/AmpyFin/ampy-bus/cmd/ampybusctl",
        title: "Ampy-Bus",
        category: "AmpyFin",
        github: "https://github.com/AmpyFin/ampy-bus",
        description: "Transport-agnostic messaging contracts and helpers for AmpyFin providing Protobuf envelopes, NATS/Kafka bindings, dead letter queue handling, replay capabilities, and comprehensive metrics. Includes SDKs for both Go and Python to enable reliable inter-service communication.",
        tech: ["Go", "Python", "NATS", "Kafka", "Protocol Buffers", "Message Queue"]
    },
    {
        id: 8,
        image: Project8,
        link: "https://nyxhub.shop/",
        title: "NyxHub",
        category: "NyxHub",
        github: "https://github.com/yeonholee50/NyxHub",
        description: "A secure web file sharing application designed for safe and efficient file transfers. Built with React, MongoDB, and Flask, NyxHub supports various file types including media, PDFs, documents, and images. Users can sign up, login, and share files with peers by communicating usernames, with robust security features including audit logs and user management.",
        tech: ["React", "MongoDB", "Flask", "JWT", "REST API"]
    },
    {
        id: 9,
        image: Project9,
        link: "https://leetcodetwitter.onrender.com/",
        title: "LeetCode Twitter",
        category: "LeetCode Twitter",
        github: "https://github.com/yeonholee50/LeetCodeTwitter",
        description: "A functional social media platform inspired by a LeetCode system design problem, bringing the coding challenge solution to life. Features include login/signup, posting tweets, following/unfollowing users, and viewing a personalized news feed. Built using React, MongoDB, JWT authentication, CORS, and FastAPI to create a lightweight, interactive application.",
        tech: ["React", "MongoDB", "FastAPI", "JWT", "CORS"]
    },
    {
        id: 10,
        image: Project10,
        link: "https://youtu.be/8eoaaHSm4mU",
        title: "MiniDog",
        category: "MiniDog",
        github: "https://github.com/yeonholee50/MiniDog",
        description: "An innovative robot designed for cost-effective luggage transportation. MiniDog uses a Raspberry Pi and proximity sensors to calculate hand movement speed and adjust its pace accordingly. The Arduino-based control system includes a wireless remote controller backup. This project won 1st place at the CS 3651 robotics showcase for its smooth and reliable functionality.",
        tech: ["Raspberry Pi", "Arduino", "Python", "Sensors", "Robotics"]
    },
    {
        id: 11,
        image: Project11,
        link: "https://slackbot-5i97.onrender.com/",
        title: "Jin Slackbot",
        category: "Jin",
        github: "https://github.com/yeonholee50/Jin",
        description: "A feature-rich Slackbot designed to streamline workflows and enhance productivity through MongoDB integration. Jin supports message management, database interactions, notifications, and data insights. Built with Python and Slack's API, it offers functionalities like querying MongoDB data, setting reminders, creating polls, and visualizing data for a customizable assistant experience.",
        tech: ["Python", "Slack API", "MongoDB", "Data Visualization", "Automation"]
    }
];

export const projectsNav = [];