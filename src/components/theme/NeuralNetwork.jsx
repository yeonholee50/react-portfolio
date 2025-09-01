import React, { useEffect, useRef } from 'react';
import './NeuralNetwork.css';

const NeuralNetwork = () => {
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

    // Neural network nodes
    const nodes = [];
    const numNodes = 50;
    const connectionDistance = 150;

    // Initialize nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Keep nodes in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + 
              Math.pow(node.y - otherNode.y, 2)
            );

            if (distance < connectionDistance) {
              const opacity = (connectionDistance - distance) / connectionDistance * 0.3;
              
              // AI-inspired gradient connections
              const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y);
              gradient.addColorStop(0, `hsla(260, 85%, 65%, ${opacity})`);
              gradient.addColorStop(0.5, `hsla(300, 85%, 70%, ${opacity * 0.8})`);
              gradient.addColorStop(1, `hsla(180, 85%, 60%, ${opacity})`);

              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
            }
          }
        });

        // Draw node with pulsing effect
        const pulseSize = Math.sin(node.pulse) * 0.5 + 1;
        const alpha = Math.sin(node.pulse) * 0.3 + 0.7;
        
        // Node glow
        const nodeGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * pulseSize * 3
        );
        nodeGradient.addColorStop(0, `hsla(260, 85%, 65%, ${alpha})`);
        nodeGradient.addColorStop(0.5, `hsla(300, 85%, 70%, ${alpha * 0.5})`);
        nodeGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.fillStyle = `hsla(180, 85%, 60%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseSize, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="neural-network-canvas"
    />
  );
};

export default NeuralNetwork;
