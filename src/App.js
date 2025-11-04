import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/home/Home';
import About from './components/about/About';
import Skills from './components/skills/Skills';
import Qualification from './components/qualification/Qualification';
import Contact from './components/contact/Contact';
import Footer from './components/footer/Footer';
import ScrollUp from './components/scrollup/ScrollUp';
import Portfolio from './components/projects/Portfolio';
import PasswordProtection from './components/projects/PasswordProtection';
import AManProject from './components/projects/AManProject';
import CVViewer from './components/cv/CVViewer';
import ThemeToggle from './components/theme/ThemeToggle';
// import FloatingElements from './components/theme/FloatingElements';
import ScrollProgress from './components/theme/ScrollProgress';
import NeuralNetwork from './components/theme/NeuralNetwork';
// import AICodeScanner from './components/theme/AICodeScanner';
import { useEffect } from 'react';

const MainContent = () => {
  return (
    <>
      <NeuralNetwork />
      {/* <AICodeScanner /> */}
      <ScrollProgress />
      <Header/>
      <main className='main'>
        <Home />
        <About />
        <Skills />
        <Qualification />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <ScrollUp />
      <ThemeToggle />
    </>
  );
};

const App = () => {
  // Set initial theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/password-protection" element={<PasswordProtection />} />
        <Route path="/aman-project" element={<AManProject />} />
        <Route path="/cv" element={<CVViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
