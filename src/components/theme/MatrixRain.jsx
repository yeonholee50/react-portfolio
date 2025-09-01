import React, { useEffect, useRef } from 'react';
import './MatrixRain.css';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // AI/ML related characters and symbols
    const characters = 'αβγδεζηθικλμνξοπρστυφχψω∇∂∞∑∏∫√≈≠≤≥∈∉∪∩⊂⊃⊆⊇∀∃∧∨¬→↔λΛΦΨΩ01';
    const charArray = characters.split('');
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff88'; // Matrix green
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Apply AI-inspired gradient for some characters
        if (Math.random() < 0.1) {
          const gradient = ctx.createLinearGradient(
            i * fontSize, drops[i] * fontSize,
            i * fontSize, (drops[i] + 1) * fontSize
          );
          gradient.addColorStop(0, '#8B5CF6'); // Purple
          gradient.addColorStop(0.5, '#06B6D4'); // Cyan
          gradient.addColorStop(1, '#10B981'); // Green
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = '#00ff88';
        }

        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop if it goes off screen or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="matrix-rain-canvas"
    />
  );
};

export default MatrixRain;
