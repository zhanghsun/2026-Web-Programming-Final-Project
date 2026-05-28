/**
 * Map Module
 * ============
 * Owns all map-related logic: modal open/close, spot interactions,
 * spot state management, and [data-action="open-map"] entry points.
 *
 * Cross-module calls (at event time, not init time):
 *   → displayInfo(key)       — defined in modal.js, populates side panel
 *   → closePanel()           — defined in modal.js, hides side panel
 */

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

/** @returns {HTMLElement} */
function getMapModal() {
    return document.getElementById('mapModal');
}

/** @returns {NodeList} */
function getAllSpots() {
    return document.querySelectorAll('.spot');
}

/** @returns {HTMLElement|null} */
function getActiveSpot() {
    return document.querySelector('.spot.active');
}

// ---------------------------------------------------------------------------
// Spot state
// ---------------------------------------------------------------------------

/** Remove the active highlight from whichever spot is currently selected. */
function clearActiveSpot() {
    const active = getActiveSpot();
    if (active) active.classList.remove('active');
}

/**
 * Highlight the spot that matches a species key.
 * Also clears any previously highlighted spot.
 * @param {string} key - data-species value
 */
function highlightSpeciesSpot(key) {
    clearActiveSpot();
    const spot = document.querySelector(`.spot[data-species="${key}"]`);
    if (spot) spot.classList.add('active');
}

// ---------------------------------------------------------------------------
// Map modal
// ---------------------------------------------------------------------------

// Track the nav link that was active before the map opened so we can restore it.
var _prevActiveNavLink = null;

/** Set the map nav link as the active nav item, saving the previous active link. */
function _activateMapNavLink() {
    _prevActiveNavLink = document.querySelector('.nav-link.active') || null;
    document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
    var mapLink = document.querySelector('.nav-link[data-action="open-map"]');
    if (mapLink) mapLink.classList.add('active');
}

/** Restore the nav active state that existed before the map was opened. */
function _restoreNavLink() {
    document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
    if (_prevActiveNavLink) {
        _prevActiveNavLink.classList.add('active');
    } else {
        var homeLink = document.getElementById('nav-home');
        if (homeLink) homeLink.classList.add('active');
    }
    _prevActiveNavLink = null;
}

/** Open the ecology map modal with a cinematic fade-in + scale animation. */
function openMap() {
    const modal = getMapModal();
    if (!modal) return;
    _activateMapNavLink();
    modal.style.display = 'flex';        // Switch from none → flex before animating
    modal.getBoundingClientRect();        // Force reflow so opacity transition fires
    modal.classList.add('is-open');
    document.body.classList.add('map-modal-open');  // Prevent background scroll
}

/**
 * Close the ecology map modal with a fade-out animation, then hide it.
 * Calls closePanel() from modal.js if available.
 */
function closeMap() {
    const modal = getMapModal();
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('map-modal-open');
    _restoreNavLink();
    clearActiveSpot();
    if (typeof closePanel === 'function') closePanel();
    // Hide after the opacity transition finishes (matches 0.45s in CSS)
    function onFadeOut(e) {
        if (e.propertyName === 'opacity') {
            modal.style.display = 'none';
            modal.removeEventListener('transitionend', onFadeOut);
        }
    }
    modal.addEventListener('transitionend', onFadeOut);
}

// ---------------------------------------------------------------------------
// Spot interaction
// ---------------------------------------------------------------------------

/**
 * Handle a click (or Enter/Space keydown) on a map hotspot.
 * Highlights the spot and delegates panel population to modal.js.
 * `this` refers to the spot element.
 */
function handleSpotClick() {
    const key = this.getAttribute('data-species');
    if (!key) {
        console.warn('Map spot is missing data-species attribute:', this);
        return;
    }
    highlightSpeciesSpot(key);
    if (typeof displayInfo === 'function') displayInfo(key);
}

/**
 * Attach click and keyboard events to a single spot element.
 * @param {HTMLElement} spot
 */
function bindSpotEvents(spot) {
    spot.setAttribute('tabindex', '0');
    spot.setAttribute('role', 'button');
    spot.addEventListener('click', handleSpotClick);
    spot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSpotClick.call(this);
        }
    });
}

// ---------------------------------------------------------------------------
// Map entry-point triggers
// ---------------------------------------------------------------------------

/**
 * Bind all [data-action="open-map"] elements so clicking or pressing
 * Enter/Space opens the map modal.
 * Centralised here because opening the map is a map concern.
 */
function bindOpenMapTriggers() {
    document.querySelectorAll('[data-action="open-map"]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            openMap();
        });
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openMap();
            }
        });
    });
}

// ---------------------------------------------------------------------------
// Map modal backdrop
// ---------------------------------------------------------------------------

/**
 * Close the map when the user clicks outside the map-wrapper (on the backdrop).
 * @param {MouseEvent} e
 */
function handleMapBackdropClick(e) {
    const modal = getMapModal();
    if (modal && e.target === modal) closeMap();
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** @returns {number} Total number of hotspots on the map. */
function getSpeciesCount() {
    return getAllSpots().length;
}

/**
 * Verify all spots carry a data-species attribute.
 * Logs a warning for any that are missing.
 */
function validateMapSetup() {
    getAllSpots().forEach(function (spot, i) {
        if (!spot.getAttribute('data-species')) {
            console.warn('Map spot at index', i, 'is missing data-species:', spot);
        }
    });
}

/** Reset map to its initial state: clear selection and hide the side panel. */
function resetMap() {
    clearActiveSpot();
    if (typeof closePanel === 'function') closePanel();
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

/**
 * Set up all map functionality.
 * Called once by main.js on DOMContentLoaded.
 */
function initMap() {
    validateMapSetup();
    getAllSpots().forEach(bindSpotEvents);
    bindOpenMapTriggers();
    window.addEventListener('click', handleMapBackdropClick);

    // Expose openMap globally so any legacy call sites remain functional.
    window.openMap = openMap;
}
