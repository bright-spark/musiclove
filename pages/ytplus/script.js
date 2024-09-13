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

// Function to track button clicks
function trackButtonClick(buttonId) {
    mixpanel.track('Button Click', {
        'button_id': buttonId
    });
}

// Function to track tab clicks
function trackTabClick(tabName, tabId) {
    mixpanel.track('Tab Click', {
        'tab_name': tabName,
        'tab_id': tabId
    });
}

// Function to track playlist clicks
function trackPlaylistClick(playlistName, playlistId) {
    mixpanel.track('Playlist Click', {
        'playlist_name': playlistName,
        'playlist_id': playlistId
    });
}

// Function to track video clicks
function trackVideoClick(videoName, videoId) {
    mixpanel.track('Video Click', {
        'video_name': videoName,
        'video_id': videoId
    });

}

// Function to track video plays
function trackVideoPlay(videoName, videoId) {
    mixpanel.track('Video Play', {
        'video_name': videoName,
        'video_id': videoId
    });

}

// Function to track video pauses
function trackVideoPause(videoName, videoId) {
    mixpanel.track('Video Pause', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video ends
function trackVideoEnd(videoName, videoId) {
    mixpanel.track('Video End', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video errors
function trackVideoError(videoName, videoId) {
    mixpanel.track('Video Error', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video progress
function trackVideoProgress(videoName, videoId) {
    mixpanel.track('Video Progress', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video volume changes
function trackVideoVolumeChange(videoName, videoId) {
    mixpanel.track('Video Volume Change', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video full screen changes
function trackVideoFullScreenChange(videoName, videoId) {
    mixpanel.track('Video Full Screen Change', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video quality changes
function trackVideoQualityChange(videoName, videoId) {
    mixpanel.track('Video Quality Change', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video playback rate changes
function trackVideoPlaybackRateChange(videoName, videoId) {
    mixpanel.track('Video Playback Rate Change', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video captions changes
function trackVideoCaptionsChange(videoName, videoId) {
    mixpanel.track('Video Captions Change', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video picture-in-picture changes
function trackVideoPictureInPictureChange(videoName, videoId) {
    mixpanel.track('Video Picture-in-Picture Change', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video download requests
function trackVideoDownloadRequest(videoName, videoId) {
    mixpanel.track('Video Download Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video share requests
function trackVideoShareRequest(videoName, videoId) {
    mixpanel.track('Video Share Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video embed requests
function trackVideoEmbedRequest(videoName, videoId) {
    mixpanel.track('Video Embed Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video comments requests
function trackVideoCommentsRequest(videoName, videoId) {
    mixpanel.track('Video Comments Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video likes requests
function trackVideoLikesRequest(videoName, videoId) {
    mixpanel.track('Video Likes Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video dislikes requests
function trackVideoDislikesRequest(videoName, videoId) {
    mixpanel.track('Video Dislikes Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video subscribe requests
function trackVideoSubscribeRequest(videoName, videoId) {
    mixpanel.track('Video Subscribe Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video notifications requests
function trackVideoNotificationsRequest(videoName, videoId) {
    mixpanel.track('Video Notifications Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video report requests
function trackVideoReportRequest(videoName, videoId) {
    mixpanel.track('Video Report Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video transcript requests
function trackVideoTranscriptRequest(videoName, videoId) {
    mixpanel.track('Video Transcript Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video save requests
function trackVideoSaveRequest(videoName, videoId) {
    mixpanel.track('Video Save Request', {
        'video_name': videoName,
        'video_id': videoId
    });

}

// Function to track video copy requests
function trackVideoCopyRequest(videoName, videoId) {
    mixpanel.track('Video Copy Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video mute requests
function trackVideoMuteRequest(videoName, videoId) {
    mixpanel.track('Video Mute Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video unmute requests
function trackVideoUnmuteRequest(videoName, videoId) {
    mixpanel.track('Video Unmute Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video seek requests
function trackVideoSeekRequest(videoName, videoId) {
    mixpanel.track('Video Seek Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video skip requests
function trackVideoSkipRequest(videoName, videoId) {
    mixpanel.track('Video Skip Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video replay requests
function trackVideoReplayRequest(videoName, videoId) {
    mixpanel.track('Video Replay Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video forward requests
function trackVideoForwardRequest(videoName, videoId) {
    mixpanel.track('Video Forward Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video rewind requests
function trackVideoRewindRequest(videoName, videoId) {
    mixpanel.track('Video Rewind Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video loop requests
function trackVideoLoopRequest(videoName, videoId) {
    mixpanel.track('Video Loop Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video shuffle requests
function trackVideoShuffleRequest(videoName, videoId) {
    mixpanel.track('Video Shuffle Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video repeat requests
function trackVideoRepeatRequest(videoName, videoId) {
    mixpanel.track('Video Repeat Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video share requests
function trackVideoShareRequest(videoName, videoId) {
    mixpanel.track('Video Share Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video embed requests
function trackVideoEmbedRequest(videoName, videoId) {
    mixpanel.track('Video Embed Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video comments requests
function trackVideoCommentsRequest(videoName, videoId) {
    mixpanel.track('Video Comments Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video likes requests
function trackVideoLikesRequest(videoName, videoId) {
    mixpanel.track('Video Likes Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video dislikes requests
function trackVideoDislikesRequest(videoName, videoId) {
    mixpanel.track('Video Dislikes Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Function to track video subscribe requests
function trackVideoSubscribeRequest(videoName, videoId) {
    mixpanel.track('Video Subscribe Request', {
        'video_name': videoName,
        'video_id': videoId
    });
}

// Set up service worker
// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(error) {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}
