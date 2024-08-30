let wakeLock = null;

async function wakey() {
    wakeLock = await navigator.wakeLock.request('screen');
};

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock released:', wakeLock.released);
    });
    console.log('Wake Lock is active');
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

async function releaseWakeLock() {
  if (wakeLock !== null) {
    await wakeLock.release();
    wakeLock = null;
    console.log('Wake Lock released');
  }
}

async function play() {
    try {
      // Request wake lock to keep the screen active
      await requestWakeLock();
  
      // Check if the videoElement and its contentWindow are accessible
      if (videoElement && videoElement.contentWindow) {
        let attempts = 0;
        const maxAttempts = 5;
  
        // Try to play the video, retrying if necessary
        while (attempts < maxAttempts) {
          videoElement.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          console.log('Attempting to resume video playback');
          
          // Wait a bit before retrying to give the command time to process
          await new Promise(resolve => setTimeout(resolve, 500));
  
          // If video is playing, break out of the loop
          if (!videoElement.paused) {
            console.log('Video resumed successfully');
            break;
          }
  
          attempts++;
        }
  
        if (attempts === maxAttempts) {
          console.error('Failed to resume video playback after multiple attempts');
        }
      } else {
        console.error('videoElement is not ready or contentWindow is not accessible');
      }
    } catch (err) {
      console.error('Error during video playback:', err);
    }
  }
  

const videoElement = document.getElementById('playlistiframe');
videoElement.addEventListener('play', play);
videoElement.addEventListener('pause', play);
videoElement.addEventListener('ended', play);

// Optional: Handle visibility change to re-apply wake lock when returning to the page
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible' && wakeLock === null && !videoElement.paused) {
    await wakey();
  }
});
