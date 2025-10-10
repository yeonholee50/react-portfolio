import React, { useState, useEffect, useRef } from 'react';
import "./projects.css";

const Stopwatch = () => {
  const [time, setTime] = useState({
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isRunning, setIsRunning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(0);
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

  const resetTimer = () => {
    setTime({
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
    setIsRunning(false);
    setShowConfirmation(false);
    setConfirmationStep(0);
    localStorage.removeItem('amanTimerState');
  };

  const handleStopClick = () => {
    if (isRunning) {
      setShowConfirmation(true);
      setConfirmationStep(0);
    } else {
      // Start the timer from 0
      const startTime = Date.now();
      if (workerRef.current) {
        workerRef.current.postMessage({ 
          type: 'START',
          savedStartTime: startTime
        });
      }
      // Save state when starting
      localStorage.setItem('amanTimerState', JSON.stringify({
        isRunning: true,
        startTime: startTime,
        elapsed: 0
      }));
    }
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      if (confirmationStep < stopConfirmationMessages.length - 1) {
        setConfirmationStep(confirmationStep + 1);
      } else {
        // Final confirmation - reset timer
        if (workerRef.current) {
          workerRef.current.postMessage({ type: 'STOP' });
        }
        // Force immediate reset to 0
        setTime({
          weeks: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        setIsRunning(false);
        setShowConfirmation(false);
        setConfirmationStep(0);
        localStorage.removeItem('amanTimerState');
      }
    } else {
      // User chose to continue
      setShowConfirmation(false);
      setConfirmationStep(0);
    }
  };

  useEffect(() => {
    // Create Web Worker
    const worker = new Worker(new URL('../../workers/stopwatch.worker.js', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    // Handle messages from worker
    const handleWorkerMessage = (e) => {
      if (e.data.type === 'UPDATE') {
        const { elapsed, isRunning: workerIsRunning } = e.data;
        
        // Update time state with weeks included
        const totalSeconds = Math.floor(elapsed / 1000);
        const weeks = Math.floor(totalSeconds / (7 * 24 * 60 * 60));
        const remainingSeconds = totalSeconds % (7 * 24 * 60 * 60);
        const days = Math.floor(remainingSeconds / (24 * 60 * 60));
        const hours = Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
        const seconds = remainingSeconds % 60;
        
        setTime({
          weeks,
          days,
          hours,
          minutes,
          seconds
        });
        setIsRunning(workerIsRunning);
        
        // Save current state to localStorage only if running or if elapsed > 0
        if (workerIsRunning || elapsed > 0) {
          localStorage.setItem('amanTimerState', JSON.stringify({
            isRunning: workerIsRunning,
            startTime: workerIsRunning ? Date.now() - elapsed : null,
            elapsed: elapsed
          }));
        } else {
          // If elapsed is 0 and not running, remove from localStorage
          localStorage.removeItem('amanTimerState');
        }
      }
    };

    worker.addEventListener('message', handleWorkerMessage);

    // Check for saved timer state
    const savedState = localStorage.getItem('amanTimerState');
    if (savedState) {
      const { isRunning: savedIsRunning, startTime: savedStartTime, elapsed: savedElapsed } = JSON.parse(savedState);
      
      if (savedIsRunning && savedStartTime) {
        // Resume timer from saved state
        worker.postMessage({ 
          type: 'START',
          savedStartTime: savedStartTime
        });
      } else {
        // Initialize with saved elapsed time but not running
        worker.postMessage({ 
          type: 'INIT',
          savedElapsed: savedElapsed || 0
        });
      }
    } else {
      // Initialize the worker with 0 elapsed time
      worker.postMessage({ 
        type: 'INIT',
        savedElapsed: 0
      });
    }

    // Cleanup
    return () => {
      worker.removeEventListener('message', handleWorkerMessage);
      worker.terminate();
    };
  }, []);

  // Counter that resets to 0 when stopped and confirmed

  // Add event listener for page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && workerRef.current) {
        workerRef.current.postMessage({ type: 'GET_STATE' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'rgba(6,0,32,0.95)',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 0 30px rgba(0,0,0,0.8)',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: '#FFFFFF',
              marginBottom: '1rem',
              fontFamily: 'monospace',
              fontSize: '1.2rem'
            }}>
              {stopConfirmationMessages[confirmationStep].title}
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '2rem',
              lineHeight: '1.6',
              fontSize: '0.9rem'
            }}>
              {stopConfirmationMessages[confirmationStep].message}
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => handleConfirmation(false)}
                style={{
                  background: 'linear-gradient(135deg, rgba(229,229,229,0.3), rgba(229,229,229,0.2))',
                  border: '1px solid rgba(229,229,229,0.5)',
                  color: '#fff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'all 0.3s ease'
                }}
              >
                {stopConfirmationMessages[confirmationStep].continueBtn}
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.9))',
                border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'all 0.3s ease'
                }}
              >
                {stopConfirmationMessages[confirmationStep].stopBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '0',
        padding: '1rem',
        marginTop: '1rem',
        border: '1px solid rgba(255,255,255,0.15)',
        borderLeft: '2px solid rgba(255,255,255,0.3)',
        backdropFilter: 'blur(10px)',
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.8rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}>{String(time.weeks).padStart(2, '0')}</div>
            <div style={{ opacity: 0.5, fontSize: '0.65rem', color: '#E5E5E5', letterSpacing: '1px' }}>WKS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}>{String(time.days).padStart(2, '0')}</div>
            <div style={{ opacity: 0.5, fontSize: '0.65rem', color: '#E5E5E5', letterSpacing: '1px' }}>DAYS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}>{String(time.hours).padStart(2, '0')}</div>
            <div style={{ opacity: 0.5, fontSize: '0.65rem', color: '#E5E5E5', letterSpacing: '1px' }}>HRS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}>{String(time.minutes).padStart(2, '0')}</div>
            <div style={{ opacity: 0.5, fontSize: '0.65rem', color: '#E5E5E5', letterSpacing: '1px' }}>MIN</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}>{String(time.seconds).padStart(2, '0')}</div>
            <div style={{ opacity: 0.5, fontSize: '0.65rem', color: '#E5E5E5', letterSpacing: '1px' }}>SEC</div>
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <button
              onClick={handleStopClick}
              style={{
                background: isRunning ? 
                  'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))' :
                  'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.5))',
                border: `1px solid ${isRunning ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'}`,
                color: '#FFFFFF',
                padding: '0.5rem 1rem',
                borderRadius: '0',
                cursor: 'pointer',
                fontFamily: '"Helvetica Neue", "Arial", sans-serif',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '2px',
                transition: 'all 0.2s ease',
                clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
              }}
            >
              {isRunning ? 'STOP' : 'START'}
            </button>
            <div style={{
              color: isRunning ? '#FFFFFF' : 'rgba(229,229,229,0.6)',
              fontFamily: '"Helvetica Neue", "Arial", sans-serif',
              fontSize: '0.7rem',
              fontWeight: '500',
              letterSpacing: '2px',
              textAlign: 'center',
              padding: '0.5rem 0.75rem',
              background: isRunning ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isRunning ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '0',
              clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
            }}>
              {isRunning ? 'ACTIVE' : 'PAUSED'}
            </div>
          </div>
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
  const [buffettIndicator, setBuffettIndicator] = useState(null);
  const [investmentRatio, setInvestmentRatio] = useState('3:1');
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [vixIndex, setVixIndex] = useState(null);
  const [vixLastFetchTime, setVixLastFetchTime] = useState(null);

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

  // Fetch Buffett Indicator data
  useEffect(() => {
    const fetchBuffettIndicator = async () => {
      try {
        // Using CORS proxy to bypass CORS restrictions
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = encodeURIComponent('https://buffettindicator.net/');
        
        const response = await fetch(proxyUrl + targetUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Parse the HTML to extract autoRatio
        const match = html.match(/let\s+autoRatio\s*=\s*([\d.]+);/);
        
        if (match && match[1]) {
          const ratio = parseFloat(match[1]);
          setBuffettIndicator(ratio);
          setLastFetchTime(new Date());
          
          // Automatically set investment ratio based on Buffett Indicator
          let newRatio;
          if (ratio > 200) {
            newRatio = '2:1'; // Conservative - build more cash reserve
          } else if (ratio >= 100 && ratio <= 200) {
            newRatio = '3:1'; // Balanced
          } else {
            newRatio = '4:1'; // Aggressive - market undervalued
          }
          setInvestmentRatio(newRatio);
          
          console.log(`✅ Buffett Indicator updated: ${ratio}% | Ratio: ${newRatio}`);
        } else {
          console.error('❌ Could not parse Buffett Indicator from HTML');
          setBuffettIndicator(null);
          setInvestmentRatio(null);
        }
      } catch (error) {
        console.error('❌ Error fetching Buffett Indicator:', error);
        // NO FALLBACK DATA - show the error clearly
        setBuffettIndicator(null);
        setInvestmentRatio(null);
      }
    };

    // Fetch immediately on mount
    fetchBuffettIndicator();

    // Fetch every hour (3600000 milliseconds)
    const interval = setInterval(fetchBuffettIndicator, 3600000);

    return () => clearInterval(interval);
  }, []);

  // Fetch VIX Index data - Using CORS proxies to access Yahoo Finance APIs
  useEffect(() => {
    const fetchVixIndex = async () => {
      console.log('🔄 Fetching VIX Index...');
      console.log('='.repeat(80));
      console.log('⚠️ Yahoo Finance APIs have CORS restrictions');
      console.log('📡 Using CORS proxies to bypass browser security...');
      console.log('');
      
      try {
        // CORS Proxy configurations
        const corsProxies = [
          {
            name: 'AllOrigins',
            buildUrl: (target) => `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`,
            extractData: (json) => JSON.parse(json.contents)
          },
          {
            name: 'CORS.SH',
            buildUrl: (target) => `https://cors.sh/${target}`,
            extractData: (json) => json,
            headers: { 'x-requested-with': 'XMLHttpRequest' }
          },
          {
            name: 'ThingProxy',
            buildUrl: (target) => `https://thingproxy.freeboard.io/fetch/${target}`,
            extractData: (json) => json
          }
        ];
        
        // Yahoo Finance API endpoints
        const yahooEndpoints = [
          {
            name: 'Quote API (v7)',
            url: 'https://query2.finance.yahoo.com/v7/finance/quote?symbols=%5EVIX',
            extractVix: (data) => {
              const result = data?.quoteResponse?.result?.[0];
              return {
                vix: result?.regularMarketPrice,
                symbol: result?.symbol,
                metadata: {
                  marketState: result?.marketState,
                  exchange: result?.exchange
                }
              };
            }
          },
          {
            name: 'Chart API (v8)',
            url: 'https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=1d',
            extractVix: (data) => {
              const meta = data?.chart?.result?.[0]?.meta;
              return {
                vix: meta?.regularMarketPrice,
                symbol: meta?.symbol,
                metadata: {
                  currency: meta?.currency,
                  exchange: meta?.exchangeName
                }
              };
            }
          }
        ];
        
        // Try each combination of proxy + endpoint
        for (const proxy of corsProxies) {
          for (const endpoint of yahooEndpoints) {
            try {
              const proxyUrl = proxy.buildUrl(endpoint.url);
              console.log(`🔍 Trying: ${proxy.name} + ${endpoint.name}`);
              console.log(`   URL: ${proxyUrl.substring(0, 80)}...`);
              
              const response = await fetch(proxyUrl, {
                headers: proxy.headers || {}
              });
              
              console.log(`   Status: ${response.status}`);
              
              if (response.ok) {
                const proxyResponse = await response.json();
                console.log('   📦 Proxy response keys:', Object.keys(proxyResponse));
                console.log('   📦 Proxy response sample:', JSON.stringify(proxyResponse).substring(0, 200) + '...');
                
                let yahooData;
                try {
                  yahooData = proxy.extractData(proxyResponse);
                  console.log('   ✓ Extracted Yahoo data');
                  console.log('   📦 Yahoo data keys:', Object.keys(yahooData || {}));
                  console.log('   📦 Yahoo data sample:', JSON.stringify(yahooData).substring(0, 300) + '...');
                } catch (extractError) {
                  console.error('   ❌ Failed to extract data:', extractError.message);
                  continue;
                }
                
                const { vix, symbol, metadata } = endpoint.extractVix(yahooData);
                
                console.log('   🔍 Extracted:');
                console.log(`      Symbol: ${symbol}`);
                console.log(`      VIX: ${vix}`);
                console.log(`      Metadata:`, metadata);
                
                if (vix && !isNaN(vix) && vix > 5 && vix < 100) {
                  setVixIndex(vix);
                  setVixLastFetchTime(new Date());
                  console.log('');
                  console.log(`✅✅✅ VIX INDEX: ${vix} ✅✅✅`);
                  console.log(`📡 Via: ${proxy.name} + ${endpoint.name}`);
                  console.log('='.repeat(80));
                  return; // Success!
                } else {
                  console.warn(`   ⚠️ Invalid VIX value: ${vix} (must be 5-100 and not NaN)`);
                }
              }
            } catch (error) {
              console.log(`   ❌ Failed: ${error.message}`);
            }
          }
        }
        
        // If we get here, all methods failed
        console.log('');
        console.error('❌ All proxy + API combinations failed');
        throw new Error('Unable to fetch VIX - all CORS proxies and Yahoo Finance APIs failed');
        
      } catch (error) {
        console.error('❌❌❌ ALL VIX FETCH METHODS FAILED ❌❌❌');
        console.error('Error:', error.message);
        console.error('');
        console.error('🔧 TROUBLESHOOTING:');
        console.error('1. Check browser console Network tab for CORS errors');
        console.error('2. Yahoo Finance APIs (query1/query2.finance.yahoo.com) may be blocked');
        console.error('3. Try disabling ad blockers or browser extensions');
        console.error('4. Verify internet connection');
        console.error('');
        console.error('🌐 APIs Tried:');
        console.error('   • https://query2.finance.yahoo.com/v7/finance/quote (Quote API)');
        console.error('   • https://query1.finance.yahoo.com/v8/finance/chart (Chart API)');
        console.error('   • CORS proxy fallbacks');
        console.error('');
        console.error('💡 WORKAROUND: Click the [Live Data] link to check VIX manually');
        console.error('💡 Current VIX can be found at: https://finance.yahoo.com/quote/%5EVIX/');
        console.error('='.repeat(80));
        
        setVixIndex(null);
      }
    };

    // Fetch immediately on mount
    fetchVixIndex();

    // Fetch every hour (3600000 milliseconds) - same as Buffett Indicator
    const interval = setInterval(fetchVixIndex, 3600000);

    return () => clearInterval(interval);
  }, []);

  const socialTraits = [
    {
      id: 1,
      trait: "Warm-Competent",
      why: "Friendly, present, remembers details; makes others feel smart and safe.",
      how: [
        "Remember personal details from conversations",
        "Ask follow-up questions about others' interests",
        "Acknowledge others' contributions publicly",
        "Create safe spaces for honest communication"
      ]
    },
    {
      id: 2,
      trait: "High-Signal Communicator",
      why: "Talks in decisions, trade-offs, and next steps; keeps messages short but complete.",
      how: [
        "Structure messages: Context → decision/ask → two options → next step → owner & date",
        "Keep communications concise but complete",
        "Focus on actionable outcomes",
        "Avoid unnecessary elaboration"
      ]
    },
    {
      id: 3,
      trait: "Credit-Forward",
      why: "Thanks publicly, critiques privately with specifics.",
      how: [
        "Publicly acknowledge others' contributions",
        "Give specific, actionable feedback privately",
        "Highlight team achievements in meetings",
        "Document wins with proper attribution"
      ]
    },
    {
      id: 4,
      trait: "Conflict Style",
      why: "Steel-mans the other side, proposes a small, reversible experiment over big debates.",
      how: [
        "Present the strongest version of opposing arguments",
        "Propose small, testable experiments",
        "Focus on reversible changes first",
        "Avoid large philosophical debates"
      ]
    },
    {
      id: 5,
      trait: "Boundary Hygiene",
      why: "Says 'no' to vague asks; offers a time-boxed pilot instead.",
      how: [
        "Decline vague or unclear requests",
        "Offer specific, time-limited alternatives",
        "Set clear expectations upfront",
        "Protect deep work time"
      ]
    },
    {
      id: 6,
      trait: "Network Strategy",
      why: "Depth over breadth; quarterly value-adds to mentors/peers (useful link, small help, no ask).",
      how: [
        "Focus on fewer, deeper relationships",
        "Quarterly check-ins with value-adds",
        "Share useful resources without asking for anything",
        "Provide small, meaningful help regularly"
      ]
    },
    {
      id: 7,
      trait: "Reliability Brand",
      why: "Shows up early, delivers when promised, updates proactively if risk to timeline appears.",
      how: [
        "Arrive 5-10 minutes early to meetings",
        "Deliver on commitments or communicate delays early",
        "Proactively update stakeholders on risks",
        "Build reputation through consistent execution"
      ]
    }
  ];

  const physicalSections = [
    {
      id: 'consistency',
      title: 'Consistency Over Intensity',
      why: "Never breaks the chain; minimum viable session on bad days.",
      how: [
        "Maintain daily minimum viable sessions even on difficult days",
        "Focus on showing up rather than perfect performance",
        "Build unbreakable habits through small, consistent actions",
        "Track streaks and protect them at all costs"
      ]
    },
    {
      id: 'risk-aware',
      title: 'Risk-Aware Training',
      why: "Avoids injury tail-risk; prioritizes longevity, posture, and sleep regularity.",
      how: [
        "Prioritize injury prevention over intensity",
        "Maintain proper form over heavy weights",
        "Focus on sleep quality and recovery",
        "Regular posture checks and corrections"
      ]
    },
    {
      id: 'process-fidelity',
      title: 'Process Fidelity',
      why: "Logs basics (sleep regularity, resting HR, posture checks) like production metrics.",
      how: [
        "Track sleep patterns and quality daily",
        "Monitor resting heart rate trends",
        "Regular posture assessments",
        "Treat health metrics like production KPIs"
      ]
    },
    {
      id: 'calm-presence',
      title: 'Calm Presence',
      why: "Tall posture, relaxed shoulders, economical movement; simple, durable clothes.",
      how: [
        "Maintain tall, confident posture",
        "Keep shoulders relaxed and open",
        "Move with purpose and efficiency",
        "Wear simple, durable, well-fitted clothes"
      ]
    },
    {
      id: 'recovery-policy',
      title: 'Recovery is Policy',
      why: "Treats recovery as a requirement, not a reward.",
      how: [
        "Schedule recovery time like any other commitment",
        "Prioritize sleep, nutrition, and stress management",
        "View recovery as investment, not luxury",
        "Never skip recovery for more training"
      ]
    }
  ];

  const mentalTraits = [
    {
      id: 'systems-thinker',
      title: 'Systems Thinker',
      why: "Frames work as contracts, interfaces, and feedback loops.",
      how: [
        "Think in terms of system architecture and interfaces",
        "Design for observability and rollback paths",
        "Create clear contracts between components",
        "Build feedback loops for continuous improvement"
      ]
    },
    {
      id: 'evidence-led',
      title: 'Evidence-Led Decision Making',
      why: "Assumptions → experiment → result → next action; updates beliefs when data disagrees.",
      how: [
        "Start with clear assumptions and hypotheses",
        "Design small, testable experiments",
        "Measure results objectively",
        "Update beliefs based on evidence, not opinions"
      ]
    },
    {
      id: 'focus-protocol',
      title: 'Focus Protocol',
      why: "Pomodoro/blocks, '1-3-5' daily outcomes, inbox in short windows.",
      how: [
        "Use time-blocking for deep work sessions",
        "Define 1 big, 3 medium, 5 small daily outcomes",
        "Process inbox in dedicated, short time windows",
        "Protect focus time from interruptions"
      ]
    },
    {
      id: 'stress-playbook',
      title: 'Stress Playbook',
      why: "4-7-8 breathing → 10-minute walk → 3-bullet journal → call a friend if needed.",
      how: [
        "Practice 4-7-8 breathing technique",
        "Take 10-minute walks for mental reset",
        "Write 3-bullet journal entries for clarity",
        "Reach out to friends when stress persists"
      ]
    },
    {
      id: 'learning-cadence',
      title: 'Learning Cadence',
      why: "Daily reading + 15-minute teach-back note; weekly mini-project or replication.",
      how: [
        "Read for at least 30 minutes daily",
        "Write 15-minute teach-back notes",
        "Complete weekly mini-projects or replications",
        "Share learnings with others"
      ]
    },
    {
      id: 'ego-management',
      title: 'Ego Management',
      why: "Low-ego, high-ownership; documents mistakes in a 'failure ledger.'",
      how: [
        "Take full ownership of outcomes",
        "Document failures and lessons learned",
        "Separate self-worth from performance",
        "Focus on growth over being right"
      ]
    }
  ];

  const financialRules = [
    {
      id: 'account-structure',
      title: '🏦 Account Structure',
      content: [
        '💰 Bank of America Checking: Daily expenses & buffer. NEVER exceed $7,500. Once exceeded, split 80% to Fidelity Brokerage, 20% to Charles Schwab.',
        '🎯 Fidelity Brokerage Account: Primary investment account. Contains all stock investments (Tech, Healthcare, Speculative, ETFs).',
        '📊 Cash Reserve (Fidelity): Market crash deployment fund. ONLY used when market crashes (VIX-based triggers). Deploys in specific ratios: 5% Speculative, 30% Tech, 15% Healthcare, 50% ETFs.',
        '🛡️ Fundamental Bank Insurance Reserve: Backup after Cash Reserve depleted. Used ONLY after Cash Reserve is 100% deployed during sustained market crashes.',
        '🚨 Secondary Bank Insurance Reserve: LAST RESORT emergency fund. Market cap: $1,000. Held in SPAXX (highly liquid). NEVER touch unless absolute emergency.',
        '💎 Charles Schwab Account: Savings account extension (NOT investment account). All funds in SGOV. Higher yield than traditional savings. Pull from here for discretionary spending.'
      ]
    },
    {
      id: 'key-accounts-summary',
      title: '🗂️ Key Accounts Summary',
      content: [
        '🏦 Bank of America: ≤$7,500 (daily expenses)',
        '💎 Charles Schwab: Savings in SGOV (for spending)',
        '📈 Fidelity Brokerage: All investments (stocks + ETFs)',
        '💰 Cash Reserve (Fidelity): Market crash deployment',
        '🛡️ Fundamental Reserve: After Cash Reserve depleted',
        '🚨 Secondary Reserve: $1,000 cap (SPAXX)',
        '🎯 Personal Roth IRA: $700/month (tax-free retirement)',
        '👨‍👦 Dad\'s Roth IRA: $500/month (until 2032)'
      ]
    },
    {
      id: 'income-allocation',
      title: '💸 Monthly Income Allocation',
      content: [
        '📥 After all monthly expenses (rent, food, water, transportation, Roth IRA contributions, Dad\'s Roth IRA, emergency $500 buffer)...',
        '📊 Split remaining net income:',
        '   • 80% → Fidelity Brokerage Account (investment ratio based on Buffett Indicator)',
        '   • 20% → Charles Schwab Account (buy SGOV)',
        '',
        '🎚️ Buffett Indicator Investment Ratios (Investment:Cash Reserve):',
        '   • >200%: 2:1 ratio (more conservative, build cash reserve)',
        '   • 100-200%: 3:1 ratio (balanced approach)',
        '   • <100%: 4:1 ratio (aggressive, market is undervalued)',
        '',
        '🤖 AUTOMATIC LIVE UPDATES:',
        '   • System fetches live data from buffettindicator.net every hour',
        '   • Ratio automatically adjusts based on market conditions',
        '   • Check the "Live Market Valuation" panel above for current settings',
        '   • ⚙️ Manual override available if needed'
      ]
    },
    {
      id: 'investment-splits',
      title: '📈 Investment Portfolio Splits',
      content: [
        '🔷 50% Exchange Traded Funds (ETFs):',
        '   • QQQM: 37.5% of the 50%',
        '   • SCHG: 25% of the 50%',
        '   • SPLG: 25% of the 50%',
        '   • VT: 12.5% of the 50%',
        '',
        '💻 30% Technology Investments:',
        '   • Requirements: >$100B market cap, big/pivotal player, proven sales, undervalued',
        '   • Current holdings: GOOGL, GOOG, TSM',
        '   • 🔒 HOLD FOREVER - never sell these positions',
        '   • Bull case: [Google] Dominant search + cloud growth + AI leadership',
        '   • Bull case: [TSM] Global chip leader + Apple/Nvidia supplier + monopolistic moat',
        '',
        '🏥 15% Healthcare Investments:',
        '   • Requirements: >$100B market cap, reputable names, undervalued medical companies',
        '   • Current: UNH (UnitedHealth Group)',
        '   • Future considerations: PFE (Pfizer), NVO (Novo Nordisk) if criteria met',
        '   • 🔒 HOLD FOREVER - never sell unless fundamentals break',
        '',
        '🎲 5% Speculative Investments:',
        '   • AmpyFin AI recommendations: undervalued assets expected to rise within 12 months',
        '   • ⚠️ EXCEPTION: Can sell after 3-month minimum hold period',
        '   • Lock period: Cannot sell until 3 months expire from purchase date'
      ]
    },
    {
      id: 'roth-ira-personal',
      title: '🎯 Personal Roth IRA (Starting 2026)',
      content: [
        '💰 Monthly Contribution: $700/month',
        '⏰ Goal: Fully funded by end of October each year',
        '',
        '📊 50% Nasdaq Roth IRA ($3,500 annually):',
        '   • QQQM: $2,100',
        '   • SCHG: $1,050',
        '   • XLC: $350',
        '',
        '📊 30% SPY Roth IRA ($2,100 annually):',
        '   • SPLG: $1,680',
        '   • VIG: $210',
        '   • SPYV: $210',
        '',
        '📊 20% Dow Jones Roth IRA ($1,400 annually):',
        '   • DJD: $560',
        '   • SCHD: $560',
        '   • VTV: $280',
        '',
        '✅ Once Roth IRA is maxed: Redirect $700/month to Brokerage/Cash Reserve per Buffet Indicator ratio'
      ]
    },
    {
      id: 'roth-ira-dad',
      title: '👨‍👦 Dad\'s Roth IRA (Starting 2026)',
      content: [
        '💰 Our Contribution: $500/month until Dad reaches age 60 (year 2032)',
        '⚠️ Contingency: Dad MUST contribute $2,000 of his own money',
        '',
        '📊 Investment Allocation (Total $8,000 annually):',
        '   • 50% QQQM: $3,500',
        '   • 30% SPLG: $2,100',
        '   • 20% SCHD: $1,400',
        '',
        '🔐 Management: Mom executes trades in Fidelity, we control what to buy',
        '🔒 HOLD UNTIL DAD IS 60 - This is his retirement fund',
        '💡 After Roth IRA maxed: Redirect $500/month to Brokerage/Cash Reserve'
      ]
    },
    {
      id: 'vix-deployment',
      title: '🚨 Market Crash Deployment Protocol (VIX-Based)',
      content: [
        '⚡ WHEN MARKET CRASHES - Deploy Cash Reserve:',
        '',
        '📉 Cash Reserve Deployment:',
        '   • VIX ≥ 30: Deploy 25% of Cash Reserve',
        '   • VIX ≥ 35: Deploy 37.5% of remaining Cash Reserve',
        '   • VIX ≥ 40: Deploy 100% of remaining Cash Reserve',
        '',
        '🛡️ Fundamental Bank Insurance Reserve Deployment:',
        '   • VIX ≥ 40 (Day 2): Deploy 25% of Fundamental Reserve',
        '   • VIX ≥ 40 (Day 3): Deploy 37.5% of remaining Fundamental Reserve',
        '   • VIX ≥ 40 (Day 4): Deploy 100% of remaining Fundamental Reserve',
        '',
        '💎 Deployment Ratios (ALWAYS):',
        '   • 5% → Speculative investments',
        '   • 30% → Technology investments',
        '   • 15% → Healthcare investments',
        '   • 50% → Exchange Traded Funds',
        '',
        '🔒 IRON RULE: We NEVER EVER sell investments. NEVER.'
      ]
    },
    {
      id: 'discipline-rules',
      title: '⚔️ Discipline Rules (NON-NEGOTIABLE)',
      content: [
        '🚫 NEVER DEVIATE from the written plan. Read the runbook before placing orders.',
        '🔇 Ignore market noise & headlines. Fed moves ≠ investment reasons.',
        '🎯 Criteria-only decisions: If pre-set screen fits → invest. If not → pass.',
        '❌ Invalid "no": "I\'m scared about rate moves" or "price feels too high/low"',
        '✅ Valid "no": Violates fundamental guardrails (e.g., P/E in the 80s)',
        '',
        '💎 BROKERAGE STAYS BROKERAGE:',
        '   • No discretionary withdrawals for lifestyle',
        '   • Charles Schwab is for spending, NOT brokerage',
        '   • Bank of America checking: ≤ $7,500 maximum',
        '',
        '🔄 Reinvest ALL dividends until $5M portfolio',
        '📊 Invest as scheduled/triggered. NO EXCEPTIONS.',
        '',
        '🔒 WE NEVER SELL. NEVER EVER. NEVER.'
      ]
    },
    {
      id: 'withdrawal-order',
      title: '🆘 Emergency Withdrawal Order (LAST RESORT ONLY)',
      content: [
        '⚠️ USE CHARLES SCHWAB FIRST - That\'s what it\'s for!',
        '',
        '🔻 If you MUST withdraw from investments (in order):',
        '   1. Secondary Bank Insurance Reserve (SPAXX)',
        '   2. Fundamental Bank Insurance Reserve',
        '   3. Speculative investments (already have 3-month hold)',
        '   4. Cash Reserve (Fidelity - but this defeats the purpose)',
        '   5. Healthcare investments',
        '   6. Technology investments (GOOGL, GOOG, TSM)',
        '   7. ETFs (core holdings)',
        '   8. ☢️ NUCLEAR OPTION: Roth IRA (penalty + lost contribution space)',
        '',
        '✅ Valid Emergency Reasons:',
        '   • Cannot afford rent/insurance/food/water',
        '   • Medical emergency / accident compensation',
        '',
        '❌ INVALID Reasons (Use Charles Schwab instead):',
        '   • Gadgets, headphones, electronics',
        '   • Casual flights, vacations',
        '   • "Want" vs "Need" purchases'
      ]
    },
    {
      id: 'milestone-rewards',
      title: '🎯 Milestone Rewards',
      content: [
        '$12.5k → 125 push-ups (5×25)',
        '$15k → 150 push-ups (6×25)',
        '$20k → 200 push-ups (8×25)',
        '$25k → Mom AirPods Pro 2 (<$200)',
        '$50k → Dad AirPods Pro 2 (<$200)',
        '$75k → Self AirPods Pro 2 (<$200)',
        '$100k → Hamilton Murph (~$1k; aim 5–10% off)',
        '$200k → Dad DJI drone set (<$750, on sale)',
        '$500k → Mom laptop (<$3000) ✅ COMPLETED',
        '$750k → Dad laptop (<$3000) ✅ COMPLETED',
        '$1M → Junhee & Minjoon laptops (<$2000 each, their choice)',
        '$2M → Save $5k; $1k Visa cards to Jennifer & Vicky; $3k travel to meet, one meal each (no "ask," just gratitude)',
        '$5M → Dream PC setup (<$10k total, planned)',
        '$10M → Retire (keep building AmpyFin). Stop dividend reinvestment in Roth IRA; live on dividends + AmpyFin + bank savings. Donate $50k of school supplies to Korean orphanages'
      ]
    },
    {
      id: 'monthly-cadence',
      title: '📅 Monthly Cadence & Reviews',
      content: [
        '📊 First Monday of Every Month:',
        '   • Review plan and verify using spreadsheet and Google Doc',
        '   • Determine where to transfer how much',
        '   • Decide what to buy and how much of it to buy',
        '   • Verify decisions on Google Doc and spreadsheet',
        '   • Buy those assets according to the plan',
        '   • Make necessary changes in accounts',
        '   • Reflect all changes on spreadsheet and Google Doc',
        '   • Log out and close brokerage',
        '',
        '🔒 Brokerage Access Protocol:',
        '   • We DO NOT look at brokerage accounts regularly',
        '   • Only check brokerage when VIX Index > 30',
        '   • VIX > 30 = Market crash = Deploy cash reserve time',
        '   • Monitor VIX at: https://finance.yahoo.com/quote/%5EVIX/',
        '',
        '⚠️ CRITICAL REMINDERS:',
        '   • NEVER SELL - DO NOT PANIC',
        '   • We invest in ratios specified and amounts planned',
        '   • DO NOT try to time the market',
        '   • Time in the market TRIUMPHS over timing the market',
        '   • Our wealth is built through consistency, not timing',
        '',
        '🔍 Mid-Month Review:',
        '   • Rule audit: Did I follow the plan?',
        '   • Subscription cull: Cancel unused services',
        '   • Confirm no brokerage leaks or withdrawals',
        '',
        '📝 Documentation (Google Doc):',
        '   • Every action recorded: date, trigger, amount, instrument, rule cited',
        '   • Monthly summary: wins, mistakes, lessons learned'
      ]
    }
  ];

  const careerRules = [
    {
      id: 'first-principles-builder',
      title: 'First-Principles Builder',
      why: "Starts with schemas/contracts, then transport; favors observability and rollback paths.",
      how: [
        "Design systems from first principles",
        "Start with clear schemas and contracts",
        "Build observability into every system",
        "Always plan rollback paths"
      ]
    },
    {
      id: 'conservative-operator',
      title: 'Conservative Operator',
      why: "Reversible changes, feature flags, p95/p99 tracked, error budgets respected.",
      how: [
        "Make all changes reversible by default",
        "Use feature flags for gradual rollouts",
        "Track p95/p99 performance metrics",
        "Respect error budgets and SLAs"
      ]
    },
    {
      id: 'credibility-strategy',
      title: 'Credibility Strategy',
      why: "Ships small, end-to-end examples others can run; clean READMEs, reproducible environments.",
      how: [
        "Ship small, complete examples",
        "Write clean, comprehensive READMEs",
        "Ensure reproducible environments",
        "Make code runnable by others"
      ]
    },
    {
      id: 'stakeholder-fluent',
      title: 'Stakeholder Fluent',
      why: "Can explain the same system to quants, SREs, compliance, and PMs with consistent logic.",
      how: [
        "Adapt communication style to audience",
        "Maintain consistent technical logic",
        "Explain complex systems simply",
        "Build bridges between different teams"
      ]
    },
    {
      id: 'long-game',
      title: 'Long-Game Strategy',
      why: "Chooses roles/projects that compound skills, signal, and network; keeps lifestyle flat while income rises.",
      how: [
        "Choose projects that compound skills",
        "Build strong professional network",
        "Keep lifestyle costs flat",
        "Focus on long-term value creation"
      ]
    },
    {
      id: 'public-artifacts',
      title: 'Public Artifacts',
      why: "Treats AmpyFin repos/docs as proof of judgment and standards (clean contracts, typed configs, tracing).",
      how: [
        "Maintain high-quality public repos",
        "Write clean, typed configurations",
        "Implement proper tracing and monitoring",
        "Use AmpyFin as portfolio showcase"
      ]
    },
    {
      id: 'communication-style',
      title: 'Communication Style',
      why: "Tone: Calm, specific, kind. Message structure: Context → decision/ask → two options → next step → owner & date.",
      how: [
        "Maintain calm, specific, kind tone",
        "Structure messages clearly",
        "Provide context and options",
        "Always include next steps and ownership"
      ]
    },
    {
      id: 'meeting-habits',
      title: 'Meeting Habits',
      why: "Agenda or cancel; wraps with a 60-second summary and assignments.",
      how: [
        "Require agenda or cancel meeting",
        "Provide 60-second summary at end",
        "Assign clear action items",
        "Follow up on commitments"
      ]
    }
  ];

  const dailyWeeklyOS = [
    {
      id: 'morning-routine',
      title: 'Morning Routine',
      content: [
        'Hydrate → 10-minute mobility → top 3 outcomes → deep-work block before comms',
        'Start with hydration and light movement',
        'Define top 3 outcomes for the day',
        'Protect deep work time before checking communications',
        'Focus on high-impact work first'
      ]
    },
    {
      id: 'midday-routine',
      title: 'Midday Routine',
      content: [
        'Short walk; focused inbox pass',
        'Take a 10-minute walk for mental reset',
        'Process inbox in focused, time-limited sessions',
        'Avoid reactive communication patterns',
        'Maintain energy and focus'
      ]
    },
    {
      id: 'evening-routine',
      title: 'Evening Routine',
      content: [
        'Skill block or review; plan tomorrow',
        'Dedicate time to skill development or review',
        'Plan the next day\'s priorities',
        'Reflect on daily outcomes',
        'Prepare for tomorrow\'s deep work'
      ]
    },
    {
      id: 'weekly-review',
      title: 'Weekly Review',
      content: [
        'Money (delta + fees), Body (basics), Mind (what I learned), Work (shipped), Social (who I helped)',
        'Review financial progress and fees',
        'Assess physical health basics',
        'Document key learnings',
        'Track work deliverables',
        'Reflect on social contributions'
      ]
    },
    {
      id: 'red-green-flags',
      title: 'Red / Green Flags',
      content: [
        'Green: On-time deliverables, DRIP active, rule-based executions, transparent post-mortems',
        'Red: "Gut-feel" trades, brokerage withdrawals for lifestyle, tool-buying sprees, skipping reviews',
        'Monitor these indicators weekly',
        'Celebrate green flags, address red flags immediately',
        'Use as early warning system'
      ]
    }
  ];

  const ampyfinPlans = [
    {
      id: 'august-september',
      title: 'August-September 2025: OSS Models Release',
      content: [
        'Release all OSS Models:',
        '• Running golang to fetch data, not hardcoded',
        '• Pipelined designs, fully customizable',
        '• Can run GUI mode using PyQt5 or golang equivalent',
        '• Can run quietly on console to feed to enterprise system',
        '• Have enterprise system running on Oracle Cloud trading actual securities ($1000 upfront)',
        '• Documentation of how to run each system',
        '• Supports plugin architecture to enterprise system (also open source)'
      ]
    },
    {
      id: 'october',
      title: 'October 2025: Mobile-First Infrastructure',
      content: [
        'Mobile-First Infrastructure & Website Revamp:',
        '• RESTful API support for v3.0.1 short term, medium term, and long term decisions',
        '• WebSocket for real-time data streaming of live trades',
        '• Set up secure API gateway',
        '• Implement real-time notification system',
        '• Complete API documentation',
        '• Overall make the website robust'
      ]
    },
    {
      id: 'november',
      title: 'November 2025: Monetization & App Features',
      content: [
        'Monetization & App Features:',
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
      id: 'december',
      title: 'December 2025: Finalization & Launch',
      content: [
        'System Finalization & Launch:',
        '• Complete Android app development',
        '• Complete iOS app development',
        '• Conduct comprehensive testing',
        '• Implement user feedback system',
        '• Finalize security measures',
        '• Complete performance optimization',
        '• December 31, 2025: Launch date of AmpyFin App and Billing',
        '• Plan marketing campaign - announce on LinkedIn',
        '• Announce in YCombinator application'
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
      title: 'Wednesday - Core Day',
      exercises: [
        { 
          name: 'Crunches', 
          sets: [
            { reps: 15, intensity: 'light', count: 3 },
            { reps: 20, intensity: 'medium', count: 3 },
            { reps: 25, intensity: 'heavy', count: 2 }
          ]
        },
        { 
          name: 'Plank', 
          sets: [
            { reps: 30, intensity: 'light', count: 3, note: '30 seconds each' },
            { reps: 45, intensity: 'medium', count: 2, note: '45 seconds each' }
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
      title: 'Friday - Cardio Day',
      exercises: [
        { 
          name: 'Outdoor Run', 
          sets: [
            { reps: 4, intensity: 'medium', count: 1, note: '4 miles outside - maintain steady pace' }
          ]
        },
        { 
          name: 'Cool Down Walk', 
          sets: [
            { reps: 5, intensity: 'light', count: 1, note: '5 minutes walking to cool down' }
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
    }
  ];

  // Section quotes - inspirational philosophy for each pillar
  const sectionQuotes = {
    social: "The measure of character lives not in the words we speak, but in the warmth we bring to others, the credit we give freely, and the space we create where truth feels safe.",
    physical: "The body is not a temple to be worshipped, but a system to be optimized—where consistency compounds into strength, and every day protected becomes a year extended.",
    mental: "Clarity emerges not from thinking harder, but from thinking better—building systems that think for you, experiments that teach you, and evidence that liberates you from ego.",
    financial: "Wealth is not built in the moments of fear or greed, but in the patient execution of a plan—where discipline outlasts emotion, and time in the market defeats timing the market.",
    career: "Mastery is not accidental brilliance, but deliberate architecture—where every system you build teaches others, every decision compounds your credibility, and every project extends your reach.",
    'daily-os': "Excellence is not an event but an operating system—where morning clarity sets intention, midday movement resets focus, and evening reflection compounds wisdom.",
    workout: "Strength is not forged in single heroic efforts, but in the accumulation of disciplined repetitions—where progressive overload meets unwavering consistency, and patience transforms into power."
  };

  const renderContent = () => {
    // Quote component for each section
    const SectionQuote = ({ quote }) => (
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.8) 100%)',
        borderLeft: '3px solid #FFFFFF',
        borderRadius: '0',
        fontStyle: 'italic',
        fontSize: '1.05rem',
        lineHeight: '1.8',
        color: '#E5E5E5',
        position: 'relative',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '20px',
          fontSize: '3rem',
          color: 'rgba(255,255,255,0.2)',
          fontFamily: 'Georgia, serif',
          lineHeight: 1
        }}>"</div>
        <div style={{ paddingLeft: '1rem', paddingTop: '0.5rem' }}>
          {quote}
        </div>
        <div style={{
          position: 'absolute',
          bottom: '5px',
          right: '20px',
          fontSize: '3rem',
          color: 'rgba(255,255,255,0.2)',
          fontFamily: 'Georgia, serif',
          lineHeight: 1
        }}>"</div>
      </div>
    );

    switch(activeSection) {
      case 'social':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SectionQuote quote={sectionQuotes.social} />
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
            <SectionQuote quote={sectionQuotes.physical} />
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
                    <p style={{ 
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      <strong>Why It Matters:</strong> {section.why}
                    </p>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>Practical Ways to Cultivate:</strong>
                      <ul style={{ 
                        listStyle: 'none',
                        padding: '0.5rem 0 0 1rem'
                      }}>
                        {section.how.map((step, index) => (
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
      case 'mental':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SectionQuote quote={sectionQuotes.mental} />
            {mentalTraits.map((trait) => (
              <div 
                key={trait.id}
                style={{
                  backgroundColor: 'var(--first-color-lighter)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedTrait(expandedTrait === trait.id ? null : trait.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedTrait === trait.id ? '1rem' : 0
                }}>
                  <h4 style={{ margin: 0, color: 'var(--title-color)' }}>
                    {trait.title}
                  </h4>
                  <span>{expandedTrait === trait.id ? '−' : '+'}</span>
                </div>
                
                {expandedTrait === trait.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ 
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      <strong>Why It Matters:</strong> {trait.why}
                    </p>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>Practical Ways to Cultivate:</strong>
                      <ul style={{ 
                        listStyle: 'none',
                        padding: '0.5rem 0 0 1rem'
                      }}>
                        {trait.how.map((step, index) => (
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
      case 'career':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SectionQuote quote={sectionQuotes.career} />
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
                    <p style={{ 
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      <strong>Why It Matters:</strong> {rule.why}
                    </p>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>Practical Ways to Cultivate:</strong>
                      <ul style={{ 
                        listStyle: 'none',
                        padding: '0.5rem 0 0 1rem'
                      }}>
                        {rule.how.map((step, index) => (
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
      case 'daily-os':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SectionQuote quote={sectionQuotes['daily-os']} />
            {dailyWeeklyOS.map((routine) => (
              <div 
                key={routine.id}
                style={{
                  backgroundColor: 'var(--first-color-lighter)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => setExpandedTrait(expandedTrait === routine.id ? null : routine.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: expandedTrait === routine.id ? '1rem' : 0
                }}>
                  <h4 style={{ margin: 0, color: 'var(--title-color)' }}>
                    {routine.title}
                  </h4>
                  <span>{expandedTrait === routine.id ? '−' : '+'}</span>
                </div>
                
                {expandedTrait === routine.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <ul style={{ 
                      listStyle: 'none',
                      padding: '0.5rem 0 0 1rem',
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'var(--text-color)'
                    }}>
                      {routine.content.map((item, index) => (
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <SectionQuote quote={sectionQuotes.financial} />
            {/* Live Buffett Indicator Display */}
            <div style={{
              background: 'rgba(6,0,32,0.8)',
              borderRadius: '1rem',
              padding: '2rem',
              border: buffettIndicator > 200 ? '1px solid rgba(255,255,255,0.3)' : 
                      buffettIndicator >= 100 ? '1px solid rgba(229,229,229,0.4)' : 
                      '1px solid rgba(64,255,218,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <h3 style={{
                color: '#FFFFFF',
                marginBottom: '1rem',
                fontFamily: 'monospace',
                fontSize: '1.3rem'
              }}>
                📊 Live Market Valuation
              </h3>
              
              {buffettIndicator ? (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.03)',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>Buffett Indicator</div>
                      <div style={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold',
                        color: buffettIndicator > 200 ? '#FFFFFF' : 
                               buffettIndicator >= 100 ? '#FFFFFF' : '#E5E5E5'
                      }}>
                        {buffettIndicator.toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.3rem' }}>
                        {buffettIndicator > 200 ? '🔴 Significantly Overvalued' :
                         buffettIndicator > 160 ? '🟠 Modestly Overvalued' :
                         buffettIndicator > 135 ? '🟡 Fair Valued' :
                         buffettIndicator > 111 ? '🟢 Modestly Undervalued' :
                         '🟢 Significantly Undervalued'}
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255,201,6,0.1)',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(229,229,229,0.3)'
                    }}>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>Auto Investment Ratio</div>
                      <div style={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold',
                        color: '#FFFFFF'
                      }}>
                        {investmentRatio}
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.3rem' }}>
                        Investment : Cash Reserve
                      </div>
                    </div>
                    
                    <div style={{
                      background: vixIndex && vixIndex >= 30 ? 'rgba(255,255,255,0.1)' : 'rgba(64,255,218,0.1)',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${vixIndex && vixIndex >= 30 ? 'rgba(255,255,255,0.4)' : 'rgba(64,255,218,0.3)'}`,
                      boxShadow: vixIndex && vixIndex >= 30 ? '0 0 20px rgba(255,255,255,0.2)' : 'none'
                    }}>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                        VIX Index (Fear Gauge)
                        <a 
                          href="https://finance.yahoo.com/quote/%5EVIX/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            marginLeft: '0.5rem', 
                            fontSize: '0.7rem', 
                            opacity: 0.6,
                            color: '#E5E5E5',
                            textDecoration: 'none'
                          }}
                        >
                          [Live Data]
                        </a>
                      </div>
                      <div style={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold',
                        color: vixIndex ? (
                          vixIndex >= 40 ? '#FFFFFF' :
                          vixIndex >= 35 ? '#FFFFFF' :
                          vixIndex >= 30 ? '#FFFFFF' : '#E5E5E5'
                        ) : '#FFFFFF',
                        textShadow: vixIndex && vixIndex >= 30 ? '0 0 10px rgba(255,255,255,0.6)' : 'none'
                      }}>
                        {vixIndex !== null && vixIndex !== undefined ? vixIndex.toFixed(2) : '⚠️ FETCH FAILED'}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        opacity: 0.7, 
                        marginTop: '0.3rem',
                        fontWeight: vixIndex && vixIndex >= 30 ? 'bold' : 'normal',
                        color: vixIndex && vixIndex >= 30 ? '#FFFFFF' : vixIndex === null ? '#FFFFFF' : 'inherit'
                      }}>
                        {vixIndex !== null && vixIndex !== undefined ? (
                          vixIndex >= 40 ? '🚨 DEPLOY 100% CASH RESERVE!' :
                          vixIndex >= 35 ? '⚠️ DEPLOY 37.5% CASH RESERVE' :
                          vixIndex >= 30 ? '📢 DEPLOY 25% CASH RESERVE' :
                          '✅ Normal Market - Stay The Course'
                        ) : 'Check browser console for error details'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '0.85rem',
                    opacity: 0.7,
                    textAlign: 'center',
                    padding: '0.75rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '0.5rem'
                  }}>
                    📡 Buffett Indicator: {lastFetchTime ? lastFetchTime.toLocaleTimeString() : 'Loading...'}
                    <br />
                    📡 VIX Index: {vixLastFetchTime ? vixLastFetchTime.toLocaleTimeString() : 'Loading...'}
                    <br />
                    <span style={{ fontSize: '0.75rem' }}>
                      Updates automatically every hour from live sources
                      {buffettIndicator === 220.8 && ' (using fallback data if fetch failed)'}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                  <div style={{ opacity: 0.7, marginBottom: '0.5rem' }}>Loading live market data...</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                    Fetching from buffettindicator.net via CORS proxy
                    <br />
                    Check browser console for details
                  </div>
                </div>
              )}
            </div>

            {/* Financial Rules Section */}
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

          </div>
        );
      case 'workout':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <SectionQuote quote={sectionQuotes.workout} />
            {/* Bulk/Cut Mode Switcher */}
            <div style={{
              background: 'rgba(6,0,32,0.8)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    color: bulkMode ? '#FFFFFF' : '#FFFFFF',
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
                        'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))' :
                        'linear-gradient(135deg, rgba(229,229,229,0.3), rgba(229,229,229,0.2))',
                      border: `1px solid ${bulkMode ? 'rgba(255,255,255,0.4)' : 'rgba(229,229,229,0.5)'}`,
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
              </div>
            </div>

            {/* Workout Schedule */}
            {workoutSchedule.map((day) => (
              <div 
                key={day.id}
                className="workout-day"
                style={{
                  backgroundColor: 'rgba(6,0,32,0.6)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255,255,255,0.2)'
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
                    color: '#FFFFFF',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem'
                  }}>
                    {day.title}
                  </h3>
                  <span style={{
                    color: 'rgba(255,255,255,0.6)',
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
                          background: 'rgba(255,255,255,0.03)',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(255,255,255,0.1)'
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
                                color: set.intensity === 'light' ? '#FFFFFF' :
                                       set.intensity === 'medium' ? '#FFB81C' :
                                       set.intensity === 'heavy' ? '#FFFFFF' :
                                       '#8B0000',
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
        signed: "October 10, 2025 at 12:00 AM EST",
        effective: "October 10, 2025 at 12:00 AM EST"
      },
      physical: {
        signed: "October 10, 2025 at 12:00 AM EST",
        effective: "October 10, 2025 at 12:00 AM EST"
      },
      mental: {
        signed: "October 10, 2025 at 12:00 AM EST",
        effective: "October 10, 2025 at 12:00 AM EST"
      },
      financial: {
        signed: "October 10, 2025 at 12:00 AM EST",
        effective: "October 10, 2025 at 12:00 AM EST"
      },
      career: {
        signed: "October 10, 2025 at 12:00 AM EST",
        effective: "October 10, 2025 at 12:00 AM EST"
      },
      'daily-os': {
        signed: "October 10, 2025 at 12:00 AM EST",
        effective: "October 10, 2025 at 12:00 AM EST"
      },
      workout: {
        signed: "October 10, 2025 at 12:00 AM EST",
        effective: "October 10, 2025 at 12:00 AM EST"
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
          color: 'rgba(255,255,255,0.6)',
          fontSize: '1rem',
          fontStyle: 'italic',
          fontFamily: 'serif',
          textAlign: 'center',
          padding: '1rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          "I'd rather survive on one meal a day pursuing work that keeps me awake at night, than feast three times daily on work that never enters my dreams."
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
            src="https://www.youtube.com/embed/hj6Tmm90tOE"
            title={`A-Man Project ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Inspiration`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              borderRadius: '0',
              border: '1px solid rgba(255,255,255,0.2)',
              borderLeft: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
              maxWidth: '560px',
              clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
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
            textShadow: '0 0 20px rgba(255,255,255,0.5)',
            padding: '1rem'
          }}>
            Yeon Lee
          </div>
          <div style={{
            width: '250px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
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
          color: 'rgba(255,255,255,0.5)',
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
        linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #000000 100%),
        radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 50%),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 100px,
          rgba(255,255,255,0.02) 100px,
          rgba(255,255,255,0.02) 101px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 100px,
          rgba(255,255,255,0.02) 100px,
          rgba(255,255,255,0.02) 101px
        )
      `,
      color: '#E5E5E5',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.3s ease',
      borderTop: '1px solid #FFFFFF',
      borderBottom: '1px solid #FFFFFF'
    }}>
      {/* Hexagonal data grid pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, transparent 40%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.03) 41%, transparent 41%),
          radial-gradient(circle at 75% 75%, transparent 40%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.03) 41%, transparent 41%)
        `,
        backgroundSize: '60px 60px',
        opacity: 0.5,
        zIndex: 0
      }}/>

      {/* Intelligence data streams - corner accents */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '150px',
        height: '150px',
        background: `
          linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.15) 48%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 52%, transparent 55%),
          linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.1) 48%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 52%, transparent 55%)
        `,
        opacity: 0.3,
        zIndex: 0,
        clipPath: 'polygon(70% 0, 100% 0, 100% 30%)'
      }}/>
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '150px',
        height: '150px',
        background: `
          linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.15) 48%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 52%, transparent 55%),
          linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.1) 48%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 52%, transparent 55%)
        `,
        opacity: 0.3,
        zIndex: 0,
        clipPath: 'polygon(0 70%, 0 100%, 30% 100%)'
      }}/>

      <style>
        {`
          @keyframes dataStream {
            0% { background-position: 0 0; }
            100% { background-position: 100px 100px; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.01); }
          }
          @keyframes palantirGlow {
            0%, 100% { 
              box-shadow: 0 0 10px rgba(255,255,255,0.3),
                         0 0 20px rgba(255,255,255,0.1),
                         inset 0 0 10px rgba(255,255,255,0.1);
            }
            50% { 
              box-shadow: 0 0 15px rgba(255,255,255,0.5),
                         0 0 30px rgba(255,255,255,0.2),
                         inset 0 0 15px rgba(255,255,255,0.15);
            }
          }
          @keyframes dataScan {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 0.6; }
            100% { transform: translateY(100%); opacity: 0; }
          }
          @keyframes scanLine {
            0% { transform: translateX(0); }
            100% { transform: translateX(300px); }
          }
          .nav-button {
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.2) !important;
            border-left: 2px solid rgba(255,255,255,0.3) !important;
            background: linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(10,10,10,0.9) 100%) !important;
            clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
          }
          .nav-button:before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s ease;
          }
          .nav-button:hover:before {
            left: 100%;
          }
          .nav-button.active {
            animation: palantirGlow 3s infinite;
            border: 1px solid rgba(255,255,255,0.6) !important;
            border-left: 2px solid #FFFFFF !important;
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.9) 100%) !important;
          }
          .content-card {
            transition: all 0.2s ease;
            border: 1px solid rgba(255,255,255,0.2);
            border-left: 2px solid rgba(255,255,255,0.3);
            position: relative;
            clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          }
          .content-card:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #FFFFFF, transparent);
            background-size: 200% 100%;
            animation: dataScan 4s linear infinite;
            pointer-events: none;
            opacity: 0.5;
          }
          .content-card:hover {
            transform: translateY(-2px);
            box-shadow: 
              0 0 20px rgba(255,255,255,0.2),
              0 8px 25px rgba(0,0,0,0.6),
              inset 0 0 15px rgba(255,255,255,0.03);
            border-color: rgba(255,255,255,0.4);
            border-left-color: #FFFFFF;
          }
          .content-card:hover:before {
            opacity: 1;
          }
          .title-glow {
            animation: titleGlow 3s ease-in-out infinite;
            text-transform: uppercase;
            letter-spacing: 6px;
            font-weight: 700;
          }
          @keyframes titleGlow {
            0%, 100% { 
              filter: drop-shadow(0 0 3px rgba(255,255,255,0.4));
              text-shadow: 0 0 10px rgba(255,255,255,0.2);
            }
            50% { 
              filter: drop-shadow(0 0 6px rgba(255,255,255,0.6));
              text-shadow: 0 0 15px rgba(255,255,255,0.3);
            }
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
            position: 'relative',
            display: 'inline-block',
            padding: '0.5rem 2rem'
          }}>
            <span style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              filter: 'blur(4px)',
              zIndex: -1,
              pointerEvents: 'none'
            }}></span>
            <span style={{
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #E5E5E5 0%, #FFFFFF 40%, #E5E5E5 60%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: '"Helvetica Neue", "Arial", sans-serif'
            }}>
              A-MAN PROJECT
            </span>
          </span>
          <div style={{
            width: '400px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 20%, #FFFFFF 50%, rgba(255,255,255,0.3) 80%, transparent)',
            margin: '0.5rem auto',
            boxShadow: '0 0 10px rgba(255,255,255,0.4)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-1px',
              left: '0',
              width: '8px',
              height: '4px',
              background: '#FFFFFF',
              boxShadow: '0 0 8px #FFFFFF',
              animation: 'scanLine 3s linear infinite'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '-1px',
              right: '0',
              width: '8px',
              height: '4px',
              background: '#FFFFFF',
              boxShadow: '0 0 8px #FFFFFF',
              animation: 'scanLine 3s linear infinite reverse'
            }}></div>
          </div>
        </h2>
        
        <div className="container" style={{ padding: "2rem" }}>
          {/* Intelligence Control Panel - Navigation Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,0.95) 100%)',
            borderRadius: '0',
            clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
            backdropFilter: 'blur(10px)',
            boxShadow: 
              '0 8px 32px rgba(0,0,0,0.8), ' +
              'inset 0 1px 0 rgba(255,255,255,0.2), ' +
              'inset 0 -1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderTop: '1px solid #FFFFFF',
            flexWrap: 'wrap',
            position: 'relative'
          }}>
            {['social', 'physical', 'mental', 'financial', 'career', 'daily-os', 'workout'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`nav-button ${activeSection === section ? 'active' : ''}`}
                style={{
                  padding: '0.75rem 1.5rem',
                  color: activeSection === section ? '#FFFFFF' : 'rgba(229,229,229,0.7)',
                  cursor: 'pointer',
                  fontWeight: activeSection === section ? '700' : '500',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  fontSize: '0.75rem',
                  fontFamily: '"Helvetica Neue", "Arial", sans-serif',
                  minWidth: '110px',
                  whiteSpace: 'nowrap',
                  flex: '0 0 auto'
                }}
              >
                {section.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Intelligence Module - Content Section */}
          <div className="content-card" style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,0.95) 100%)',
            borderRadius: '0',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,255,255,0.03)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), #FFFFFF, rgba(255,255,255,0.5), transparent)',
              boxShadow: '0 0 15px rgba(255,255,255,0.4)'
            }}/>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '0.5rem',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: '"Helvetica Neue", "Arial", sans-serif',
              letterSpacing: '3px'
            }}>
              <span style={{
                display: 'inline-block'
              }}>
                <span style={{
                  color: '#FFFFFF',
                  background: 'linear-gradient(45deg, #E5E5E5, #FFFFFF, #E5E5E5, #FFFFFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                }}>{activeSection}</span>
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                opacity: 0.5,
                fontWeight: 'normal',
                color: 'rgba(255,255,255,0.6)'
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