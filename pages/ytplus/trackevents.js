
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