import React, { useState, useEffect, useRef } from 'react';
import "./projects.css";

const Stopwatch = () => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isRunning, setIsRunning] = useState(false);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);
  const [stopConfirmationStep, setStopConfirmationStep] = useState(0);
  const [signature, setSignature] = useState('');
  const workerRef = useRef(null);

  const stopConfirmationMessages = [
    {
      title: "Pause Your Growth?",
      message: "Are you certain you want to pause your journey of self-improvement? Remember, growth happens outside your comfort zone.",
      continueBtn: "Continue Growing",
      stopBtn: "Stop Timer"
    },
    {
      title: "Reconsider Your Decision",
      message: "Every second invested is a step toward your ideal self. The A-Man Project isn't just a timer—it's your commitment to excellence. Are you sure you want to reset this progress?",
      continueBtn: "Keep Going",
      stopBtn: "Still Want to Stop"
    },
    {
      title: "Final Warning",
      message: "You've invested valuable time in your transformation. This timer represents your dedication to becoming the best version of yourself. Once stopped, this progress marker will be reset. Is this really what you want?",
      continueBtn: "I'll Persist",
      stopBtn: "Yes, Reset Timer"
    }
  ];

  useEffect(() => {
    // Create Web Worker
    const worker = new Worker(new URL('../../workers/stopwatch.worker.js', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    // Handle messages from worker
    const handleWorkerMessage = (e) => {
      if (e.data.type === 'UPDATE') {
        const { elapsed, isRunning: workerIsRunning } = e.data;
        setTime({
          days: Math.floor(elapsed / (1000 * 60 * 60 * 24)),
          hours: Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((elapsed % (1000 * 60)) / 1000)
        });
        setIsRunning(workerIsRunning);

        // Save state to localStorage
        if (workerIsRunning) {
          localStorage.setItem('stopwatchStartTime', (Date.now() - elapsed).toString());
          localStorage.setItem('stopwatchRunning', 'true');
        } else {
          localStorage.removeItem('stopwatchStartTime');
          localStorage.setItem('stopwatchRunning', 'false');
        }
      }
    };

    worker.addEventListener('message', handleWorkerMessage);

    // Check if stopwatch was running
    const wasRunning = localStorage.getItem('stopwatchRunning') === 'true';
    const savedStartTime = localStorage.getItem('stopwatchStartTime');
    
    if (wasRunning && savedStartTime) {
      setIsRunning(true);
      worker.postMessage({ 
        type: 'INIT',
        savedStartTime: parseInt(savedStartTime)
      });
    }

    // Cleanup
    return () => {
      worker.removeEventListener('message', handleWorkerMessage);
      worker.terminate();
    };
  }, []);

  const handleStartStop = () => {
    if (!workerRef.current) return;
    
    if (!isRunning) {
      setShowCommitmentModal(true);
    } else {
      setShowStopConfirmation(true);
      setStopConfirmationStep(0);
    }
  };

  const handleStopConfirmation = (confirmed) => {
    if (!confirmed) {
      setShowStopConfirmation(false);
      setStopConfirmationStep(0);
      return;
    }

    if (stopConfirmationStep < stopConfirmationMessages.length - 1) {
      setStopConfirmationStep(prev => prev + 1);
    } else {
      // Immediately update localStorage on final confirmation for robustness
      localStorage.removeItem('stopwatchStartTime');
      localStorage.setItem('stopwatchRunning', 'false');
      
      // The savedStartTime variable is not used by the worker for the 'STOP' type message.
      // The worker will internally set elapsed time to 0.
      workerRef.current.postMessage({ 
        type: 'STOP'
      });
      setShowStopConfirmation(false);
      setStopConfirmationStep(0);
    }
  };

  const handleCommitmentSubmit = () => {
    if (!signature.trim()) {
      return;
    }

    const savedStartTime = Date.now();
    workerRef.current.postMessage({ 
      type: 'START',
      savedStartTime
    });
    setShowCommitmentModal(false);
    setSignature('');
  };

  // Add event listener for page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && workerRef.current) {
        workerRef.current.postMessage({ type: 'GET_STATE' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isRunning]);

  return (
    <>
      {showStopConfirmation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(8,12,24,0.95) 0%, rgba(2,4,12,0.95) 100%)',
            padding: '2rem',
            borderRadius: '1rem',
            maxWidth: '600px',
            width: '90%',
            border: '1px solid rgba(255,64,87,0.2)',
            boxShadow: '0 0 50px rgba(255,64,87,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Cyber grid background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(rgba(255,64,87,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,64,87,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              opacity: 0.5,
              zIndex: 0
            }}/>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{
                color: '#ff4057',
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem',
                textShadow: '0 0 10px rgba(255,64,87,0.5)'
              }}>{stopConfirmationMessages[stopConfirmationStep].title}</h3>

              <div style={{
                color: '#fff',
                marginBottom: '2rem',
                lineHeight: 1.6,
                fontSize: '0.9rem',
                textAlign: 'center',
                background: 'rgba(255,64,87,0.1)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255,64,87,0.2)'
              }}>
                {stopConfirmationMessages[stopConfirmationStep].message}
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => handleStopConfirmation(false)}
                  className="commitment-btn continue"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(64,255,218,0.2)',
                    border: '1px solid rgba(64,255,218,0.4)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  {stopConfirmationMessages[stopConfirmationStep].continueBtn}
                </button>
                <button
                  onClick={() => handleStopConfirmation(true)}
                  className="commitment-btn stop"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255,64,87,0.2)',
                    border: '1px solid rgba(255,64,87,0.4)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem'
                  }}
                >
                  {stopConfirmationMessages[stopConfirmationStep].stopBtn}
                </button>
              </div>

              <div style={{
                marginTop: '1.5rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.8rem'
              }}>
                Time Invested: {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
              </div>
            </div>
          </div>
        </div>
      )}

      {showCommitmentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(8,12,24,0.95) 0%, rgba(2,4,12,0.95) 100%)',
            padding: '2rem',
            borderRadius: '1rem',
            maxWidth: '600px',
            width: '90%',
            border: '1px solid rgba(64,87,255,0.2)',
            boxShadow: '0 0 50px rgba(64,87,255,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Cyber grid background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(rgba(64,87,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(64,87,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              opacity: 0.5,
              zIndex: 0
            }}/>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{
                color: '#64ffda',
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem',
                textShadow: '0 0 10px rgba(100,255,218,0.5)'
              }}>A-Man Project Commitment</h3>

              <div style={{
                color: '#fff',
                marginBottom: '2rem',
                lineHeight: 1.6,
                fontSize: '0.9rem'
              }}>
                <p>By initiating this timer, I solemnly commit to:</p>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '1rem',
                  background: 'rgba(64,87,255,0.1)',
                  borderRadius: '0.5rem',
                  margin: '1rem 0'
                }}>
                  <li style={{ marginBottom: '0.5rem' }}>• Uphold and embody all principles outlined in the A-Man Project</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Maintain unwavering focus on personal growth and development</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Follow the established guidelines for social, physical, career, and financial domains</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Track and measure progress against defined objectives</li>
                  <li>• Remain accountable to the standards set forth in this document</li>
                </ul>
                <p style={{ 
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center',
                  marginTop: '1rem'
                }}>
                  This timer serves as a constant reminder of my commitment to excellence and personal transformation.
                </p>
              </div>

              <div style={{
                marginBottom: '1.5rem'
              }}>
                <label style={{
                  display: 'block',
                  color: '#fff',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>Digital Signature:</label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(64,87,255,0.1)',
                    border: '1px solid rgba(64,87,255,0.3)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => setShowCommitmentModal(false)}
                  className="commitment-btn cancel"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255,64,87,0.2)',
                    border: '1px solid rgba(255,64,87,0.4)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommitmentSubmit}
                  disabled={!signature.trim()}
                  className={`commitment-btn commit ${!signature.trim() ? 'disabled' : ''}`}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: signature.trim() ? 'rgba(64,255,218,0.2)' : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${signature.trim() ? 'rgba(64,255,218,0.4)' : 'rgba(255,255,255,0.2)'}`,
                    borderRadius: '0.5rem',
                    color: '#fff',
                    cursor: signature.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease'
                  }}
                >
                  I Commit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: 'rgba(8,12,24,0.6)',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginTop: '1rem',
        border: '1px solid rgba(64,87,255,0.2)',
        backdropFilter: 'blur(10px)',
        animation: isRunning ? 'neonPulse 2s infinite' : 'none'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.9rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              color: isRunning ? '#64ffda' : '#fff',
              textShadow: isRunning ? '0 0 10px rgba(100,255,218,0.5)' : 'none',
              transition: 'all 0.3s ease'
            }}>{String(time.days).padStart(2, '0')}</div>
            <div style={{ opacity: 0.7 }}>DAYS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              color: isRunning ? '#64ffda' : '#fff',
              textShadow: isRunning ? '0 0 10px rgba(100,255,218,0.5)' : 'none',
              transition: 'all 0.3s ease'
            }}>{String(time.hours).padStart(2, '0')}</div>
            <div style={{ opacity: 0.7 }}>HRS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              color: isRunning ? '#64ffda' : '#fff',
              textShadow: isRunning ? '0 0 10px rgba(100,255,218,0.5)' : 'none',
              transition: 'all 0.3s ease'
            }}>{String(time.minutes).padStart(2, '0')}</div>
            <div style={{ opacity: 0.7 }}>MIN</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              color: isRunning ? '#64ffda' : '#fff',
              textShadow: isRunning ? '0 0 10px rgba(100,255,218,0.5)' : 'none',
              transition: 'all 0.3s ease'
            }}>{String(time.seconds).padStart(2, '0')}</div>
            <div style={{ opacity: 0.7 }}>SEC</div>
          </div>
          <button
            onClick={handleStartStop}
            style={{
              background: isRunning ? 'rgba(255,64,87,0.2)' : 'rgba(64,255,218,0.2)',
              border: `1px solid ${isRunning ? 'rgba(255,64,87,0.4)' : 'rgba(64,255,218,0.4)'}`,
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease',
              boxShadow: isRunning 
                ? '0 0 15px rgba(255,64,87,0.2)' 
                : '0 0 15px rgba(64,255,218,0.2)',
              textShadow: '0 0 5px rgba(255,255,255,0.5)'
            }}
          >
            {isRunning ? 'STOP' : 'START'}
          </button>
        </div>
      </div>
    </>
  );
};

const AManProject = () => {
  const [expandedTrait, setExpandedTrait] = useState(null);
  const [activeSection, setActiveSection] = useState('social');
  const [expandedPhysicalSection, setExpandedPhysicalSection] = useState(null);
  const [expandedFinancialRule, setExpandedFinancialRule] = useState(null);
  const [expandedCareerRule, setExpandedCareerRule] = useState(null);
  const [expandedAmpyfinPlan, setExpandedAmpyfinPlan] = useState(null);
  const [expandedWorkoutDay, setExpandedWorkoutDay] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [cycleStartDate, setCycleStartDate] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const socialTraits = [
    {
      id: 1,
      trait: "Mindful Communication",
      why: "Think before acting or speaking.",
      how: [
        "If questioning whether to speak, choose silence",
        "Never talk about yourself unless asked",
        "Keep responses focused and relevant",
        "Don't make unrelated topics about yourself"
      ]
    },
    {
      id: 2,
      trait: "Responsibility & Independence",
      why: "Take initiative in household duties.",
      how: [
        "Washing dishes",
        "Doing and folding laundry",
        "Lawn mowing",
        "Handle all chores currently done by mother"
      ]
    },
    {
      id: 3,
      trait: "Social Media Management",
      why: "Maintain professional online presence.",
      how: [
        "Keep Instagram private",
        "Update by December 31",
        "Follow closest connections first",
        "Maintain clean and legitimate appearance"
      ]
    },
    {
      id: 4,
      trait: "Balanced Personality",
      why: "Be friendly but maintain boundaries.",
      how: [
        "Be friendly but not a pushover",
        "Don't overcomplicate or overthink",
        "Accept different thoughts/standards",
        "Avoid judging others' different perspectives"
      ]
    }
  ];

  const physicalSections = [
    {
      id: 'weight',
      title: 'Weight Management',
      content: [
        'Cut Phase (Until September 30, 2025): Target 75kg',
        'October 2025: Bulk Phase - Target 80kg (Greek yogurt + fruit)',
        'November-December 31, 2025: Cut Phase - Target 70kg',
        'Body Goal: Woo Doo Hwan body and vibe of Choi Woo Shik',
        'No sudden weight loss through excessive cardio',
        'Focus on gradual progress and constant grind'
      ]
    },
    {
      id: 'workout',
      title: 'Weekly Workout Schedule',
      content: [
        'Workout Time: 10:00 AM (avoid rush hour traffic + sunburn)',
        'Gym Selection: Lifetime or Crunch - optimize for equipment quality and location (< $100/month)',
        'Minimum 1 hour per workout session',
        'Sunday: Leg Day',
        'Monday: Back Day',
        'Tuesday: Arm Day',
        'Wednesday: Rest Day (Skip Day)',
        'Thursday: Shoulder Day',
        'Friday: Jog at Fowler',
        'Saturday: Chest Day',
        'Evening: 1 hour walk daily (Watch Korean news KBS during solo walks)',
        'Fix posture - no bend over waist and neck, maintain poised back'
      ]
    },
    {
      id: 'diet',
      title: 'Diet & Nutrition',
      content: [
        'Avoid sugar and heavy oil substances',
        'Focus on physical performance-oriented food',
        'Prioritize organic food and mother\'s cooking',
        'Example: For Korean fried chicken, eat chicken breast and avoid fried skin',
        'Any food not planned or not aligned with goals is holding you back'
      ]
    },
    {
      id: 'skincare',
      title: 'Skincare & Hygiene',
      content: [
        'Goal: Glass skin',
        'Morning Routine:',
        'Step 1: Toner pads',
        'Step 2: Serum',
        'Step 3: Hydration gel/cream',
        'Step 4: Sunscreen',
        'Note: Carry sunstick for reapplication',
        'Evening Routine:',
        'Friday: Face mask treatment followed by serum and night cream',
        'Other days: Serum followed by night cream/moisturizer',
        'Post-workout: Thorough ice-cold shower',
        'Post-walk: Lukewarm shower',
        'Maintain consistent skincare routine'
      ]
    }
  ];

  const financialRules = [
    {
      id: 'family-obligations',
      title: 'Family Financial Obligations',
      content: [
        'Monthly Parent Support:',
        '  - $500/month (if net income > $6,000)',
        '  - $300/month (if net income < $6,000)',
        '  - $750/month (if net income ≈ $8,000)',
        '  - $1,000/month (if net income ≥ $10,000)',
        'November 2025 Black Friday Purchases:',
        '  - ThinkPad for mother',
        '  - Brother ThinkPad',
        '  - DJI drone for dad (≤ $1,000, good range, phone controller)',
        'May 2026 Korea Gifts:',
        '  - 2 MacBook Airs for Hyewon and Hyeyoon'
      ]
    },
    {
      id: 'personal-finance',
      title: 'Personal Finance Management',
      content: [
        'Monthly personal spending limit: $200 (after securing full-time job)',
        'Rent should be maximum 25% of monthly income',
        'Maintain minimum $5,000 in bank account',
        'Investment allocation after expenses:',
        '  - 50% of remaining income to Fidelity'
      ]
    },
    {
      id: 'investment-strategy',
      title: 'Investment Strategy',
      content: [
        'Fidelity Portfolio Allocation:',
        '  - 40% Tech + SPY ETFs',
        '  - 40% Big cap stocks',
        '  - 10% ARK investment ETFs',
        '  - 10% Small cap stocks (potential disruptors)',
        'Focus: AI, quantum computing',
        'VIX Index Strategy:',
        '  - VIX > 30: Allocate 20% of savings',
        '  - VIX > 40: Allocate 30% of savings',
        '  - VIX > 50: Allocate 40% of savings'
      ]
    }
  ];

  const careerRules = [
    {
      id: 'georgia-focus',
      title: 'Georgia Period Focus',
      content: [
        'AmpyFin System Development: Minimum 6 hours per day',
        'HPE System Development: Minimum 2 hours per day',
        'Software Engineer Applications:',
        '  - Focus on big firms / legitimate startups',
        '  - Avoid recruitment agencies',
        '  - Minimum 8 applications per day',
        '  - At least 4 hours daily on applications',
        'Leetcode Practice + Job Prep: 1 hour per day',
        'Planning / Review: 1 hour per day',
        'No Netflix or YouTube - time is short',
        'Always be on the grind - relax only in Korea'
      ]
    },
    {
      id: 'post-job',
      title: 'After Securing Job (NYC/Chicago/Boston/SF)',
      content: [
        'Weekends: Dedicated to AmpyFin (minimum 8 hours per day)',
        '2 hours per day on HPE system',
        'Breaks allowed only when:',
        '  - Completed planned tasks',
        '  - Tottenham matches (Premier League/UCL)',
        '  - Top quality UCL matches'
      ]
    }
  ];

  const ampyfinPlans = [
    {
      id: 'july-august',
      title: 'July-August 2025: Core System Development',
      content: [
        'Complete OSS System Development:',
        '• Build and deploy all trading models',
        '• Implement real-time data processing',
        '• Set up automated trading infrastructure',
        '• Complete system integration testing',
        '• Deploy production environment',
        '• Have all systems running and stable'
      ]
    },
    {
      id: 'september',
      title: 'September 2025: Mobile-First Infrastructure',
      content: [
        'Mobile-First Development:',
        '• Implement responsive mobile-first website',
        '• Set up RESTful APIs for all functionalities',
        '• Implement WebSocket for real-time data streaming',
        '• Set up secure API gateway',
        '• Implement real-time notifications system',
        '• Complete API documentation'
      ]
    },
    {
      id: 'october',
      title: 'October 2025: Monetization & Apps',
      content: [
        'Payment & Native Apps:',
        '• Implement account management system',
        '• Set up billing and subscription system',
        '• Configure automated payment processing',
        '• Begin Android app development',
        '• Begin iOS app development',
        '• Optimize user experience across all platforms',
        '• Implement analytics and tracking'
      ]
    },
    {
      id: 'november',
      title: 'November 2025: Finalization',
      content: [
        'System Finalization:',
        '• Complete Android app development',
        '• Complete iOS app development',
        '• Conduct comprehensive testing',
        '• Implement user feedback system',
        '• Finalize security measures',
        '• Complete performance optimization',
        '• Prepare launch documentation'
      ]
    },
    {
      id: 'december',
      title: 'December 2025: Launch',
      content: [
        'Product Launch:',
        '• Launch marketing campaign',
        '• Release mobile apps to stores',
        '• Launch subscription service',
        '• Monitor system performance',
        '• Implement customer support system',
        '• Begin collecting user feedback',
        '• Plan future feature roadmap'
      ]
    }
  ];

  const workoutSchedule = [
    {
      id: 'sunday',
      title: 'Sunday - Leg Day',
      exercises: [
        { 
          name: 'Squats', 
          sets: [
            { reps: 10, intensity: 'light', count: 4 },
            { reps: 8, intensity: 'medium', count: 4 },
            { reps: 4, intensity: 'heavy', count: 4 }
          ]
        },
        { 
          name: 'Seated Leg Curls', 
          sets: [
            { reps: 15, intensity: 'light', count: 4 },
            { reps: 10, intensity: 'medium', count: 4 },
            { reps: 5, intensity: 'heavy', count: 2 }
          ]
        },
        { 
          name: 'Seated Leg Extensions', 
          sets: [
            { reps: 15, intensity: 'light', count: 4 },
            { reps: 10, intensity: 'medium', count: 4 },
            { reps: 5, intensity: 'heavy', count: 2 }
          ]
        },
        { 
          name: 'Dumbbell Calf Raises', 
          sets: [
            { reps: 20, intensity: 'medium', count: 4 }
          ]
        }
      ]
    },
    {
      id: 'monday',
      title: 'Monday - Back + Tricep Day',
      exercises: [
        { 
          name: 'Dumbbell Bent Over Rows', 
          sets: [
            { reps: 15, intensity: 'light', count: 2 },
            { reps: 12, intensity: 'medium', count: 4 },
            { reps: 8, intensity: 'heavy', count: 2 }
          ]
        },
        { 
          name: 'Seated Cable Rows', 
          sets: [
            { reps: 15, intensity: 'light', count: 2 },
            { reps: 12, intensity: 'medium', count: 4 },
            { reps: 8, intensity: 'heavy', count: 2 }
          ]
        },
        { 
          name: 'Lat Cable Pull-downs', 
          sets: [
            { reps: 15, intensity: 'light', count: 2 },
            { reps: 12, intensity: 'medium', count: 4 },
            { reps: 8, intensity: 'heavy', count: 2 }
          ]
        },
        { 
          name: 'Cable Tricep Press Downs', 
          sets: [
            { reps: 20, intensity: 'medium', count: 8 }
          ]
        }
      ]
    },
    {
      id: 'tuesday',
      title: 'Tuesday - Bicep Day',
      exercises: [
        { 
          name: 'Bicep Curls', 
          sets: [
            { reps: 12, intensity: 'medium', count: 4 }
          ]
        },
        { 
          name: 'Hammer Curls', 
          sets: [
            { reps: 12, intensity: 'medium', count: 4 }
          ]
        },
        { 
          name: 'Incline Bicep Curls', 
          sets: [
            { reps: 12, intensity: 'light', count: 4 }
          ]
        }
      ]
    },
    {
      id: 'wednesday',
      title: 'Wednesday - Rest Day',
      exercises: [
        { 
          name: 'Lake Walk', 
          sets: [
            { reps: 1, intensity: 'light', count: 1, note: '1 hour walk at lake after work' }
          ]
        }
      ]
    },
    {
      id: 'thursday',
      title: 'Thursday - Shoulder Day',
      exercises: [
        { 
          name: 'Shoulder Press', 
          sets: [
            { reps: 12, intensity: 'medium', count: 4 }
          ]
        },
        { 
          name: 'Arnold Press', 
          sets: [
            { reps: 12, intensity: 'medium', count: 4 }
          ]
        },
        { 
          name: 'Rear Delt Rows', 
          sets: [
            { reps: 12, intensity: 'medium', count: 4 }
          ]
        },
        { 
          name: 'Lateral Raises', 
          sets: [
            { reps: 10, intensity: 'light', count: 4 }
          ]
        },
        { 
          name: 'Front Raises', 
          sets: [
            { reps: 10, intensity: 'light', count: 4 }
          ]
        }
      ]
    },
    {
      id: 'friday',
      title: 'Friday - Rest Day',
      exercises: [
        { 
          name: 'Lake Walk', 
          sets: [
            { reps: 1, intensity: 'light', count: 1, note: '1 hour walk at lake after work' }
          ]
        }
      ]
    },
    {
      id: 'saturday',
      title: 'Saturday - Chest Day',
      exercises: [
        { 
          name: 'Bench Press', 
          sets: [
            { reps: 10, intensity: 'light', count: 2 },
            { reps: 8, intensity: 'medium', count: 4 },
            { reps: 4, intensity: 'heavy', count: 4 },
            { reps: 2, intensity: 'super heavy', count: 2 }
          ]
        },
        { 
          name: 'Incline Bench Press', 
          sets: [
            { reps: 10, intensity: 'light', count: 2 },
            { reps: 8, intensity: 'medium', count: 4 },
            { reps: 4, intensity: 'heavy', count: 4 }
          ]
        },
        { 
          name: 'Dumbbell Presses', 
          sets: [
            { reps: 10, intensity: 'light', count: 2 },
            { reps: 8, intensity: 'medium', count: 4 },
            { reps: 6, intensity: 'heavy', count: 4 }
          ]
        }
      ]
    },
    {
      id: 'daily',
      title: 'Daily Core Workout',
      exercises: [
        { 
          name: 'Crunches', 
          sets: [
            { reps: 20, intensity: 'medium', count: 4, note: 'Note: Abs are achieved through caloric deficit, not just exercises' }
          ]
        }
      ]
    }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'social':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {socialTraits.map((item) => (
              <div 
                key={item.id}
                style={{
                  backgroundColor: 'var(--first-color-lighter)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedTrait(expandedTrait === item.id ? null : item.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedTrait === item.id ? '1rem' : 0
                }}>
                  <h4 style={{ margin: 0, color: 'var(--title-color)' }}>
                    {item.id}. {item.trait}
                  </h4>
                  <span>{expandedTrait === item.id ? '−' : '+'}</span>
                </div>
                
                {expandedTrait === item.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ 
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      <strong>Why It Matters:</strong> {item.why}
                    </p>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>Practical Ways to Cultivate:</strong>
                      <ul style={{ 
                        listStyle: 'none',
                        padding: '0.5rem 0 0 1rem'
                      }}>
                        {item.how.map((step, index) => (
                          <li key={index} style={{ marginBottom: '0.25rem' }}>
                            • {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'physical':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {physicalSections.map((section) => (
              <div 
                key={section.id}
                style={{
                  backgroundColor: 'var(--first-color-lighter)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedPhysicalSection(expandedPhysicalSection === section.id ? null : section.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedPhysicalSection === section.id ? '1rem' : 0
                }}>
                  <h4 style={{ margin: 0, color: 'var(--title-color)' }}>
                    {section.title}
                  </h4>
                  <span>{expandedPhysicalSection === section.id ? '−' : '+'}</span>
                </div>
                
                {expandedPhysicalSection === section.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <ul style={{ 
                      listStyle: 'none',
                      padding: '0.5rem 0 0 1rem',
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      {section.content.map((item, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'career':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {careerRules.map((rule) => (
              <div 
                key={rule.id}
                style={{
                  backgroundColor: 'var(--first-color-lighter)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedCareerRule(expandedCareerRule === rule.id ? null : rule.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedCareerRule === rule.id ? '1rem' : 0
                }}>
                  <h4 style={{ margin: 0, color: 'var(--title-color)' }}>
                    {rule.title}
                  </h4>
                  <span>{expandedCareerRule === rule.id ? '−' : '+'}</span>
                </div>
                
                {expandedCareerRule === rule.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <ul style={{ 
                      listStyle: 'none',
                      padding: '0.5rem 0 0 1rem',
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      {rule.content.map((item, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'financial':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {financialRules.map((rule) => (
              <div 
                key={rule.id}
                style={{
                  backgroundColor: 'var(--first-color-lighter)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedFinancialRule(expandedFinancialRule === rule.id ? null : rule.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedFinancialRule === rule.id ? '1rem' : 0
                }}>
                  <h4 style={{ margin: 0, color: 'var(--title-color)' }}>
                    {rule.title}
                  </h4>
                  <span>{expandedFinancialRule === rule.id ? '−' : '+'}</span>
                </div>
                
                {expandedFinancialRule === rule.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <ul style={{ 
                      listStyle: 'none',
                      padding: '0.5rem 0 0 1rem',
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      {rule.content.map((item, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'ampyfin':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ampyfinPlans.map((plan) => (
              <div 
                key={plan.id}
                className="ampyfin-item"
                style={{
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedAmpyfinPlan(expandedAmpyfinPlan === plan.id ? null : plan.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedAmpyfinPlan === plan.id ? '1rem' : 0
                }}>
                  <h4 style={{ 
                    margin: 0, 
                    color: 'var(--title-color)',
                    fontSize: '1.1rem',
                    fontFamily: 'monospace'
                  }}>
                    {plan.title}
                  </h4>
                  <span style={{
                    color: 'rgba(64,87,255,0.8)',
                    fontFamily: 'monospace'
                  }}>{expandedAmpyfinPlan === plan.id ? '−' : '+'}</span>
                </div>
                
                {expandedAmpyfinPlan === plan.id && (
                  <div style={{ 
                    marginTop: '0.5rem',
                    background: 'rgba(64,87,255,0.1)',
                    borderRadius: '0.5rem',
                    padding: '1rem'
                  }}>
                    <ul style={{ 
                      listStyle: 'none',
                      padding: '0',
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'var(--text-color)',
                      fontFamily: 'monospace'
                    }}>
                      {plan.content.map((item, index) => (
                        <li key={index} style={{ 
                          marginBottom: '0.5rem',
                          paddingLeft: item.startsWith('•') ? '1rem' : '0',
                          color: item.startsWith('•') ? 'rgba(255,255,255,0.8)' : 'rgba(64,87,255,0.8)',
                          fontWeight: item.startsWith('•') ? 'normal' : 'bold'
                        }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'workout':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Bulk/Cut Mode Switcher */}
            <div style={{
              background: 'rgba(8,12,24,0.8)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(64,87,255,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  flex: '1',
                  minWidth: '200px'
                }}>
                  <h3 style={{
                    color: bulkMode ? '#64ffda' : '#ff4057',
                    marginBottom: '1rem',
                    fontFamily: 'monospace'
                  }}>
                    Current Mode: {bulkMode ? 'BULK' : 'CUT'}
                  </h3>
                  <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                  }}>
                    {bulkMode ? 
                      'Slow bulk phase - Focus on clean eating and progressive overload' :
                      'Cut phase - Maintain strength while in caloric deficit'
                    }
                  </p>
                  <button
                    onClick={() => {
                      setBulkMode(!bulkMode);
                      setCycleStartDate(new Date());
                    }}
                    style={{
                      background: bulkMode ? 
                        'linear-gradient(135deg, rgba(64,255,218,0.2), rgba(64,255,218,0.1))' :
                        'linear-gradient(135deg, rgba(255,64,87,0.2), rgba(255,64,87,0.1))',
                      border: `1px solid ${bulkMode ? 'rgba(64,255,218,0.3)' : 'rgba(255,64,87,0.3)'}`,
                      color: '#fff',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Switch to {bulkMode ? 'CUT' : 'BULK'} Mode
                  </button>
                </div>
                
                <div style={{
                  flex: '1',
                  minWidth: '200px',
                  background: 'rgba(64,87,255,0.1)',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(64,87,255,0.2)'
                }}>
                  <h4 style={{
                    color: '#64ffda',
                    marginBottom: '1rem',
                    fontFamily: 'monospace'
                  }}>
                    Cycle Progress
                  </h4>
                  {cycleStartDate ? (
                    <>
                      <p style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem'
                      }}>
                        Started: {cycleStartDate.toLocaleDateString()}
                      </p>
                      <p style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem'
                      }}>
                        Switch to {bulkMode ? 'CUT' : 'BULK'} on: {
                          new Date(cycleStartDate.getTime() + (90 * 24 * 60 * 60 * 1000)).toLocaleDateString()
                        }
                      </p>
                      <div style={{
                        width: '100%',
                        height: '4px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        marginTop: '1rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: '0',
                          top: '0',
                          height: '100%',
                          width: `${Math.min(100, (new Date() - cycleStartDate) / (90 * 24 * 60 * 60 * 1000) * 100)}%`,
                          background: bulkMode ? 
                            'linear-gradient(90deg, #64ffda, rgba(64,255,218,0.5))' :
                            'linear-gradient(90deg, #ff4057, rgba(255,64,87,0.5))',
                          borderRadius: '2px'
                        }}/>
                      </div>
                    </>
                  ) : (
                    <p style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.9rem'
                    }}>
                      Start a cycle by switching modes
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Workout Schedule */}
            {workoutSchedule.map((day) => (
              <div 
                key={day.id}
                className="workout-day"
                style={{
                  backgroundColor: 'rgba(8,12,24,0.6)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(64,87,255,0.2)'
                }}
                onClick={() => setExpandedWorkoutDay(expandedWorkoutDay === day.id ? null : day.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <h3 style={{ 
                    margin: 0,
                    color: '#64ffda',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem'
                  }}>
                    {day.title}
                  </h3>
                  <span style={{
                    color: 'rgba(64,87,255,0.8)',
                    fontFamily: 'monospace'
                  }}>
                    {expandedWorkoutDay === day.id ? '−' : '+'}
                  </span>
                </div>

                {expandedWorkoutDay === day.id && (
                  <div style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    {day.exercises.map((exercise, index) => (
                      <div 
                        key={index}
                        style={{
                          background: 'rgba(64,87,255,0.1)',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(64,87,255,0.2)'
                        }}
                      >
                        <h4 style={{
                          margin: '0 0 0.5rem 0',
                          color: '#fff',
                          fontFamily: 'monospace'
                        }}>
                          {exercise.name}
                        </h4>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          {exercise.sets.map((set, setIndex) => (
                            <div 
                              key={setIndex}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '0.9rem',
                                fontFamily: 'monospace'
                              }}
                            >
                              <span style={{
                                color: set.intensity === 'light' ? '#64ffda' :
                                       set.intensity === 'medium' ? '#ff4057' :
                                       set.intensity === 'heavy' ? '#ff8f00' :
                                       '#ff1744',
                                fontWeight: 'bold'
                              }}>
                                {set.intensity.toUpperCase()}
                              </span>
                              <span>•</span>
                              <span>{set.count} sets</span>
                              <span>•</span>
                              <span>{set.reps} reps</span>
                              {set.note && (
                                <span style={{
                                  marginLeft: 'auto',
                                  fontSize: '0.8rem',
                                  fontStyle: 'italic',
                                  color: 'rgba(255,255,255,0.5)'
                                }}>
                                  {set.note}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderSignature = () => {
    const dates = {
      social: {
        signed: "August 2, 2025 at 10:00 PM EST",
        effective: "August 2, 2025 at 10:00 PM EST"
      },
      physical: {
        signed: "August 2, 2025 at 10:00 PM EST",
        effective: "August 2, 2025 at 10:00 PM EST"
      },
      career: {
        signed: "August 2, 2025 at 10:00 PM EST",
        effective: "August 2, 2025 at 10:00 PM EST"
      },
      financial: {
        signed: "August 2, 2025 at 10:00 PM EST",
        effective: "August 2, 2025 at 10:00 PM EST"
      },
      ampyfin: {
        signed: "August 2, 2025 at 10:00 PM EST",
        effective: "August 2, 2025 at 10:00 PM EST"
      },
      workout: {
        signed: "August 2, 2025 at 10:00 PM EST",
        effective: "August 2, 2025 at 10:00 PM EST"
      }
    };

    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '1rem',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        textAlign: 'center',
        fontFamily: 'Pinyon Script, cursive',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          marginBottom: '1rem',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          fontFamily: 'serif'
        }}>
          Signed on {dates[activeSection].signed}
        </div>
        
        <div style={{
          marginBottom: '2rem',
          color: 'rgba(64,87,255,0.8)',
          fontSize: '1rem',
          fontStyle: 'italic',
          fontFamily: 'serif',
          textAlign: 'center',
          padding: '1rem',
          background: 'rgba(64,87,255,0.1)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(64,87,255,0.2)'
        }}>
          "I'd happily live on one humble meal each day if it means spending my hours chasing the dream that keeps me up at night, rather than feast three times a day on work that never makes it into my dreams."
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '0.5rem'
          }}>
            — A-Man Project Philosophy
          </div>
        </div>
        
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <iframe
            width="100%"
            height="315"
            src={
              activeSection === 'career' ? "https://www.youtube.com/embed/Tuw8hxrFBH8" :
              activeSection === 'physical' ? "https://www.youtube.com/embed/G9LC9P2OKVE" :
              activeSection === 'financial' ? "https://www.youtube.com/embed/BHyVg2sXy5w" :
              activeSection === 'social' ? "https://www.youtube.com/embed/M9WyKJvlN4c" :
              activeSection === 'ampyfin' ? "https://www.youtube.com/embed/nMctjmaYuhQ" :
              activeSection === 'workout' ? "https://www.youtube.com/embed/xd-9D3GzUpo" :
              "https://www.youtube.com/embed/M9WyKJvlN4c"
            }
            title={`A-Man Project ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Inspiration`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              borderRadius: '0.5rem',
              border: '1px solid rgba(64,87,255,0.3)',
              boxShadow: '0 0 20px rgba(64,87,255,0.2)',
              maxWidth: '560px'
            }}
          ></iframe>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            fontSize: '2.5rem',
            color: '#fff',
            fontFamily: 'Pinyon Script, cursive',
            transform: 'rotate(-5deg)',
            textShadow: '0 0 20px rgba(64,87,255,0.5)',
            padding: '1rem'
          }}>
            Yeon Lee
          </div>
          <div style={{
            width: '250px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(64,87,255,0.5), transparent)',
            margin: '0.5rem 0'
          }}></div>
          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.7)',
            fontStyle: 'italic',
            fontFamily: 'serif'
          }}>
            Signed and Sealed
          </div>
        </div>

        <div style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          fontFamily: 'serif',
          marginTop: '2rem'
        }}>
          <div>Effective {dates[activeSection].effective}</div>
          <Stopwatch />
        </div>

        <div style={{
          fontSize: '2rem',
          color: 'rgba(64,87,255,0.5)',
          marginTop: '1rem'
        }}>
          ❦
        </div>
      </div>
    );
  };

  return (
    <section className="section" style={{
      background: `
        linear-gradient(135deg, rgba(4,8,16,0.97) 0%, rgba(2,4,12,0.97) 100%),
        radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(64,87,255,0.2) 0%, rgba(64,87,255,0) 50%),
        linear-gradient(${time}deg, rgba(64,87,255,0.08) 0%, rgba(128,0,255,0.08) 100%)
      `,
      color: '#fff',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.3s ease'
    }}>
      {/* Cyber grid background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(64,87,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(64,87,255,0.05) 1px, transparent 1px),
          linear-gradient(rgba(128,0,255,0.03) 2px, transparent 2px),
          linear-gradient(90deg, rgba(128,0,255,0.03) 2px, transparent 2px)
        `,
        backgroundSize: '50px 50px, 50px 50px, 100px 100px, 100px 100px',
        transform: `perspective(1000px) rotateX(60deg) translateY(-50%) scale(3)`,
        opacity: 0.3,
        zIndex: 0,
        animation: 'gridMove 20s linear infinite'
      }}/>

      {/* Enhanced floating particles */}
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: i % 4 === 0 ? '4px' : i % 3 === 0 ? '3px' : '2px',
            height: i % 4 === 0 ? '4px' : i % 3 === 0 ? '3px' : '2px',
            background: i % 4 === 0 ? 'rgba(128,0,255,0.7)' : i % 3 === 0 ? 'rgba(64,87,255,0.5)' : 'rgba(255,255,255,0.3)',
            boxShadow: i % 4 === 0 
              ? '0 0 15px rgba(128,0,255,0.8), 0 0 30px rgba(128,0,255,0.6)' 
              : i % 3 === 0 
                ? '0 0 10px rgba(64,87,255,0.6), 0 0 20px rgba(64,87,255,0.4)'
                : '0 0 5px rgba(255,255,255,0.3)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 15}s linear infinite`,
            opacity: Math.random() * 0.5 + 0.5
          }}
        />
      ))}

      <style>
        {`
          @keyframes gridMove {
            0% { background-position: 0 0; }
            100% { background-position: 50px 50px; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          @keyframes float {
            0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); }
            25% { transform: translateY(-20px) translateX(10px) rotate(90deg) scale(1.1); }
            50% { transform: translateY(0) translateX(20px) rotate(180deg) scale(1); }
            75% { transform: translateY(20px) translateX(10px) rotate(270deg) scale(0.9); }
            100% { transform: translateY(0) translateX(0) rotate(360deg) scale(1); }
          }
          @keyframes neonPulse {
            0%, 100% { 
              box-shadow: 0 0 10px rgba(64,87,255,0.5),
                         0 0 20px rgba(64,87,255,0.3),
                         0 0 30px rgba(64,87,255,0.2),
                         inset 0 0 15px rgba(64,87,255,0.3);
            }
            50% { 
              box-shadow: 0 0 15px rgba(64,87,255,0.6),
                         0 0 25px rgba(64,87,255,0.4),
                         0 0 35px rgba(64,87,255,0.3),
                         inset 0 0 25px rgba(64,87,255,0.4);
            }
          }
          @keyframes borderFlow {
            0% { border-image-source: linear-gradient(0deg, rgba(64,87,255,0.5), rgba(128,0,255,0.5)); }
            100% { border-image-source: linear-gradient(360deg, rgba(64,87,255,0.5), rgba(128,0,255,0.5)); }
          }
          .nav-button {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(64,87,255,0.3) !important;
            backdrop-filter: blur(10px);
          }
          .nav-button:before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(64,87,255,0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s ease, height 0.6s ease;
          }
          .nav-button:hover:before {
            width: 200%;
            height: 200%;
          }
          .nav-button.active {
            animation: neonPulse 2s infinite;
            border: 1px solid rgba(64,87,255,0.5) !important;
          }
          .content-card {
            transition: all 0.3s ease;
            border: 1px solid rgba(64,87,255,0.2);
            position: relative;
          }
          .content-card:before {
            content: '';
            position: absolute;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            border: 1px solid transparent;
            border-radius: 1rem;
            animation: borderFlow 3s linear infinite;
            pointer-events: none;
          }
          .content-card:hover {
            transform: translateY(-2px) scale(1.002);
            box-shadow: 0 12px 40px rgba(64,87,255,0.2);
            border-color: rgba(64,87,255,0.4);
          }
          .content-card:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 1rem;
            background: linear-gradient(45deg, transparent, rgba(64,87,255,0.1), transparent);
            background-size: 200% 200%;
            animation: gradient 3s linear infinite;
            z-index: -1;
          }
          @keyframes gradient {
            0% { background-position: 0% 0%; }
            100% { background-position: 200% 200%; }
          }
          .title-glow {
            animation: titleGlow 3s ease-in-out infinite;
          }
          @keyframes titleGlow {
            0%, 100% { filter: drop-shadow(0 0 15px rgba(64,87,255,0.3)); }
            50% { filter: drop-shadow(0 0 25px rgba(64,87,255,0.5)); }
          }
        `}
      </style>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 className="section__title" style={{
          color: '#fff',
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <span className="title-glow" style={{
            background: 'linear-gradient(45deg, #fff, rgba(64,87,255,0.8), rgba(128,0,255,0.8))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            padding: '0.5rem 2rem',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(64,87,255,0.2), transparent)',
              filter: 'blur(8px)',
              zIndex: -1
            }}></span>
            A-Man Project
          </span>
          <div style={{
            width: '200px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(64,87,255,0.8), rgba(128,0,255,0.8), transparent)',
            margin: '0.5rem auto',
            boxShadow: '0 0 20px rgba(64,87,255,0.5)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-1px',
              left: '0',
              width: '10px',
              height: '4px',
              background: 'rgba(64,87,255,0.8)',
              boxShadow: '0 0 10px rgba(64,87,255,0.8)',
              animation: 'sliderMove 3s linear infinite'
            }}></div>
          </div>
        </h2>
        
        <div className="container" style={{ padding: "2rem" }}>
          {/* Navigation Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'rgba(8,12,24,0.6)',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid rgba(64,87,255,0.2)'
          }}>
            {['social', 'physical', 'career', 'financial', 'ampyfin', 'workout'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`nav-button ${activeSection === section ? 'active' : ''}`}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: activeSection === section 
                    ? 'linear-gradient(135deg, rgba(64,87,255,0.3) 0%, rgba(128,0,255,0.3) 100%)'
                    : 'rgba(8,12,24,0.6)',
                  color: activeSection === section ? '#fff' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontWeight: activeSection === section ? 'bold' : 'normal',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(5px)',
                  letterSpacing: '2px',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace'
                }}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Content Section */}
          <div className="content-card" style={{
            background: 'rgba(8,12,24,0.6)',
            borderRadius: '1rem',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(64,87,255,0.5), rgba(128,0,255,0.5), transparent)',
              boxShadow: '0 0 20px rgba(64,87,255,0.5)'
            }}/>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(64,87,255,0.2)',
              paddingBottom: '0.5rem',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'monospace',
              letterSpacing: '2px'
            }}>
              <span style={{
                background: 'linear-gradient(45deg, #fff, rgba(64,87,255,0.8), rgba(128,0,255,0.8))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 10px rgba(64,87,255,0.3))'
              }}>{activeSection}</span>
              <span style={{ 
                fontSize: '0.8rem', 
                opacity: 0.7,
                fontWeight: 'normal'
              }}>
                // ACTIVE MODULE
              </span>
            </h3>
            
            {renderContent()}
          </div>

          {/* Signature Section */}
          {renderSignature()}
        </div>
      </div>
    </section>
  );
}

export default AManProject; 