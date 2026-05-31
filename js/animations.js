/**
 * Animations Module
 * ===================
 * Handles scroll reveal animations using Intersection Observer API.
 * Provides performance-optimized, lightweight animation system.
 * 
 * Responsibilities:
 * - Intersection Observer setup
 * - Scroll reveal triggers
 * - Animation state management
 * - Dynamic content animation support
 */

/**
 * Initialize scroll reveal animations
 * Uses Intersection Observer for efficient performance
 */
function initScrollRevealAnimations() {
    // Configuration for Intersection Observer
    const observerOptions = {
        threshold: 0.1,          // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px'  // Start animation 50px before element enters
    };

    // Create Intersection Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add reveal class to trigger animation
                entry.target.classList.add('reveal');

                // Unobserve after animation (performance optimization)
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all scroll-reveal elements
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Store observer globally for later use
    window.revealObserver = revealObserver;
}

/**
 * Re-initialize animations when page content changes
 * Used for dynamic content or page switching
 */
function reinitializeAnimations() {
    // Get unreveal elements (not yet animated)
    const unrevealed = document.querySelectorAll('.scroll-reveal:not(.reveal)');

    if (window.revealObserver && unrevealed.length > 0) {
        unrevealed.forEach(element => {
            window.revealObserver.observe(element);
        });
    }
}

/**
 * Add animation to element manually
 * Useful for triggering animations on user interaction
 * @param {HTMLElement} element - Element to animate
 * @param {string} animationClass - Animation class name (default: 'reveal')
 */
function animateElement(element, animationClass = 'reveal') {
    if (element && element.classList) {
        element.classList.add(animationClass);
    }
}

/**
 * Remove animation from element
 * @param {HTMLElement} element - Element to un-animate
 * @param {string} animationClass - Animation class name (default: 'reveal')
 */
function unAnimateElement(element, animationClass = 'reveal') {
    if (element && element.classList) {
        element.classList.remove(animationClass);
    }
}

/**
 * Enable animations for a specific container
 * Useful for dynamically added content
 * @param {HTMLElement} container - Container element
 */
function enableAnimationsInContainer(container) {
    if (!container || !window.revealObserver) return;

    const elements = container.querySelectorAll('.scroll-reveal:not(.reveal)');
    elements.forEach(element => {
        window.revealObserver.observe(element);
    });
}

/**
 * Check if animations are supported
 * @returns {boolean} True if Intersection Observer is supported
 */
function areAnimationsSupported() {
    return 'IntersectionObserver' in window;
}

/**
 * Get animation statistics for debugging
 * @returns {object} Statistics about animated elements
 */
function getAnimationStats() {
    const totalReveal = document.querySelectorAll('.scroll-reveal').length;
    const revealedCount = document.querySelectorAll('.scroll-reveal.reveal').length;
    const unrevealedCount = totalReveal - revealedCount;

    return {
        total: totalReveal,
        revealed: revealedCount,
        unrevealed: unrevealedCount,
        percentage: totalReveal > 0 ? Math.round((revealedCount / totalReveal) * 100) : 0
    };
}

/**
 * Initialize animations on page load
 * Sets up all animation systems
 */
function initAnimations() {
    // Check browser support
    if (!areAnimationsSupported()) {
        console.warn('Intersection Observer not supported in this browser');
        // Fallback: immediately show all elements
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            el.classList.add('reveal');
        });
        return;
    }

    // Initialize scroll reveal
    initScrollRevealAnimations();

    // Initialize habitat and stats animations
    initHabitatAnimations();

    // Expose reinitialize hook (used by navigation.js)
    window.reinitializeAnimations = reinitializeAnimations;
}

/**
 * Cleanup animations when needed
 * Useful for preventing memory leaks
 */
function cleanupAnimations() {
    if (window.revealObserver) {
        window.revealObserver.disconnect();
        window.revealObserver = null;
    }
}

/**
 * Initialize habitat items parallax and in-view animations
 */
function initHabitatAnimations() {
    const habitatItems = document.querySelectorAll('.hp-habitat-item');
    const statBoxes = document.querySelectorAll('.hp-stat-box');

    if (!habitatItems.length && !statBoxes.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Continue observing for repeat animations on scroll
            } else {
                // Optional: remove class when out of view for repeat animations
                // entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });

    habitatItems.forEach(item => observer.observe(item));
    statBoxes.forEach(box => observer.observe(box));
}

