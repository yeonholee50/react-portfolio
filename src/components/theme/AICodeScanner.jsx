import React, { useEffect, useState } from 'react';
import './AICodeScanner.css';

const AICodeScanner = () => {
  const [scannerActive, setScannerActive] = useState(false);
  const [currentScan, setCurrentScan] = useState(null);

  // AI-related code snippets that will "scan" across the screen
  const codeSnippets = [
    { code: 'neural_network.train(epochs=1000)', type: 'ML_TRAINING', confidence: '97.3%' },
    { code: 'model.predict(quantum_data)', type: 'AI_INFERENCE', confidence: '89.7%' },
    { code: 'optimize_hyperparameters()', type: 'OPTIMIZATION', confidence: '95.1%' },
    { code: 'ensemble.fit(X_train, y_train)', type: 'ENSEMBLE', confidence: '92.8%' },
    { code: 'deploy_edge_model()', type: 'DEPLOYMENT', confidence: '86.4%' },
    { code: 'autoencoder.encode(features)', type: 'ENCODING', confidence: '94.2%' },
    { code: 'transformer.attention(query, key)', type: 'ATTENTION', confidence: '98.1%' },
    { code: 'gan.generate_synthetic_data()', type: 'GENERATION', confidence: '91.5%' }
  ];

  useEffect(() => {
    const startScan = () => {
      if (Math.random() < 0.3) { // 30% chance to trigger scan
        const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        setCurrentScan(snippet);
        setScannerActive(true);
        
        setTimeout(() => {
          setScannerActive(false);
          setCurrentScan(null);
        }, 4000); // Scan duration
      }
    };

    const interval = setInterval(startScan, 8000); // Check every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (!scannerActive || !currentScan) return null;

  return (
    <div className="ai-code-scanner">
      <div className="scanner-container">
        <div className="scanner-header">
          <div className="scanner-status">
            <div className="status-dot"></div>
            <span>AI CODE ANALYZER</span>
          </div>
          <div className="scanner-progress">
            <div className="progress-line"></div>
          </div>
        </div>
        
        <div className="scanner-content">
          <div className="code-line">
            <span className="line-number">247:</span>
            <span className="code-text">{currentScan.code}</span>
          </div>
          
          <div className="analysis-results">
            <div className="analysis-item">
              <span className="label">TYPE:</span>
              <span className="value type">{currentScan.type}</span>
            </div>
            <div className="analysis-item">
              <span className="label">CONFIDENCE:</span>
              <span className="value confidence">{currentScan.confidence}</span>
            </div>
            <div className="analysis-item">
              <span className="label">STATUS:</span>
              <span className="value status">OPTIMIZED</span>
            </div>
          </div>
        </div>
        
        <div className="scanner-footer">
          <div className="scan-indicator">
            <div className="scan-beam"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICodeScanner;
