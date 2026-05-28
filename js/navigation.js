/**
 * Navigation Module
 * ===================
 * Handles page navigation, role switching, and nav state.
 *
 * Responsibilities:
 * - Show/hide pages and sync .nav-link active state
 * - Role-based resource center switching
 * - Bind all [data-page] links
 * - Logo image fallback on load error
 *
 * Note: [data-action="open-map"] triggers are bound in map.js because
 * opening the map is a map concern, not a navigation concern.
 */

/**
 * Show a specific page and update the active nav link.
 * @param {string} pageId - ID prefix of the target page (without '-page' suffix)
 */
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Clear active state on all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Activate target page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Activate matching nav link (links have id="nav-<pageId>")
    const targetLink = document.getElementById('nav-' + pageId);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Re-run scroll reveal for newly visible content
    if (typeof window.reinitializeAnimations === 'function') {
        setTimeout(() => window.reinitializeAnimations(), 100);
    }
}

/**
 * Switch the active role in the Resources page.
 * @param {string} role  - Target role key (student | teacher | database)
 * @param {HTMLElement} btn - The role button that was clicked
 */
function switchRole(role, btn) {
    // Update role button active state
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show matching info card, hide others
    document.querySelectorAll('.info-card').forEach(card => card.classList.remove('active'));
    const targetCard = document.getElementById(role + '-info');
    if (targetCard) {
        targetCard.classList.add('active');
    }

    // Re-run scroll reveal for newly visible cards
    if (typeof window.reinitializeAnimations === 'function') {
        setTimeout(() => window.reinitializeAnimations(), 100);
    }
}

/**
 * Set up all navigation event bindings and initial state.
 * Called once by main.js on DOMContentLoaded.
 */
function initNavigation() {
    // Mark home as active on first load
    const homeLink = document.getElementById('nav-home');
    if (homeLink) {
        homeLink.classList.add('active');
    }

    // Page-switching links ([data-page])
    document.querySelectorAll('[data-page]').forEach(el => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) showPage(page);
        });
    });

    // Logo fallback: hide if image fails to load
    const logo = document.querySelector('.header-logo');
    if (logo) {
        logo.addEventListener('error', function () {
            this.style.display = 'none';
        });
    }
}
