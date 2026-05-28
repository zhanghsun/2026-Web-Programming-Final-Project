/**
 * Main Module
 * ============
 * Application entry point. Initializes each feature module once,
 * then dismisses the loading overlay.
 */

let isInitialized = false;

function initializeApp() {
    if (isInitialized) return;

    // Order matters: data -> navigation/modals -> page features -> animations
    if (typeof window.initNavigation === 'function') window.initNavigation();
    if (typeof window.initModals    === 'function') window.initModals();
    if (typeof window.initMap       === 'function') window.initMap();
    if (typeof window.initResources === 'function') window.initResources();
    if (typeof window.initForm      === 'function') window.initForm();
    if (typeof window.initAnimations=== 'function') window.initAnimations();

    isInitialized = true;
}

/**
 * Fade out and remove the loading overlay.
 * A brief delay (280 ms) lets the browser finish its first paint so
 * the home page is visible before the curtain lifts.
 */
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;

    setTimeout(function () {
        overlay.classList.add('fade-out');
        overlay.addEventListener('transitionend', function () {
            overlay.style.display = 'none';
        }, { once: true });
    }, 280);
}

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    hideLoadingOverlay();
});
