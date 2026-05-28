/**
 * Modal Module
 * ==============
 * Owns all modal and side-panel state:
 *   - Resource info modal (showResource / closeResource)
 *   - Side panel species detail display (displayInfo / closePanel)
 *   - Action-button close handlers ([data-action])
 *   - Species list → side panel binding
 *   - Resource modal backdrop and global Escape key
 *
 * Cross-module calls (at event time, not init time):
 *   → closeMap()              — defined in map.js, closes the map modal
 *   → highlightSpeciesSpot()  — defined in map.js, highlights the matching hotspot
 */

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

/** @returns {HTMLElement} */
function getResourceModal() {
    return document.getElementById('resourceModal');
}

/** @returns {HTMLElement} */
function getSidePanel() {
    return document.getElementById('sidePanel');
}

// ---------------------------------------------------------------------------
// Resource modal
// ---------------------------------------------------------------------------

/**
 * Open the resource info modal and populate it with content.
 * @param {string} title
 * @param {string} text  — may contain plain text; treated as textContent (safe)
 */
function showResource(title, text) {
    const titleEl = document.getElementById('resource-title');
    const textEl  = document.getElementById('resource-text');
    if (titleEl) titleEl.textContent = title;
    if (textEl)  textEl.textContent  = text;

    const modal = getResourceModal();
    if (modal) modal.style.display = 'block';
}

/** Close the resource info modal. */
function closeResource() {
    const modal = getResourceModal();
    if (modal) modal.style.display = 'none';
}

// ---------------------------------------------------------------------------
// Side panel
// ---------------------------------------------------------------------------

/**
 * Populate the side panel with species data and slide it open.
 * Requires speciesData (species-data.js) to be loaded first.
 * @param {string} key - Matches a key in speciesData
 */
function displayInfo(key) {
    if (typeof speciesData === 'undefined') {
        console.error('speciesData not loaded. Ensure species-data.js is loaded before modal.js.');
        return;
    }

    const data = speciesData[key];
    if (!data) {
        console.warn('No species data found for key:', key);
        return;
    }

    setPanelField('panelTitle',        data.name,           'innerText');
    setPanelField('panelScientific',   data.scientific,     'innerText');
    setPanelField('panelClass',        data.classification, 'innerText');
    setPanelField('panelDist',         data.dist,           'innerHTML');
    setPanelField('panelThreats',      data.threats,        'innerHTML');
    setPanelField('panelConservation', data.conservation,   'innerHTML');

    const avatar = document.getElementById('panelAvatar');
    if (avatar) {
        avatar.src = data.avatar;
        avatar.alt = data.name;
    }

    const panel = getSidePanel();
    if (panel) panel.classList.add('show');
}

/**
 * Helper: set one panel field by element id.
 * @param {string} id
 * @param {string} value
 * @param {'innerText'|'innerHTML'} prop
 */
function setPanelField(id, value, prop) {
    const el = document.getElementById(id);
    if (el && value !== undefined) el[prop] = value;
}

/** Slide the side panel closed. */
function closePanel() {
    const panel = getSidePanel();
    if (panel) panel.classList.remove('show');
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

/**
 * Close the resource modal when the user clicks on its backdrop.
 * The map modal backdrop is handled in map.js.
 * @param {MouseEvent} e
 */
function handleResourceBackdropClick(e) {
    if (e.target === getResourceModal()) closeResource();
}

/**
 * Delegate all [data-action] close buttons.
 * Calls closeMap() from map.js where needed.
 * @param {MouseEvent} e
 */
function handleActionClick(e) {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-action');
    if (!action) return;
    e.preventDefault();

    switch (action) {
        case 'close-map':
            if (typeof closeMap === 'function') closeMap();
            break;
        case 'close-resource':
            closeResource();
            break;
        case 'close-panel':
            closePanel();
            break;
    }
}

/**
 * Handle a click on any .species-list item.
 * Populates the side panel and, if the map is open, highlights the hotspot.
 * @param {MouseEvent} e
 */
function handleSpeciesListClick(e) {
    const li = e.target.closest('li[data-species]');
    if (!li) return;

    const key = li.getAttribute('data-species');
    if (!key) return;

    displayInfo(key);

    // Highlight the matching map hotspot if the function is available
    // (map.js must be loaded; safe to call at event time)
    if (typeof highlightSpeciesSpot === 'function') highlightSpeciesSpot(key);
}

/**
 * Close all modals/panels when Escape is pressed.
 * @param {KeyboardEvent} e
 */
function handleGlobalEscape(e) {
    if (e.key !== 'Escape') return;
    if (typeof closeMap === 'function') closeMap();
    closeResource();
    closePanel();
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

/**
 * Bind all modal and panel event listeners.
 * Called once by main.js on DOMContentLoaded.
 */
function initModals() {
    // Resource modal backdrop
    window.addEventListener('click', handleResourceBackdropClick);

    // [data-action] close buttons (delegated on document)
    document.addEventListener('click', handleActionClick);

    // Species lists in hero and map panel
    document.querySelectorAll('.species-list').forEach(function (list) {
        list.addEventListener('click', handleSpeciesListClick);
    });

    // Global Escape key
    document.addEventListener('keydown', handleGlobalEscape);
}
