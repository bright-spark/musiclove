function setupContentFrameListener() {
    const contentFrame = document.getElementById("contentFrame");

    // Wait until the contentFrame is fully loaded
    contentFrame.onload = function() {
        attachYouTubeIframeListener(contentFrame);
    };

    // Fallback: Make sure the listener is also attached in case onload doesn't trigger
    attachYouTubeIframeListener(contentFrame);
}

// Use a delegated event listener for all links inside the content iframe
function attachYouTubeIframeListener(contentFrame) {
    try {
        const iframeDocument = contentFrame.contentDocument || contentFrame.contentWindow.document;

        // Delegate event handling to the parent document inside the iframe
        iframeDocument.addEventListener("click", function(event) {
            let target = event.target;

            // Check if the clicked target is a YouTube link
            if (target.tagName === "A" && target.href.includes("youtube.com")) {
                event.preventDefault(); // Prevent default navigation
                handleYouTubeLink(target.href); // Handle the YouTube popout
            }
        });
    } catch (error) {
        console.error("Error accessing the iframe document:", error);
    }
}

// Handle YouTube popout (same mechanism)
function handleYouTubeLink(youtubeUrl) {
    openYouTubeLink(youtubeUrl);
    returnToIframe();
}

function openYouTubeLink(youtubeUrl) {
    const youtubeAppUrl = "vnd.youtube://" + youtubeUrl.split('watch?v=')[1];
    window.location.href = youtubeAppUrl;

    setTimeout(() => {
        window.location.href = youtubeUrl;
    }, 1000); // Fallback to browser
}

function returnToIframe() {
    const contentFrame = document.getElementById("contentFrame");

    // Preserve iframe state
    preserveIframeContent(contentFrame);

    // Use postMessage() to signal return to the iframe
    contentFrame.contentWindow.postMessage("focusIframe", "*");
}

function preserveIframeContent(iframe) {
    const content = iframe.contentWindow.document.body.innerHTML;
    sessionStorage.setItem("iframeContent", content);
}

window.onload = function() {
    setupContentFrameListener();
};