/* eslint-disable no-restricted-globals */
let startTime = null;
let isRunning = false;
let intervalId = null;

function sendUpdate() {
  const elapsed = isRunning && startTime ? Date.now() - startTime : 0;
  self.postMessage({
    type: 'UPDATE',
    elapsed,
    isRunning
  });
}

self.onmessage = function(e) {
  const { type, savedStartTime, reset } = e.data;
  
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
      if (isRunning || reset) {
        clearInterval(intervalId);
        isRunning = false;
        startTime = null;
        // Force an immediate update with 0 elapsed time
        self.postMessage({
          type: 'UPDATE',
          elapsed: 0,
          isRunning: false
        });
      }
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
      } else {
        // If no saved start time, ensure timer is stopped
        isRunning = false;
        startTime = null;
        self.postMessage({
          type: 'UPDATE',
          elapsed: 0,
          isRunning: false
        });
      }
      break;
  }
}; 