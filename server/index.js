const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for your frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-render-frontend-url.onrender.com'] // Update with your actual Render URL
    : ['http://localhost:3000']
}));

app.use(express.json());

// VIX Index endpoint
app.get('/api/vix', async (req, res) => {
  console.log('🔄 Fetching VIX Index from backend...');
  
  try {
    // Try multiple Yahoo Finance endpoints
    const endpoints = [
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
              exchange: result?.exchange,
              timestamp: Date.now()
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
              exchange: meta?.exchangeName,
              timestamp: Date.now()
            }
          };
        }
      }
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Trying: ${endpoint.name}`);
        
        const response = await fetch(endpoint.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const { vix, symbol, metadata } = endpoint.extractVix(data);
          
          if (vix && !isNaN(vix) && vix > 5 && vix < 100) {
            console.log(`✅ VIX fetched: ${vix} via ${endpoint.name}`);
            return res.json({
              success: true,
              vix,
              symbol,
              metadata,
              source: endpoint.name
            });
          }
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint.name} failed:`, error.message);
        continue;
      }
    }
    
    // If all methods failed
    throw new Error('All VIX fetch methods failed');
    
  } catch (error) {
    console.error('❌ VIX fetch error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch VIX data',
      message: error.message
    });
  }
});

// Buffett Indicator endpoint
app.get('/api/buffett-indicator', async (req, res) => {
  console.log('🔄 Fetching Buffett Indicator from backend...');
  
  try {
    const response = await fetch('https://buffettindicator.net/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract autoRatio value from buffettindicator.net
    const patterns = [
      /let\s+autoRatio\s*=\s*([\d.]+);/i,
      /autoRatio\s*=\s*([\d.]+)/i,
      /"autoRatio"[:\s]+([\d.]+)/i
    ];
    
    let buffettValue = null;
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        buffettValue = parseFloat(match[1]);
        if (buffettValue > 50 && buffettValue < 500) {
          break;
        }
      }
    }
    
    if (buffettValue) {
      console.log(`✅ Buffett Indicator fetched: ${buffettValue}%`);
      
      // Calculate investment ratio
      let investmentRatio = 0;
      if (buffettValue <= 100) {
        investmentRatio = 100;
      } else if (buffettValue <= 140) {
        investmentRatio = 100 - ((buffettValue - 100) / 40) * 40;
      } else if (buffettValue <= 180) {
        investmentRatio = 60 - ((buffettValue - 140) / 40) * 40;
      } else {
        investmentRatio = 20;
      }
      
      return res.json({
        success: true,
        buffettIndicator: buffettValue,
        investmentRatio: Math.round(investmentRatio),
        timestamp: Date.now()
      });
    }
    
    throw new Error('Could not extract Buffett Indicator value from buffettindicator.net');
    
  } catch (error) {
    console.error('❌ Buffett Indicator fetch error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Buffett Indicator',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    service: 'A-Man Project Market Data API'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Backend proxy server running on port ${PORT}`);
  console.log(`📊 VIX API: http://localhost:${PORT}/api/vix`);
  console.log(`📈 Buffett Indicator API: http://localhost:${PORT}/api/buffett-indicator`);
});

