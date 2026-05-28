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
            // If the map modal is open, close it first (without restoring its previous nav state)
            const mapModal = document.getElementById('mapModal');
            if (mapModal && mapModal.classList.contains('is-open')) {
                mapModal.classList.remove('is-open');
                document.body.classList.remove('map-modal-open');
                if (typeof clearActiveSpot === 'function') clearActiveSpot();
                if (typeof closePanel === 'function') closePanel();
                function onFadeOut(ev) {
                    if (ev.propertyName === 'opacity') {
                        mapModal.style.display = 'none';
                        mapModal.removeEventListener('transitionend', onFadeOut);
                    }
                }
                mapModal.addEventListener('transitionend', onFadeOut);
            }
            if (page) showPage(page);
        });
    });

    // Hide header + nav on scroll-down, reveal on scroll-up
    initScrollHide();

    // Logo fallback: hide if image fails to load
    const logo = document.querySelector('.header-logo');
    if (logo) {
        logo.addEventListener('error', function () {
            this.style.display = 'none';
        });
    }

    // Home page species tabs
    initHomeSpeciesTabs();
}

/**
 * Wire up the FAUNA / FLORA tab switcher on the home page,
 * and bind click + keyboard on every .hp-sc species card so
 * it opens the side panel via displayInfo() from modal.js.
 */
/**
 * Hide the header + nav when scrolling down; reveal when scrolling up.
 * A 60px deadzone prevents jitter on tiny scroll wiggles.
 */
function initScrollHide() {
    const header = document.querySelector('.header');
    const nav    = document.querySelector('.nav');
    if (!header || !nav) return;

    let lastY    = window.scrollY;
    const THRESHOLD = 60;

    window.addEventListener('scroll', function () {
        const currentY = window.scrollY;
        const delta    = currentY - lastY;

        if (delta > 6 && currentY > THRESHOLD) {
            // Scrolling down — hide
            header.classList.add('nav--hidden');
            nav.classList.add('nav--hidden');
        } else if (delta < -4) {
            // Scrolling up — show
            header.classList.remove('nav--hidden');
            nav.classList.remove('nav--hidden');
        }

        lastY = currentY;
    }, { passive: true });
}

function initHomeSpeciesTabs() {
    // Tab switching
    document.querySelectorAll('.hp-species-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            const target = this.getAttribute('data-tab');

            // Update tab active state
            document.querySelectorAll('.hp-species-tab').forEach(function (t) {
                t.classList.remove('hp-species-tab--active');
                t.setAttribute('aria-selected', 'false');
            });
            this.classList.add('hp-species-tab--active');
            this.setAttribute('aria-selected', 'true');

            // Show matching grid
            document.querySelectorAll('.hp-species__grid').forEach(function (g) {
                g.classList.remove('hp-species__grid--active');
            });
            const grid = document.getElementById('hp-grid-' + target);
            if (grid) {
                grid.classList.add('hp-species__grid--active');
                // Re-run scroll reveal for newly visible cards
                if (typeof window.reinitializeAnimations === 'function') {
                    setTimeout(function () { window.reinitializeAnimations(); }, 80);
                }
            }
        });
    });

    // Species card clicks → open side panel
    document.addEventListener('click', function (e) {
        const card = e.target.closest('.hp-sc[data-species]');
        if (!card) return;
        const key = card.getAttribute('data-species');
        if (key && typeof displayInfo === 'function') displayInfo(key);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const card = e.target.closest('.hp-sc[data-species]');
        if (!card) return;
        e.preventDefault();
        const key = card.getAttribute('data-species');
        if (key && typeof displayInfo === 'function') displayInfo(key);
    });
}
