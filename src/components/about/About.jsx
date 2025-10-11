import React from 'react';
import "./about.css";
import AboutImg from "../../assets/aboutBW.jpeg";
import CV from "../../assets/resume.pdf";
import Info from "./Info";

const About = () => {
  return (
    <section className="about section" id="about">
        <h2 className="section__title">About Me</h2>
        <span className="section__subtitle">as a Software Engineer</span>
        <div className="about__container container grid">
            <img src={AboutImg} alt="about" className="about__img" />
            <div className="about__data">
                <Info />
                <p className="about__description">
                    Hi, I'm Yeon. I'm passionate about developing products that can change the world for the better. What excites me most is building things that truly matter and make people's lives better. I contribute to open source projects that are essential to my work and use them as a way to continuously learn and grow. I genuinely enjoy Friday evening coding sessions while listening to EDM music—there's something magical about solving problems when the world gets quiet. When I'm not coding, you'll probably find me playing <a href="https://www.chess.com/member/yeonholee50" target="_blank" rel="noopener noreferrer" style={{color: 'var(--title-color)', textDecoration: 'underline'}}>chess</a> online or cooking international cuisine in my kitchen—everything from Spanish paella to Japanese katsu, empanadas, Korean buckwheat noodles, and more. I love exploring new flavors and techniques from different cultures.
                </p>
                <p className="about__description">
                    My proudest project is <a href="https://github.com/AmpyFin" target="_blank" rel="noopener noreferrer" style={{color: 'var(--title-color)', textDecoration: 'underline'}}>AmpyFin</a>—a nonprofit, open-source project where I experiment with new technology and continuously learn outside of work. It's where I've had the privilege to collaborate with an incredible community: research students from prestigious universities, representatives from trading firms, asset analysts, and passionate individuals interested in the stock market. AmpyFin strives to be the best-value, long-term investing research tool, emphasizing valuation, evidence-based backtests, and explainable outputs—not copy-trading. Our nonprofit mission is to help investors learn, decide, and then spend less time on screens and more time living.
                </p>
                <p className="about__description about__statement">
                    I'm not afraid of being left behind—I'm excited about what I can build with the emerging technologies of tomorrow. Every new framework, every breakthrough, every innovation is an opportunity to create something that didn't exist yesterday and solve problems we haven't even discovered yet.
                </p>
                     
                <a download="" href={CV} className="button button--flex">
                    Download CV
                    <svg
                        className="button__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        >
                        <path
                            d="M15.25 22.7502H9.25C3.82 22.7502 1.5 20.4302 1.5 15.0002V9.00024C1.5 3.57024 3.82 1.25024 9.25 1.25024H14.25C14.66 1.25024 15 1.59024 15 2.00024C15 2.41024 14.66 2.75024 14.25 2.75024H9.25C4.64 2.75024 3 4.39024 3 9.00024V15.0002C3 19.6102 4.64 21.2502 9.25 21.2502H15.25C19.86 21.2502 21.5 19.6102 21.5 15.0002V10.0002C21.5 9.59024 21.84 9.25024 22.25 9.25024C22.66 9.25024 23 9.59024 23 10.0002V15.0002C23 20.4302 20.68 22.7502 15.25 22.7502Z"
                            fill="var(--container-color)"
                        ></path>
                        <path
                            d="M22.25 10.7502H18.25C14.83 10.7502 13.5 9.42023 13.5 6.00023V2.00023C13.5 1.70023 13.68 1.42023 13.96 1.31023C14.24 1.19023 14.56 1.26023 14.78 1.47023L22.78 9.47023C22.99 9.68023 23.06 10.0102 22.94 10.2902C22.82 10.5702 22.55 10.7502 22.25 10.7502ZM15 3.81023V6.00023C15 8.58023 15.67 9.25023 18.25 9.25023H20.44L15 3.81023Z"
                            fill="var(--container-color)"
                        ></path>
                        <path
                            d="M13.25 13.7502H7.25C6.84 13.7502 6.5 13.4102 6.5 13.0002C6.5 12.5902 6.84 12.2502 7.25 12.2502H13.25C13.66 12.2502 14 12.5902 14 13.0002C14 13.4102 13.66 13.7502 13.25 13.7502Z"
                            fill="var(--container-color)"
                        ></path>
                        <path
                            d="M11.25 17.7502H7.25C6.84 17.7502 6.5 17.4102 6.5 17.0002C6.5 16.5902 6.84 16.2502 7.25 16.2502H11.25C11.66 16.2502 12 16.5902 12 17.0002C12 17.4102 11.66 17.7502 11.25 17.7502Z"
                            fill="var(--container-color)"
                        ></path>
                    </svg>
                </a>
            </div>
        </div>
    </section>
  );
}

export default About;