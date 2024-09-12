// JSON data
const data = {
    "bio": {
        "name": "John Doe",
        "title": "Playlist Curator",
        "description": "YouTube Plus is a curated playlist of the best music videos on YouTube. Enjoy the latest hits and dance tracks from around the world.",
        "image": "profile.png"
    },
    "playlists": [
        {
            "title": "Hits",
            "description": "Top US Tracks on YouTube.",
            "url": "https://www.youtube.com/embed/?4QIZE708gJ4&list=RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJFs&controls=0",
            "auto": "https://www.youtube.com/embed/?4QIZE708gJ4&list=RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJFs&controls=0&autoplay=1"
        },
        {
            "title": "Club",
            "description": "Fresh Dance & Club Tracks on YouTube.",
            "url": "https://www.youtube.com/embed/?evJ6gX1lp2o&list=RDCLAK5uy_nhf3h98yS3LCk_bVNQu6GjWG7ARvMaiFQ&controls=0",
            "auto": "https://www.youtube.com/embed/?evJ6gX1lp2o&list=RDCLAK5uy_nhf3h98yS3LCk_bVNQu6GjWG7ARvMaiFQ&controls=0&autoplay=1"
        },
        {
            "title": "Pop",
            "description": "Pop Gold Tracks on YouTube.",
            "url": "https://www.youtube.com/embed/?v=hLQl3WQQoQ0&list=RDCLAK5uy_nHSqCJjDrW9HBhCNdF6tWPdnOMngOv0wA&controls=0",
            "auto": "https://www.youtube.com/embed/?v=hLQl3WQQoQ0&list=RDCLAK5uy_nHSqCJjDrW9HBhCNdF6tWPdnOMngOv0wA&controls=0&autoplay=1"
        },
        {
            "title": "Ballads",
            "description": "Soft Rock Ballads on YouTube.",
            "url": "https://www.youtube.com/embed/?v=r3Pr1_v7hsw&list=RDCLAK5uy_nyKVppE-RpLkeCcwLct4rvN9e8AAsS_qw&controls=0",
            "auto": "https://www.youtube.com/embed/?v=r3Pr1_v7hsw&list=RDCLAK5uy_nyKVppE-RpLkeCcwLct4rvN9e8AAsS_qw&controls=0&autoplay=1"
        },
        {
            "title": "Dance",
            "description": "Today's Dance Tracks on YouTube.",
            "url": "https://www.youtube.com/embed/?ouEl3qTLc0M&list=RDCLAK5uy_kLWIr9gv1XLlPbaDS965-Db4TrBoUTxQ8&controls=0",
            "auto": "https://www.youtube.com/embed/?ouEl3qTLc0M&list=RDCLAK5uy_kLWIr9gv1XLlPbaDS965-Db4TrBoUTxQ8&controls=0&autoplay=1"
        },
    ]
};

// Function to check if the device is iOS or Android
function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Function to load bio content (initial page load)
function loadBio() {
    document.getElementById('profile-image').src = data.bio.image;
    loadPlaylist(0);  // Load the first playlist (non-autoplay for non-mobile, autoplay for mobile)
}

// Function to load playlist content and update YouTube player
function loadPlaylist(index) {
    const playlist = data.playlists[index];
    const youtubePlayer = document.getElementById('youtube-player');
    
    // Load non-autoplay version first
    youtubePlayer.src = playlist.url;

    // For iOS and Android, after a short delay, switch to autoplay version
    if (isMobile()) {
        setTimeout(() => {
            youtubePlayer.src = playlist.auto;
        }, 1000);  // Delay allows non-autoplay to load briefly before switching to autoplay
    }
}

// Function to set up navigation buttons
function setupNavButtons() {
    data.playlists.forEach((playlist, index) => {
        const button = document.getElementById(`btn-${index}`);
        button.textContent = playlist.title;
        button.addEventListener('click', () => loadPlaylist(index));  // Load non-autoplay, autoplay for mobile
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadBio();  // Load the bio section and first playlist on initial page load
    setupNavButtons();  // Set up navigation buttons for playlists
});

function selectButton(selectedId) {
    // Get all buttons
    const buttons = document.querySelectorAll('button[id^="btn-"]');

    // Loop through buttons and adjust size based on selection
    buttons.forEach((button, index) => {
        if (index === selectedId) {
            button.classList.remove('unselected');
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
            button.classList.add('unselected');
        }
    });
}

// Initialize the first button as selected on page load
window.onload = () => {
    selectButton(0); // Button 1 is selected by default
};

// Set up service worker
// Register the service worker
/*if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(error) {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}*/
