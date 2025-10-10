/* eslint-disable no-restricted-globals */
let startTime = null;
let isRunning = false;
let intervalId = null;
let savedElapsed = 0;

function sendUpdate() {
  const elapsed = isRunning && startTime ? Date.now() - startTime + savedElapsed : savedElapsed;
  self.postMessage({
    type: 'UPDATE',
    elapsed,
    isRunning
  });
}

self.onmessage = function(e) {
  const { type, savedStartTime, savedElapsed: receivedElapsed } = e.data;
  
  switch (type) {
    case 'START':
      if (!isRunning) {
        startTime = savedStartTime || Date.now();
        isRunning = true;
        intervalId = setInterval(sendUpdate, 1000);
        sendUpdate(); // Send immediate update
      }
      break;
      
    case 'STOP':
      // Always stop regardless of current state
      clearInterval(intervalId);
      intervalId = null;
      isRunning = false;
      startTime = null;
      savedElapsed = 0; // Reset saved elapsed time to 0
      // Force an immediate update with 0 elapsed time
      self.postMessage({
        type: 'UPDATE',
        elapsed: 0,
        isRunning: false
      });
      break;
      
    case 'GET_STATE':
      if (!isRunning) {
        // If not running, ensure we send a 0 elapsed time
        self.postMessage({
          type: 'UPDATE',
          elapsed: 0,
          isRunning: false
        });
      } else {
        sendUpdate();
      }
      break;

    case 'INIT':
      if (savedStartTime) {
        startTime = savedStartTime;
        isRunning = true;
        intervalId = setInterval(sendUpdate, 1000);
        sendUpdate();
      } else if (receivedElapsed !== undefined) {
        // Initialize with saved elapsed time but not running
        isRunning = false;
        startTime = null;
        savedElapsed = receivedElapsed || 0;
        self.postMessage({
          type: 'UPDATE',
          elapsed: savedElapsed,
          isRunning: false
        });
      } else {
        // If no saved data, ensure timer is stopped
        isRunning = false;
        startTime = null;
        savedElapsed = 0;
        self.postMessage({
          type: 'UPDATE',
          elapsed: 0,
          isRunning: false
        });
      }
      break;
  }
}; 