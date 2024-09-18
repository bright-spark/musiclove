// JSON data
const data = {
  bio: {
      name: "John Doe",
      title: "Playlist Curator",
      description:
        "YouTube Plus is a curated playlist collection of the best music videos on YouTube. Enjoy the latest hits and dance tracks from around the world.",
      image:
        "profile.png"
    },
    playlists: [
      {
        title: "Hits",
        description: "Top US Tracks on YouTube.",
        url:
          "https://www.youtube.com/embed/?4QIZE708gJ4&list=RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJFs&controls=0",
        auto:
          "https://www.youtube.com/embed/?4QIZE708gJ4&list=RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJFs&controls=0&autoplay=1"
      },
      {
        title: "Pop",
        description: "Pop Gold Tracks on YouTube.",
        url:
          "https://www.youtube.com/embed/?v=hLQl3WQQoQ0&list=RDCLAK5uy_nHSqCJjDrW9HBhCNdF6tWPdnOMngOv0wA&controls=0",
        auto:
          "https://www.youtube.com/embed/?v=hLQl3WQQoQ0&list=RDCLAK5uy_nHSqCJjDrW9HBhCNdF6tWPdnOMngOv0wA&controls=0&autoplay=1"
      },
      {
        title: "Dance",
        description: "Today's Dance Tracks on YouTube.",
        url:
          "https://www.youtube.com/embed/?ouEl3qTLc0M&list=RDCLAK5uy_kLWIr9gv1XLlPbaDS965-Db4TrBoUTxQ8&controls=0",
        auto:
          "https://www.youtube.com/embed/?ouEl3qTLc0M&list=RDCLAK5uy_kLWIr9gv1XLlPbaDS965-Db4TrBoUTxQ8&controls=0&autoplay=1"
      },
      {
        title: "Club",
        description: "Fresh Dance & Club Tracks on YouTube.",
        url:
          "https://www.youtube.com/embed/?evJ6gX1lp2o&list=RDCLAK5uy_nhf3h98yS3LCk_bVNQu6GjWG7ARvMaiFQ&controls=0",
        auto:
          "https://www.youtube.com/embed/?evJ6gX1lp2o&list=RDCLAK5uy_nhf3h98yS3LCk_bVNQu6GjWG7ARvMaiFQ&controls=0&autoplay=1"
      },
      {
        title: "Ballads",
        description: "Soft Rock Ballads on YouTube.",
        url:
          "https://www.youtube.com/embed/?v=r3Pr1_v7hsw&list=RDCLAK5uy_nyKVppE-RpLkeCcwLct4rvN9e8AAsS_qw&controls=0",
        auto:
          "https://www.youtube.com/embed/?v=r3Pr1_v7hsw&list=RDCLAK5uy_nyKVppE-RpLkeCcwLct4rvN9e8AAsS_qw&controls=0&autoplay=1"
      },
    ]
  };

// Function to check if the device is iOS or Android
function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Function to load bio content (initial page load)
function loadBio() {
  document.getElementById("profile-image").src = data.bio.image;
  loadPlaylist(0); // Load the first playlist (non-autoplay for non-mobile, autoplay for mobile)
}

// Function to load playlist content and update YouTube player
function loadPlaylist(index) {
  const playlist = data.playlists[index];
  const youtubePlayer = document.getElementById("youtube-player");

  // Load non-autoplay version first
  youtubePlayer.src = playlist.url;

  // For iOS and Android, after a short delay, switch to autoplay version
  if (isMobile()) {
    setTimeout(() => {
      youtubePlayer.src = playlist.auto;
    }, 5); // Delay allows non-autoplay to load briefly before switching to autoplay
  }
}

// Set up navigation buttons
function setupNavButtons() {
  data.playlists.forEach((playlist, index) => {
    const button = document.getElementById(`btn-${index}`);
    button.textContent = playlist.title;
    button.addEventListener("click", () => {
      loadPlaylist(index);
      selectButton(index);
    });
  });
}

// Update button states
function selectButton(selectedId) {
  document.querySelectorAll('button[id^="btn-"]').forEach((button, index) => {
    button.classList.toggle("selected", index === selectedId);
    button.classList.toggle("unselected", index !== selectedId);
  });
}

// Track various events
function trackEvent(eventType, eventData) {
  mixpanel.track(eventType, eventData);
}

// Track click events
function trackClickEvent(eventType, eventData) {
  mixpanel.track(eventType, eventData);
  trackEvent(eventType, eventData);
}

// Initialize the page
window.addEventListener("load", () => {
  trackEvent("Page View", { Page: "Home" });
  console.log("Page initialized");
});

// Make page visible after load
window.addEventListener("DOMContentLoaded", function () {
  loadBio(); // Load the bio content
  setupNavButtons(); // Set up the navigation buttons
  selectButton(0); // Select the first button by default
  // When the page is fully loaded, make the text visible and allow scrolling
  document.documentElement.classList.add("loaded");
});

