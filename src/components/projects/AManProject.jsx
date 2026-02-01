import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import ReactFlow, { MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
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
  // Palantir-themed interactive layer
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [showOpsConsole, setShowOpsConsole] = useState(false);
  const [logs, setLogs] = useState([]);
  const [nodesPosition, setNodesPosition] = useState({ vix: { x: 78, y: 72 }, buffett: { x: 18, y: 72 } });
  const [draggingNode, setDraggingNode] = useState(null);
  const [overlays, setOverlays] = useState({ scanlines: false, hexGrid: true });
  const [founderMode, setFounderMode] = useState(false);
  const [vixSimEnabled, setVixSimEnabled] = useState(false);
  const [vixSimValue, setVixSimValue] = useState(30);
  const [showIntelGraph, setShowIntelGraph] = useState(false);
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);
  // Suspend background updates/animations while graph is open
  const suspendUiRef = useRef(false);
  const animationsStyleElRef = useRef(null);

  useEffect(() => {
    suspendUiRef.current = showIntelGraph;
    // Inject/remove global animation pause (but don't affect the graph itself)
    if (showIntelGraph) {
      const styleEl = document.createElement('style');
      styleEl.setAttribute('data-suspend-animations', 'true');
      styleEl.textContent = `
        html body *:not([data-graph-ui]):not([data-graph-ui] *) { 
          animation-play-state: paused !important; 
          transition: none !important; 
        }
        canvas:not([data-graph-ui] canvas), video { visibility: hidden !important; }
      `;
      document.head.appendChild(styleEl);
      animationsStyleElRef.current = styleEl;
    } else {
      const el = animationsStyleElRef.current || document.querySelector('style[data-suspend-animations="true"]');
      if (el && el.parentNode) el.parentNode.removeChild(el);
      animationsStyleElRef.current = null;
    }
  }, [showIntelGraph]);
  const keyBufferRef = useRef([]);

  const logEvent = (message) => {
    const entry = { time: new Date(), message };
    setLogs((prev) => [entry, ...prev].slice(0, 200));
  };

  // Derived VIX (simulation overrides live)
  const displayedVix = vixSimEnabled && vixSimValue !== null ? vixSimValue : vixIndex;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Load persisted UI state
  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem('amanNodesPos');
      if (savedNodes) setNodesPosition(JSON.parse(savedNodes));
      const savedOverlays = localStorage.getItem('amanOverlays');
      if (savedOverlays) setOverlays(JSON.parse(savedOverlays));
      const savedFounder = localStorage.getItem('amanFounderMode');
      if (savedFounder) setFounderMode(JSON.parse(savedFounder));
      const savedSim = localStorage.getItem('amanVixSim');
      if (savedSim) {
        const { enabled, value } = JSON.parse(savedSim);
        setVixSimEnabled(Boolean(enabled));
        if (typeof value === 'number') setVixSimValue(value);
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // Persist overlays and simulation
  useEffect(() => {
    localStorage.setItem('amanOverlays', JSON.stringify(overlays));
  }, [overlays]);

  useEffect(() => {
    localStorage.setItem('amanFounderMode', JSON.stringify(founderMode));
  }, [founderMode]);

  useEffect(() => {
    localStorage.setItem('amanVixSim', JSON.stringify({ enabled: vixSimEnabled, value: vixSimValue }));
  }, [vixSimEnabled, vixSimValue]);

  // Keyboard shortcuts and Konami Founder Mode
  useEffect(() => {
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    const onKeyDown = (e) => {
      // Command Palette: Cmd/Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((v) => !v);
        if (!isPaletteOpen) setPaletteQuery('');
        return;
      }
      // Ops Console: Shift+?
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        setShowOpsConsole((v) => !v);
        return;
      }
      // Konami detection
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key; // normalize
      keyBufferRef.current = [...keyBufferRef.current, key].slice(-konami.length);
      if (konami.every((k, i) => keyBufferRef.current[i] === k)) {
        if (!founderMode) {
          setFounderMode(true);
          logEvent('Founder Mode activated');
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPaletteOpen, founderMode]);

  // Drag handlers for market nodes
  useEffect(() => {
    const onMove = (e) => {
      if (!draggingNode) return;
      const x = Math.max(2, Math.min(95, (e.clientX / window.innerWidth) * 100));
      const y = Math.max(10, Math.min(88, (e.clientY / window.innerHeight) * 100));
      setNodesPosition((prev) => {
        const next = { ...prev, [draggingNode]: { x, y } };
        localStorage.setItem('amanNodesPos', JSON.stringify(next));
        return next;
      });
    };
    const onUp = () => setDraggingNode(null);
    const wrappedOnMove = (e) => { if (!suspendUiRef.current) onMove(e); };
    window.addEventListener('mousemove', wrappedOnMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', wrappedOnMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [draggingNode]);

  // Manual data fetchers (Ops/Palette actions)
  const refetchBuffett = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/buffett-indicator`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.success && data.buffettIndicator) {
        setBuffettIndicator(data.buffettIndicator);
        setLastFetchTime(new Date());
        let newRatio;
        if (data.buffettIndicator > 200) newRatio = '2:1';
        else if (data.buffettIndicator >= 100 && data.buffettIndicator <= 200) newRatio = '3:1';
        else newRatio = '4:1';
        setInvestmentRatio(newRatio);
        logEvent(`Buffett Indicator refreshed → ${data.buffettIndicator}% | Ratio ${newRatio}`);
      } else {
        throw new Error(data.error || 'Failed to fetch Buffett Indicator');
      }
    } catch (err) {
      logEvent(`Error refreshing Buffett Indicator: ${err.message}`);
    }
  };

  const refetchVix = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/vix`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.success && data.vix) {
        setVixIndex(data.vix);
        setVixLastFetchTime(new Date());
        logEvent(`VIX refreshed → ${data.vix} (${data.source || 'api'})`);
      } else {
        throw new Error(data.error || 'Failed to fetch VIX');
      }
    } catch (err) {
      logEvent(`Error refreshing VIX: ${err.message}`);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (suspendUiRef.current) return;
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch Buffett Indicator data from backend API
  useEffect(() => {
    const fetchBuffettIndicator = async () => {
      try {
        console.log('🔄 Fetching Buffett Indicator from backend...');
        
        // Use backend API endpoint
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/buffett-indicator`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.buffettIndicator) {
          setBuffettIndicator(data.buffettIndicator);
          setLastFetchTime(new Date());
          
          // Automatically set investment ratio based on Buffett Indicator
          let newRatio;
          if (data.buffettIndicator > 200) {
            newRatio = '2:1'; // Conservative - build more cash reserve
          } else if (data.buffettIndicator >= 100 && data.buffettIndicator <= 200) {
            newRatio = '3:1'; // Balanced
          } else {
            newRatio = '4:1'; // Aggressive - market undervalued
          }
          setInvestmentRatio(newRatio);
          
          console.log(`✅ Buffett Indicator updated: ${data.buffettIndicator}% | Ratio: ${newRatio}`);
          logEvent(`Buffett Indicator updated → ${data.buffettIndicator}% | Ratio ${newRatio}`);
        } else {
          throw new Error(data.error || 'Failed to fetch Buffett Indicator');
        }
      } catch (error) {
        console.error('❌ Error fetching Buffett Indicator:', error);
        // NO FALLBACK DATA - show the error clearly
        setBuffettIndicator(null);
        setInvestmentRatio(null);
        logEvent('Buffett Indicator fetch failed');
      }
    };

    // Fetch immediately on mount
    fetchBuffettIndicator();

    // Fetch every hour unless graph is open
    const interval = setInterval(() => {
      if (!suspendUiRef.current) fetchBuffettIndicator();
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  // Fetch VIX Index data from backend API
  useEffect(() => {
    const fetchVixIndex = async () => {
      console.log('🔄 Fetching VIX Index from backend...');
      
      try {
        // Use backend API endpoint
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/vix`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.vix) {
          setVixIndex(data.vix);
          setVixLastFetchTime(new Date());
          console.log(`✅ VIX INDEX: ${data.vix} (via ${data.source})`);
          logEvent(`VIX updated → ${data.vix} (${data.source})`);
        } else {
          throw new Error(data.error || 'Failed to fetch VIX');
        }
        
      } catch (error) {
        console.error('❌ Error fetching VIX:', error.message);
        console.error('💡 Make sure backend server is running at:', process.env.REACT_APP_API_URL || 'http://localhost:5001');
        setVixIndex(null);
        logEvent('VIX fetch failed');
      }
    };

    // Fetch immediately on mount
    fetchVixIndex();

    // Fetch every hour unless graph is open
    const interval = setInterval(() => {
      if (!suspendUiRef.current) fetchVixIndex();
    }, 3600000);

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
      id: 'monthly-deposits',
      title: '💸 Monthly Investment Deposits',
      content: [
        '📥 Monthly Investment Plan:',
        '',
        '💼 401k: MAX OUT ANNUALLY (employer match + tax advantages)',
        '🏥 HSA: MAX OUT ANNUALLY (triple tax advantage)',
        '   ETFs are covered in 401k and HSA',
        '',
        '👨‍👩‍👦 Mom and Dad Investment Account: $300/month',
        '   Investment allocation: $100 each in SCHD, QQQM, and SPYM',
        '   Purpose: Separate investment account for parents\' retirement planning',
        '   🔒 HOLD FOREVER - long-term investment for parents\' future',
        '',
        '📊 Fidelity Brokerage Account:',
        '   $1,000/month → Large Cap Investments',
        '   $100/month → Small Cap Investments',
        '   10:1 ratio (for every $1,000 in Large Cap, $100 in Small Cap)',
        '   ETFs are covered in 401k and HSA, not in Fidelity Brokerage'
      ]
    },
    {
      id: 'large-cap-investments',
      title: '📊 Large Cap Investments ($1,000/month)',
      content: [
        '🎯 Approach: Value investing in established market leaders - investing in profitable, undervalued large-cap companies with growing revenue that we believe will dominate their fields',
        '',
        '📋 Investment Criteria:',
        '   Market cap at least $100 billion',
        '   As little debt as possible',
        '   Undervalued (P/E ratio below 30)',
        '   Revenue that is growing',
        '   We believe in their thesis - they will dominate an underlying field',
        '',
        '🔒 HOLD FOREVER - never sell these positions',
        '💰 Invest in your choosing - up to $1,000/month total'
      ]
    },
    {
      id: 'small-cap-investments',
      title: '🎲 Small Cap Investments ($100/month)',
      content: [
        '🎯 Approach: Act like YCombinator - investing (not trading) in early-stage companies',
        '',
        '📋 Investment Criteria:',
        '   Market cap below $10 billion',
        '   Company must be profitable',
        '   Company has potential that hasn\'t been realized yet',
        '   Be in the field of tech/science - something disruptive',
        '   We believe in their thesis',
        '',
        '🔒 HOLD FOREVER - never sell these positions',
        '💰 Invest in your choosing - up to $100/month total',
        '   Invest in NEW opportunities only'
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
        '   No discretionary withdrawals for lifestyle',
        '   General Savings Account is for spending, NOT brokerage',
        '',
        '🔄 Reinvest ALL dividends until $5M portfolio',
        '📊 Invest monthly as scheduled. NO EXCEPTIONS.',
        '',
        '🔒 WE NEVER SELL. NEVER EVER. NEVER.'
      ]
    },
    {
      id: 'milestone-rewards',
      title: '🎯 Milestone Rewards',
      content: [
        '$12.5k → 125 push-ups (5×25)',
        '$15k → 150 push-ups (6×25)',
        '$20k → 200 push-ups (8×25)',
        '$25k → Mom\'s present - up to $250',
        '$50k → Dad\'s Meta Quest - about $500',
        '$75k → New $750 Windows laptop',
        '$100k → Hamilton Murph (~$1k; aim 5–10% off)',
        '$200k → Dad\'s new DJI Drone set - about $1k',
        '$500k → Junhee and Minjoon laptops - at most $1500 each',
        '$750k → Chanel bag under $7500 for Mom - something luxurious and new she\'ll use. Get Dad\'s input and ask Mom what color she wants. She never had a bag before.',
        '$1M → Use $5k to host family dinner for special occasion like Grandma\'s 80th birthday. Give to Mom and Dad to pay. 80 years only comes around once.',
        '$2M → Use up to $15k to send Dad and Mom on a one week vacation of their choosing - one country',
        '$5M → Decrease amount we\'re putting into investment portfolio. Draft plans on settling down, where to retire, how to budget etc. Use up to $10k for a Dream PC setup',
        '$10M → Retire (keep building AmpyFin). Stop dividend reinvestment in 401k/HSA; live on dividends + AmpyFin + bank savings. Donate $50k of school supplies to Korean orphanages'
      ]
    },
    {
      id: 'monthly-cadence',
      title: '📅 Monthly Cadence & Reviews',
      content: [
        '📊 First Monday of Every Month:',
        '   Review plan and verify using spreadsheet and Google Doc',
        '   Determine where to transfer how much',
        '   Decide what to buy and how much of it to buy',
        '   Verify decisions on Google Doc and spreadsheet',
        '   Buy those assets according to the plan',
        '   Make necessary changes in accounts',
        '   Reflect all changes on spreadsheet and Google Doc',
        '   Log out and close brokerage',
        '',
        '🔒 Brokerage Access Protocol:',
        '   We DO NOT look at brokerage accounts regularly',
        '   Only check brokerage on the first Monday of each month for monthly deposits',
        '',
        '⚠️ CRITICAL REMINDERS:',
        '   NEVER SELL - DO NOT PANIC',
        '   We invest monthly amounts as planned ($1,000 Large Cap, $100 Small Cap)',
        '   DO NOT try to time the market',
        '   Time in the market TRIUMPHS over timing the market',
        '   Our wealth is built through consistency, not timing',
        '',
        '🔍 Mid-Month Review:',
        '   Rule audit: Did I follow the plan?',
        '   Subscription cull: Cancel unused services',
        '   Confirm no brokerage leaks or withdrawals',
        '',
        '📝 Documentation (Google Doc):',
        '   Every action recorded: date, trigger, amount, instrument, rule cited',
        '   Monthly summary: wins, mistakes, lessons learned'
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
    workout: "Strength is not forged in single heroic efforts, but in the accumulation of disciplined repetitions—where progressive overload meets unwavering consistency, and patience transforms into power.",
    ampyfin: "Every hour not claimed by work, training, or recovery belongs to one thing—building what others say can't be built, solving what others won't attempt, creating what the world doesn't know it needs yet."
  };

  // Intelligence Graph - Starting fresh with ReactFlow
  const IntelligenceGraphComponent = ({ onClose }) => {
    console.log('⚡ [GRAPH MOUNT] IntelligenceGraphComponent is mounting/rendering');
    
    // Capture values ONCE when graph opens - no live updates needed
    const [frozenBuffett] = useState(() => {
      const val = buffettIndicator || 0; // Keep exact value
      console.log('🔒 [GRAPH] Frozen Buffett Indicator:', val, '(exact, no rounding)');
      return val;
    });
    const [frozenVix] = useState(() => {
      const val = displayedVix || 0; // Keep exact value
      console.log('🔒 [GRAPH] Frozen VIX:', val, '(exact, no rounding)');
      return val;
    });
    const [frozenRatio] = useState(() => {
      const val = investmentRatio || '3:1';
      console.log('🔒 [GRAPH] Frozen Ratio:', val);
      return val;
    });
    
    const ratio = frozenRatio.split(':');
    const ratioInvest = parseInt(ratio[0] || '3', 10);
    const ratioCash = parseInt(ratio[1] || '1', 10);

    // Static nodes - never recreate
    const nodes = useMemo(() => {
      console.log('🔄 [GRAPH FLICKER?] Nodes array recreated (should only happen ONCE on mount)');
      return [
      { 
        id: 'paycheck', 
        position: { x: 156, y: 188 }, 
        data: { label: 'Paycheck' },
        style: { 
          background: '#000', 
          color: '#fff', 
          border: '1px solid #fff', 
          borderRadius: '5px', 
          padding: '8px 13px',
          fontSize: '9px',
          fontWeight: 'bold'
        }
      },
      { 
        id: 'taxes', 
        position: { x: 344, y: 63 }, 
        data: { label: 'Taxes' },
        style: { 
          background: '#111', 
          color: '#E5E5E5', 
          border: '1px solid #E5E5E5', 
          borderRadius: '4px', 
          padding: '6px 9px',
          fontSize: '7.5px'
        }
      },
      { 
        id: 'rent', 
        position: { x: 344, y: 125 }, 
        data: { label: 'Rent' },
        style: { 
          background: '#111', 
          color: '#E5E5E5', 
          border: '1px solid #E5E5E5', 
          borderRadius: '4px', 
          padding: '6px 9px',
          fontSize: '7.5px'
        }
      },
      { 
        id: 'water-food', 
        position: { x: 344, y: 188 }, 
        data: { label: 'Water & Food' },
        style: { 
          background: '#111', 
          color: '#E5E5E5', 
          border: '1px solid #E5E5E5', 
          borderRadius: '4px', 
          padding: '6px 9px',
          fontSize: '7.5px'
        }
      },
      { 
        id: 'buffer', 
        position: { x: 344, y: 250 }, 
        data: { label: '$500 Buffer Insurance' },
        style: { 
          background: '#111', 
          color: '#E5E5E5', 
          border: '1px solid #E5E5E5', 
          borderRadius: '4px', 
          padding: '6px 9px',
          fontSize: '7.5px'
        }
      },
      { 
        id: 'fundamental', 
        position: { x: 138, y: 31 }, 
        data: { label: 'Fundamental Reserve\n(Cap $600)' },
        style: { 
          background: '#000', 
          color: '#fff', 
          border: '1px solid #fff', 
          borderRadius: '4px', 
          padding: '6px 9px',
          fontSize: '7.5px',
          textAlign: 'center',
          whiteSpace: 'pre-line'
        }
      },
      { 
        id: 'secondary', 
        position: { x: 144, y: 313 }, 
        data: { label: 'Secondary Reserve\n(Cap $300)' },
        style: { 
          background: '#111', 
          color: '#E5E5E5', 
          border: '1px solid #E5E5E5', 
          borderRadius: '4px', 
          padding: '6px 9px',
          fontSize: '7.5px',
          textAlign: 'center',
          whiteSpace: 'pre-line'
        }
      },
      // New nodes for remaining income flow
      { 
        id: 'remaining', 
        position: { x: 500, y: 360 }, 
        data: { label: 'Remaining Income' },
        style: { 
          background: '#000', 
          color: '#fff', 
          border: '1px solid #fff', 
          borderRadius: '5px', 
          padding: '8px 13px',
          fontSize: '9px',
          fontWeight: 'bold'
        }
      },
      { 
        id: 'schwab', 
        position: { x: 813, y: 125 }, 
        data: { label: 'General Savings Account (Charles Schwab)\nSecondary Savings: 100% SGOV' },
        style: { 
          background: '#1a1a00', 
          color: '#FFB81C', 
          border: '1px solid #FFB81C', 
          borderRadius: '4px', 
          padding: '6px 9px',
          fontSize: '7.5px',
          whiteSpace: 'pre-line',
          textAlign: 'center'
        }
      },
      { 
        id: 'brokerage', 
        position: { x: 813, y: 219 }, 
        data: { label: 'Fidelity Brokerage' },
        style: { 
          background: '#0a2a2a', 
          color: '#40FFDA', 
          border: '1px solid #40FFDA', 
          borderRadius: '4px', 
          padding: '6px 9px',
          fontSize: '7.5px',
          textAlign: 'center'
        }
      },
      { 
        id: 'split', 
        position: { x: 969, y: 219 }, 
        data: { label: `Investment:Cash\n${ratioInvest}:${ratioCash}\nBuffett: ${frozenBuffett ? frozenBuffett.toFixed(1) : '—'}%` },
        style: { 
          background: '#000', 
          color: '#fff', 
          border: '1px solid #fff', 
          borderRadius: '5px', 
          padding: '6px 9px',
          fontSize: '7px',
          whiteSpace: 'pre-line',
          textAlign: 'center'
        }
      },
      // Investment allocations
      { 
        id: 'portfolio', 
        position: { x: 1125, y: 156 }, 
        data: { label: 'Portfolio\n(Investments)' },
        style: { 
          background: '#000', 
          color: '#fff', 
          border: '1px solid #fff', 
          borderRadius: '4px', 
          padding: '6px 9px',
          fontSize: '7.5px',
          textAlign: 'center',
          whiteSpace: 'pre-line'
        }
      },
      { 
        id: 'cash-reserve', 
        position: { x: 1125, y: 281 }, 
        data: { label: 'Cash Reserve\n(No Cap)' },
        style: { 
          background: '#000', 
          color: '#fff', 
          border: '1px solid #fff', 
          borderRadius: '4px', 
          padding: '6px 9px',
          fontSize: '7.5px',
          textAlign: 'center',
          whiteSpace: 'pre-line'
        }
      },
      { 
        id: 'large-cap', 
        position: { x: 1281, y: 63 }, 
        data: { label: 'Large Cap 80%' },
        style: { 
          background: '#111', 
          color: '#E5E5E5', 
          border: '1px solid #E5E5E5', 
          borderRadius: '4px', 
          padding: '5px 8px',
          fontSize: '7px'
        }
      },
      { 
        id: 'small-cap', 
        position: { x: 1281, y: 163 }, 
        data: { label: 'Small Cap Investments 20%' },
        style: { 
          background: '#111', 
          color: '#E5E5E5', 
          border: '1px solid #E5E5E5', 
          borderRadius: '4px', 
          padding: '5px 8px',
          fontSize: '7px'
        }
      },
      // VIX Trigger
      { 
        id: 'vix-trigger', 
        position: { x: 969, y: 344 }, 
        data: { label: `VIX ${frozenVix || '—'}\n${frozenVix >= 30 ? '📢 $100 DEPLOY' : frozenVix < 15 ? '🔄 RETURN TO CASH' : '✅'}` },
        style: { 
          background: frozenVix >= 30 ? '#3d0a0a' : '#0a0a0a', 
          color: frozenVix >= 30 ? '#FF0000' : '#40FFDA', 
          border: `1px solid ${frozenVix >= 30 ? '#FF0000' : '#40FFDA'}`, 
          borderRadius: '5px', 
          padding: '6px 9px',
          fontSize: '7px',
          whiteSpace: 'pre-line',
          textAlign: 'center',
          fontWeight: 'bold'
        }
      },
    ];
    }, []); // Empty deps - nodes are 100% static

    // Static edges - never recreate
    const edges = useMemo(() => {
      console.log('🔄 [GRAPH FLICKER?] Edges array recreated (should only happen ONCE on mount)');
      return [
      { 
        id: 'e-paycheck-taxes', 
        source: 'paycheck', 
        target: 'taxes',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#fff', strokeWidth: 1.25, strokeDasharray: '4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      },
      { 
        id: 'e-paycheck-rent', 
        source: 'paycheck', 
        target: 'rent',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#fff', strokeWidth: 1.25, strokeDasharray: '4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      },
      { 
        id: 'e-paycheck-water', 
        source: 'paycheck', 
        target: 'water-food',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#fff', strokeWidth: 1.25, strokeDasharray: '4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      },
      { 
        id: 'e-paycheck-buffer', 
        source: 'paycheck', 
        target: 'buffer',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#fff', strokeWidth: 1.25, strokeDasharray: '4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      },
      { 
        id: 'e-paycheck-secondary', 
        source: 'paycheck', 
        target: 'secondary',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'smoothstep',
        style: { stroke: '#fff', strokeWidth: 1.25 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      },
      { 
        id: 'e-paycheck-fundamental', 
        source: 'paycheck', 
        target: 'fundamental',
        sourceHandle: 'top',
        targetHandle: 'bottom',
        type: 'smoothstep',
        style: { stroke: '#fff', strokeWidth: 1.25 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      },
      // New edges for remaining income flow
      { 
        id: 'e-paycheck-remaining', 
        source: 'paycheck', 
        target: 'remaining',
        sourceHandle: 'bottom',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#fff', strokeWidth: 1.25 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      },
      { 
        id: 'e-remaining-schwab', 
        source: 'remaining', 
        target: 'schwab',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#FFB81C', strokeWidth: 1.25 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#FFB81C' }
      },
      { 
        id: 'e-remaining-brokerage', 
        source: 'remaining', 
        target: 'brokerage',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#40FFDA', strokeWidth: 1.25 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#40FFDA' }
      },
      { 
        id: 'e-brokerage-split', 
        source: 'brokerage', 
        target: 'split',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#fff', strokeWidth: 1.25 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      },
      // Investment allocations
      { 
        id: 'e-split-portfolio', 
        source: 'split', 
        target: 'portfolio',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#fff', strokeWidth: 1.25 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      },
      { 
        id: 'e-split-cash', 
        source: 'split', 
        target: 'cash-reserve',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#fff', strokeWidth: 1.25 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' }
      },
      { 
        id: 'e-portfolio-large-cap', 
        source: 'portfolio', 
        target: 'large-cap',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#E5E5E5', strokeWidth: 0.94, strokeDasharray: '2.5' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#E5E5E5' }
      },
      { 
        id: 'e-portfolio-small-cap', 
        source: 'portfolio', 
        target: 'small-cap',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: '#E5E5E5', strokeWidth: 0.94, strokeDasharray: '2.5' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#E5E5E5' }
      },
      // VIX triggered deployments (show when VIX >= 30 or VIX < 15)
      ...(frozenVix >= 30 || frozenVix < 15 ? [
        { 
          id: 'e-cash-portfolio-vix', 
          source: 'cash-reserve', 
          target: 'portfolio',
          sourceHandle: 'top',
          targetHandle: 'bottom',
          type: 'smoothstep',
          style: { stroke: '#FF0000', strokeWidth: 1.88, strokeDasharray: '4,4' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#FF0000' }
        },
      ] : []),
    ];
    }, []); // Empty deps - edges are 100% static

    console.log('🔄 [GRAPH FLICKER?] IntelligenceGraphComponent rendered');

    return (
      <div 
        data-graph-ui="true"
        onClick={(e) => {
          e.stopPropagation();
          console.log('🖱️ Overlay clicked');
        }}
        onMouseDown={(e) => console.log('🖱️ Mouse down on overlay')}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'auto',
          isolation: 'isolate'
        }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
               <h2 style={{ margin: 0, color: '#fff', fontFamily: 'monospace', letterSpacing: '3px', fontSize: '1.5rem' }}>
                 INTELLIGENCE GRAPH
               </h2>
               <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                 Financial Network • Paycheck Flow
               </p>
               <div style={{ marginTop: '0.5rem', display: 'flex', gap: '2rem', fontSize: '0.8rem' }}>
                 <div style={{ color: frozenBuffett >= 120 ? '#FF0000' : '#40FFDA' }}>
                   <span style={{ fontWeight: 'bold' }}>Buffett Indicator:</span> {Number.isFinite(frozenBuffett) ? frozenBuffett.toFixed(1) : '—'}%
                   <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>
                     ({frozenRatio || '3:1'})
                   </span>
                 </div>
                 <div style={{ color: frozenVix >= 30 ? '#FF0000' : frozenVix >= 20 ? '#FFB81C' : '#40FFDA' }}>
                   <span style={{ fontWeight: 'bold' }}>VIX:</span> {Number.isFinite(frozenVix) ? frozenVix.toFixed(2) : '—'}
                  <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>
                    {frozenVix >= 30 ? '📢 DEPLOY $100' : '✅ NORMAL'}
                  </span>
                 </div>
               </div>
          </div>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🚨 CLOSE button mouse down!');
              if (onClose) {
                onClose();
              } else {
                console.error('❌ onClose is not defined!');
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🚨 CLOSE button clicked!');
            }}
            className="nav-button"
            style={{ 
              color: '#E5E5E5', 
              padding: '0.75rem 1.5rem', 
              fontSize: '0.8rem',
              cursor: 'pointer',
              pointerEvents: 'auto',
              zIndex: 10000,
              position: 'relative',
              touchAction: 'none'
            }}
          >
            CLOSE
          </button>
        </div>

            {/* Graph */}
            <div style={{ flex: 1 }}>
              <ReactFlow
                key="intelligence-graph"
                nodes={nodes}
                edges={edges}
                fitViewOnInit
                fitViewOptions={{ padding: 0.2, duration: 0 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                zoomOnScroll={false}
                panOnDrag={false}
                zoomOnDoubleClick={false}
                minZoom={1}
                maxZoom={1}
                preventScrolling={false}
                style={{ background: 'rgba(0,0,0,0)' }}
                proOptions={{ hideAttribution: true }}
              />
            </div>
      </div>
    );
  };

  // Direct export - memo was blocking click events
  const IntelligenceGraph = IntelligenceGraphComponent;


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
                      background: displayedVix && displayedVix >= 30 ? 'rgba(255,255,255,0.1)' : 'rgba(64,255,218,0.1)',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${displayedVix && displayedVix >= 30 ? 'rgba(255,255,255,0.4)' : 'rgba(64,255,218,0.3)'}`,
                      boxShadow: displayedVix && displayedVix >= 30 ? '0 0 20px rgba(255,255,255,0.2)' : 'none'
                    }}>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                        VIX Index (Fear Gauge)
                        {vixSimEnabled && (
                          <span style={{ 
                            marginLeft: '0.5rem', 
                            fontSize: '0.7rem',
                            color: '#FFFFFF',
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontWeight: 'bold'
                          }}>
                            SIMULATED
                          </span>
                        )}
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
                        color: displayedVix ? (
                          displayedVix >= 40 ? '#FFFFFF' :
                          displayedVix >= 35 ? '#FFFFFF' :
                          displayedVix >= 30 ? '#FFFFFF' : '#E5E5E5'
                        ) : '#FFFFFF',
                        textShadow: displayedVix && displayedVix >= 30 ? '0 0 10px rgba(255,255,255,0.6)' : 'none'
                      }}>
                        {displayedVix !== null && displayedVix !== undefined ? displayedVix.toFixed(2) : '⚠️ FETCH FAILED'}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        opacity: 0.7, 
                        marginTop: '0.3rem',
                        fontWeight: displayedVix && displayedVix >= 30 ? 'bold' : 'normal',
                        color: displayedVix && displayedVix >= 30 ? '#FFFFFF' : displayedVix === null ? '#FFFFFF' : 'inherit'
                      }}>
                        {displayedVix !== null && displayedVix !== undefined ? (
                          displayedVix >= 30 ? '📢 DEPLOY $100 FROM CASH RESERVE → INVEST!' :
                          displayedVix < 15 ? '🔄 RETURN TO CASH RESERVE' :
                          '✅ Normal Market - Stay The Course'
                        ) : 'Check browser console for error details'}
                      </div>
                      {vixSimEnabled && (
                        <div style={{
                          marginTop: '0.5rem',
                          padding: '0.5rem',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.8)'
                        }}>
                          💡 Simulation active. Real VIX: {vixIndex !== null ? vixIndex.toFixed(2) : 'Loading...'}
                        </div>
                      )}
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
                          item === '' ? (
                            <li key={index} style={{ marginBottom: '0.5rem', listStyle: 'none', height: '0.5rem' }}></li>
                          ) : (
                            <li key={index} style={{ marginBottom: '0.5rem' }}>
                              • {item}
                            </li>
                          )
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
      case 'ampyfin':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <SectionQuote quote={sectionQuotes.ampyfin} />
            
            {/* Core Philosophy */}
            <div style={{
              background: 'rgba(6,0,32,0.8)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(64,255,218,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <h3 style={{
                color: '#40FFDA',
                marginBottom: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '1.3rem',
                letterSpacing: '2px'
              }}>
                🎯 THE SINGULAR FOCUS
              </h3>
              
              <div style={{
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: '#E5E5E5',
                marginBottom: '1.5rem'
              }}>
                <p style={{ marginBottom: '1rem' }}>
                  Every free hour—after work obligations are met, after training is complete, after recovery is honored—belongs to AmpyFin.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Not scattered across side projects. Not diluted by distractions. Not split between "maybe someday" ideas.
                </p>
                <p style={{ fontWeight: 'bold', color: '#40FFDA' }}>
                  One mission. One focus. One relentless pursuit.
                </p>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                borderLeft: '3px solid #40FFDA'
              }}>
                <div style={{ 
                  fontSize: '0.95rem',
                  lineHeight: '1.8',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  <p style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#40FFDA' }}>The Rule:</strong> If it's not AmpyFin, it doesn't get built. No exceptions.
                  </p>
                  <p style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#40FFDA' }}>The Commitment:</strong> This is the work that matters. The problem worth solving. The product I genuinely believe in.
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    <strong style={{ color: '#40FFDA' }}>The Promise:</strong> Every line of code, every algorithm refined, every user experience perfected—all in service of making AmpyFin the most powerful financial intelligence system ever built.
                  </p>
                </div>
              </div>
            </div>

            {/* What AmpyFin Is */}
            <div style={{
              background: 'rgba(6,0,32,0.6)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '1.2rem'
              }}>
                💡 WHAT IS AMPYFIN?
              </h3>
              
              <div style={{
                fontSize: '0.95rem',
                lineHeight: '1.8',
                color: '#E5E5E5'
              }}>
                <p style={{ marginBottom: '1rem' }}>
                  AmpyFin is an AI-powered financial intelligence platform that analyzes market data, identifies undervalued opportunities, and provides actionable investment recommendations.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Built from the ground up with:
                </p>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '0 0 0 1.5rem',
                  marginBottom: '1rem'
                }}>
                  <li style={{ marginBottom: '0.5rem' }}>• Real-time data pipelines processing millions of financial signals</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Machine learning models trained on decades of market patterns</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Open-source core components for transparency and community trust</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Enterprise-grade infrastructure deployed on Oracle Cloud</li>
                  <li style={{ marginBottom: '0.5rem' }}>• Mobile-first architecture for decisions anywhere, anytime</li>
                </ul>
                <p style={{ 
                  fontWeight: 'bold', 
                  color: '#40FFDA',
                  marginBottom: 0
                }}>
                  This isn't a side project. This is the project.
                </p>
              </div>
            </div>

            {/* Time Allocation */}
            <div style={{
              background: 'rgba(6,0,32,0.6)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '1.2rem'
              }}>
                ⏰ FREE TIME = AMPYFIN TIME
              </h3>
              
              <div style={{
                display: 'grid',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  borderLeft: '3px solid rgba(255,255,255,0.3)'
                }}>
                  <div style={{ 
                    fontSize: '0.9rem',
                    color: '#E5E5E5',
                    lineHeight: '1.6'
                  }}>
                    <strong>Weekday Evenings (After Work & Gym):</strong> 2-4 hours of focused development
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  borderLeft: '3px solid rgba(255,255,255,0.3)'
                }}>
                  <div style={{ 
                    fontSize: '0.9rem',
                    color: '#E5E5E5',
                    lineHeight: '1.6'
                  }}>
                    <strong>Weekends:</strong> Deep work sessions on architecture, algorithms, and system design
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  borderLeft: '3px solid rgba(255,255,255,0.3)'
                }}>
                  <div style={{ 
                    fontSize: '0.9rem',
                    color: '#E5E5E5',
                    lineHeight: '1.6'
                  }}>
                    <strong>Mental Downtime:</strong> Reading financial research, studying market patterns, refining models
                  </div>
                </div>

                <div style={{
                  background: 'rgba(64,255,218,0.1)',
                  padding: '1.25rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(64,255,218,0.3)',
                  marginTop: '0.5rem'
                }}>
                  <div style={{ 
                    fontSize: '1rem',
                    color: '#40FFDA',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    Everything else is noise. AmpyFin is the signal.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSignature = () => {
    const dates = {
      social: {
        signed: "January 31, 2026 at 10:00 PM",
        effective: "January 31, 2026 at 10:00 PM"
      },
      physical: {
        signed: "January 31, 2026 at 10:00 PM",
        effective: "January 31, 2026 at 10:00 PM"
      },
      mental: {
        signed: "January 31, 2026 at 10:00 PM",
        effective: "January 31, 2026 at 10:00 PM"
      },
      financial: {
        signed: "January 31, 2026 at 10:00 PM",
        effective: "January 31, 2026 at 10:00 PM"
      },
      career: {
        signed: "January 31, 2026 at 10:00 PM",
        effective: "January 31, 2026 at 10:00 PM"
      },
      'daily-os': {
        signed: "January 31, 2026 at 10:00 PM",
        effective: "January 31, 2026 at 10:00 PM"
      },
      workout: {
        signed: "January 31, 2026 at 10:00 PM",
        effective: "January 31, 2026 at 10:00 PM"
      },
      ampyfin: {
        signed: "January 31, 2026 at 10:00 PM",
        effective: "January 31, 2026 at 10:00 PM"
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
            src="https://www.youtube.com/embed/PnCn9q7KMQI"
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
          .global-scanlines {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            background: repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.03),
              rgba(255,255,255,0.03) 1px,
              transparent 1px,
              transparent 4px
            );
            mix-blend-mode: overlay;
            opacity: 0.5;
            z-index: 2;
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
          {/* Palantir HUD */}
          <div style={{
            position: 'fixed',
            top: '12px',
            right: '12px',
            zIndex: 3,
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderLeft: '2px solid rgba(255,255,255,0.3)',
            padding: '0.5rem 0.75rem',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
          }}>
            <button className="nav-button" onClick={() => setIsPaletteOpen(true)} style={{ color: '#E5E5E5', padding: '0.4rem 0.7rem', fontSize: '0.7rem' }}>CMD ⌘K</button>
            <button className="nav-button" onClick={() => setShowOpsConsole(v => !v)} style={{ color: '#E5E5E5', padding: '0.4rem 0.7rem', fontSize: '0.7rem' }}>OPS</button>
            <button className="nav-button" onClick={() => setOverlays(o => ({ ...o, scanlines: !o.scanlines }))} style={{ color: overlays.scanlines ? '#FFFFFF' : '#E5E5E5', padding: '0.4rem 0.7rem', fontSize: '0.7rem' }}>SCAN</button>
            <button className="nav-button" onClick={() => { const en = !vixSimEnabled; setVixSimEnabled(en); logEvent(`VIX simulation ${en ? 'enabled' : 'disabled'}`); }} style={{ color: vixSimEnabled ? '#FFFFFF' : '#E5E5E5', padding: '0.4rem 0.7rem', fontSize: '0.7rem' }}>SIM</button>
            <button className="nav-button" onClick={() => { setShowIntelGraph(true); logEvent('Intelligence Graph opened'); }} style={{ color: '#40FFDA', padding: '0.4rem 0.7rem', fontSize: '0.7rem' }}>GRAPH</button>
            {founderMode && (
              <span style={{ color: '#FFFFFF', fontSize: '0.7rem', letterSpacing: '2px', alignSelf: 'center' }}>FOUNDER</span>
            )}
          </div>
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
            {['social', 'physical', 'mental', 'financial', 'career', 'daily-os', 'workout', 'ampyfin'].map((section) => (
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
          {/* Global overlays */}
          {overlays.scanlines && (<div className="global-scanlines" />)}
          {/* Draggable market nodes (financial only) */}
          {activeSection === 'financial' && (
            <>
              {/* Buffett Node */}
              <div
                onMouseDown={() => setDraggingNode('buffett')}
                onDoubleClick={() => { navigator.clipboard?.writeText(`${buffettIndicator ?? 'N/A'}%`); logEvent('Copied Buffett Indicator'); }}
                style={{
                  position: 'fixed',
                  left: `${nodesPosition.buffett.x}%`,
                  top: `${nodesPosition.buffett.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderLeft: '2px solid rgba(255,255,255,0.6)',
                  padding: '0.5rem 0.75rem',
                  cursor: 'grab',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  backdropFilter: 'blur(6px)'
                }}
              >
                BI: {buffettIndicator ? `${buffettIndicator.toFixed(1)}%` : '—'}
              </div>
              {/* VIX Node */}
              <div
                onMouseDown={() => setDraggingNode('vix')}
                onDoubleClick={() => { navigator.clipboard?.writeText(`${displayedVix ?? 'N/A'}`); logEvent('Copied VIX'); }}
                style={{
                  position: 'fixed',
                  left: `${nodesPosition.vix.x}%`,
                  top: `${nodesPosition.vix.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3,
                  background: displayedVix && displayedVix >= 30 ? 'rgba(255,255,255,0.12)' : 'rgba(64,255,218,0.12)',
                  border: `1px solid ${displayedVix && displayedVix >= 30 ? 'rgba(255,255,255,0.6)' : 'rgba(64,255,218,0.5)'}`,
                  borderLeft: `2px solid ${displayedVix && displayedVix >= 30 ? '#FFFFFF' : 'rgba(64,255,218,0.8)'}`,
                  padding: '0.5rem 0.75rem',
                  cursor: 'grab',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  backdropFilter: 'blur(6px)'
                }}
              >
                VIX: {displayedVix !== null && displayedVix !== undefined ? displayedVix.toFixed(2) : '—'}
              </div>
            </>
          )}
          {/* Ops Console */}
          {showOpsConsole && (
            <div style={{
              position: 'fixed',
              bottom: '12px',
              right: '12px',
              width: '360px',
              maxHeight: '50vh',
              overflow: 'auto',
              zIndex: 4,
              background: 'rgba(0,0,0,0.85)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderLeft: '2px solid #FFFFFF',
              padding: '0.75rem'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <button className="nav-button" onClick={refetchBuffett} style={{ color: '#E5E5E5', padding: '0.35rem 0.6rem', fontSize: '0.7rem' }}>REFRESH BI</button>
                <button className="nav-button" onClick={refetchVix} style={{ color: '#E5E5E5', padding: '0.35rem 0.6rem', fontSize: '0.7rem' }}>REFRESH VIX</button>
                <button className="nav-button" onClick={() => { setVixSimEnabled(true); setVixSimValue(30); logEvent('Simulating VIX = 30'); }} style={{ color: '#E5E5E5', padding: '0.35rem 0.6rem', fontSize: '0.7rem' }}>SIM 30</button>
                <button className="nav-button" onClick={() => { setVixSimEnabled(true); setVixSimValue(35); logEvent('Simulating VIX = 35'); }} style={{ color: '#E5E5E5', padding: '0.35rem 0.6rem', fontSize: '0.7rem' }}>SIM 35</button>
                <button className="nav-button" onClick={() => { setVixSimEnabled(true); setVixSimValue(40); logEvent('Simulating VIX = 40'); }} style={{ color: '#E5E5E5', padding: '0.35rem 0.6rem', fontSize: '0.7rem' }}>SIM 40</button>
                <button className="nav-button" onClick={() => { setVixSimEnabled(false); logEvent('VIX simulation reset'); }} style={{ color: '#E5E5E5', padding: '0.35rem 0.6rem', fontSize: '0.7rem' }}>SIM OFF</button>
                <button className="nav-button" onClick={() => { const text = logs.map(l => `[${l.time.toLocaleTimeString()}] ${l.message}`).join('\n'); navigator.clipboard?.writeText(text); }} style={{ color: '#E5E5E5', padding: '0.35rem 0.6rem', fontSize: '0.7rem' }}>COPY LOGS</button>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#E5E5E5' }}>
                {logs.length === 0 ? (
                  <div style={{ opacity: 0.6 }}>No events yet…</div>
                ) : (
                  logs.map((l, i) => (
                    <div key={i} style={{ padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ opacity: 0.6, marginRight: '0.5rem' }}>[{l.time.toLocaleTimeString()}]</span>
                      <span>{l.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {/* Intelligence Graph */}
          {showIntelGraph && <IntelligenceGraph key="intel-graph-singleton" onClose={() => { console.log('🚪 Close handler called'); setShowIntelGraph(false); setSelectedGraphNode(null); }} />}
          {/* Command Palette */}
          {isPaletteOpen && (
            <div onClick={() => setIsPaletteOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 5, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh' }}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(680px, 94vw)', background: 'rgba(6,0,32,0.95)', border: '1px solid rgba(255,255,255,0.3)', borderLeft: '2px solid #FFFFFF', padding: '1rem', clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                <input autoFocus value={paletteQuery} onChange={(e) => setPaletteQuery(e.target.value)} placeholder="Type a command…" style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontFamily: 'monospace' }} />
                {(() => {
                  const commands = [
                    { id: 'open-graph', title: '🔷 Open Intelligence Graph', run: () => { setShowIntelGraph(true); logEvent('Intelligence Graph opened'); } },
                    { id: 'toggle-scan', title: 'Toggle Scanlines Overlay', run: () => setOverlays(o => ({ ...o, scanlines: !o.scanlines })) },
                    { id: 'toggle-ops', title: 'Toggle Ops Console', run: () => setShowOpsConsole(v => !v) },
                    { id: 'refetch-bi', title: 'Refetch Buffett Indicator', run: refetchBuffett },
                    { id: 'refetch-vix', title: 'Refetch VIX Index', run: refetchVix },
                    { id: 'sim-30', title: 'Simulate VIX = 30', run: () => { setVixSimEnabled(true); setVixSimValue(30); logEvent('Simulating VIX = 30'); } },
                    { id: 'sim-35', title: 'Simulate VIX = 35', run: () => { setVixSimEnabled(true); setVixSimValue(35); logEvent('Simulating VIX = 35'); } },
                    { id: 'sim-40', title: 'Simulate VIX = 40', run: () => { setVixSimEnabled(true); setVixSimValue(40); logEvent('Simulating VIX = 40'); } },
                    { id: 'sim-off', title: 'Disable VIX Simulation', run: () => { setVixSimEnabled(false); logEvent('VIX simulation disabled'); } },
                    { id: 'goto-fin', title: 'Go to FINANCIAL module', run: () => setActiveSection('financial') },
                    { id: 'goto-workout', title: 'Go to WORKOUT module', run: () => setActiveSection('workout') },
                  ];
                  const list = commands.filter(c => c.title.toLowerCase().includes(paletteQuery.toLowerCase()));
                  return (
                    <div style={{ marginTop: '0.75rem', maxHeight: '40vh', overflow: 'auto' }}>
                      {list.map((cmd) => (
                        <div key={cmd.id} onClick={() => { cmd.run(); setIsPaletteOpen(false); }} className="content-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.75rem', marginBottom: '0.5rem', cursor: 'pointer', color: '#fff' }}>
                          {cmd.title}
                        </div>
                      ))}
                      {list.length === 0 && (
                        <div style={{ color: 'rgba(255,255,255,0.7)', padding: '0.5rem', fontFamily: 'monospace' }}>No matching commands</div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AManProject; 
