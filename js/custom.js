/* --- A place where you can add your own code -- */

(function () {
    'use strict';

    /**
     * Prevent iframes from reloading after initial page load.
     *
     * Strategy:
     *  1. Record each iframe's original src on DOMContentLoaded.
     *  2. Use a MutationObserver to revert any attribute-level src changes.
     *  3. Override the HTMLIFrameElement src property setter on each instance
     *     so that programmatic assignments (iframe.src = '...') are also blocked.
     */
    function preventIframeReloads() {
        document.querySelectorAll('iframe').forEach(function (iframe) {
            var originalSrc = iframe.getAttribute('src');

            // Block attribute-level changes (setAttribute / removeAttribute).
            var attrObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.attributeName === 'src') {
                        var current = iframe.getAttribute('src');
                        if (current !== originalSrc) {
                            // Restore original src without triggering another mutation.
                            iframe.setAttribute('src', originalSrc);
                        }
                    }
                });
            });

            attrObserver.observe(iframe, {
                attributes: true,
                attributeFilter: ['src']
            });

            // Block programmatic property assignment (iframe.src = '...').
            Object.defineProperty(iframe, 'src', {
                get: function () {
                    return originalSrc;
                },
                set: function (value) {
                    if (value !== originalSrc) {
                        console.warn(
                            '[iframe-reload-prevention] Blocked src change on',
                            iframe.id || iframe.title,
                            '— attempted:', value
                        );
                    }
                    // Do nothing; leave the iframe on its original src.
                },
                configurable: false
            });
        });
    }

    document.addEventListener('DOMContentLoaded', preventIframeReloads);
}());
