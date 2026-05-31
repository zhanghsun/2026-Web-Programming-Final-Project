/**
 * ================================================
 * Mouse Spotlight Effect
 * ================================================
 * Creates a glowing spotlight that follows cursor movement
 * Only active on homepage for enhanced visual experience
 * ================================================
 */

(function() {
    'use strict';

    // Configuration
    const SPOTLIGHT_CONFIG = {
        enabled: true,
        smoothing: 0.15,      // Lower = smoother, higher = snappier
        activateDelay: 300,   // ms to wait before showing spotlight
        fadeInDelay: 200      // ms fade in duration
    };

    // State
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isActive = false;
    let rafId = null;
    let activateTimeout = null;

    // DOM elements
    const spotlight = document.getElementById('mouse-spotlight');
    const homePage = document.getElementById('home-page');

    // Check if spotlight element exists and device supports hover
    if (!spotlight || !window.matchMedia('(hover: hover)').matches) {
        return;
    }

    /**
     * Initialize spotlight effect
     */
    function init() {
        // Only activate on homepage
        const observer = new MutationObserver(() => {
            const isHomeActive = homePage && homePage.classList.contains('active');
            if (isHomeActive && !isActive) {
                activate();
            } else if (!isHomeActive && isActive) {
                deactivate();
            }
        });

        // Observe page changes
        if (homePage) {
            observer.observe(homePage, {
                attributes: true,
                attributeFilter: ['class']
            });

            // Check initial state
            if (homePage.classList.contains('active')) {
                activate();
            }
        }
    }

    /**
     * Activate spotlight effect
     */
    function activate() {
        if (isActive) return;

        // Add delay before showing spotlight
        activateTimeout = setTimeout(() => {
            isActive = true;
            document.body.classList.add('spotlight-active');
            spotlight.classList.add('active');
            
            // Start animation loop
            if (!rafId) {
                animate();
            }
        }, SPOTLIGHT_CONFIG.activateDelay);

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
    }

    /**
     * Deactivate spotlight effect
     */
    function deactivate() {
        if (!isActive) return;

        // Clear activation timeout if still pending
        if (activateTimeout) {
            clearTimeout(activateTimeout);
            activateTimeout = null;
        }

        isActive = false;
        document.body.classList.remove('spotlight-active');
        spotlight.classList.remove('active');

        // Remove event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);

        // Cancel animation frame
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    /**
     * Handle mouse move
     */
    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update CSS custom properties for secondary effects
        document.body.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
        document.body.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    }

    /**
     * Handle mouse leave
     */
    function handleMouseLeave() {
        spotlight.style.opacity = '0';
    }

    /**
     * Animation loop with smooth easing
     */
    function animate() {
        if (!isActive) return;

        // Smooth easing towards target position
        const dx = mouseX - currentX;
        const dy = mouseY - currentY;
        
        currentX += dx * SPOTLIGHT_CONFIG.smoothing;
        currentY += dy * SPOTLIGHT_CONFIG.smoothing;

        // Update spotlight position
        spotlight.style.left = `${currentX}px`;
        spotlight.style.top = `${currentY}px`;

        // Continue animation loop
        rafId = requestAnimationFrame(animate);
    }

    /**
     * Performance optimization: pause when tab is hidden
     */
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        } else if (isActive) {
            animate();
        }
    });

    /**
     * Cleanup on page unload
     */
    window.addEventListener('beforeunload', () => {
        deactivate();
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
