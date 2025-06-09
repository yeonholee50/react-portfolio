/* eslint-disable no-restricted-globals */
let startTime = null;
let isRunning = false;
let intervalId = null;

function sendUpdate() {
  if (isRunning && startTime) {
    const elapsed = Date.now() - startTime;
    self.postMessage({
      type: 'UPDATE',
      elapsed,
      isRunning
    });
  }
}

self.onmessage = function(e) {
  const { type, savedStartTime } = e.data;
  
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
      if (isRunning) {
        clearInterval(intervalId);
        isRunning = false;
        startTime = null;
        self.postMessage({
          type: 'UPDATE',
          elapsed: 0,
          isRunning: false
        });
      }
      break;
      
    case 'GET_STATE':
      sendUpdate();
      break;

    case 'INIT':
      if (savedStartTime) {
        startTime = savedStartTime;
        isRunning = true;
        intervalId = setInterval(sendUpdate, 1000);
        sendUpdate();
      }
      break;
  }
}; 