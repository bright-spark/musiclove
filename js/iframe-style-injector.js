// Absolute URL so the path resolves correctly regardless of the iframe's
// own location (e.g. pages/sub/index.html vs pages/index.html).
const GLOBAL_IFRAME_CSS_URL = new URL('/css/global-iframe.css', window.location.origin).href;

// Function to inject CSS into an iframe
function injectStylesIntoIframe(iframe) {
    try {
        // Wait for iframe to load
        iframe.addEventListener('load', function() {
            // Create link element
            const linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.type = 'text/css';
            linkElement.href = GLOBAL_IFRAME_CSS_URL;

            // Try to inject into iframe's head
            try {
                if (iframe.contentDocument && iframe.contentDocument.head) {
                    iframe.contentDocument.head.appendChild(linkElement);
                }
            } catch (e) {
                console.warn('Could not inject styles into iframe:', e);
            }
        });
    } catch (e) {
        console.warn('Error setting up iframe style injection:', e);
    }
}

// Function to handle all iframes
function setupIframeStyleInjection() {
    // Handle existing iframes
    document.querySelectorAll('iframe').forEach(injectStylesIntoIframe);

    // Watch for new iframes being added
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeName === 'IFRAME') {
                    injectStylesIntoIframe(node);
                }
                // Check for iframes within added nodes
                if (node.querySelectorAll) {
                    node.querySelectorAll('iframe').forEach(injectStylesIntoIframe);
                }
            });
        });
    });

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', setupIframeStyleInjection);
