/**
 * Resources Module
 * ==================
 * Handles resource center functionality including role management
 * and resource modal display.
 * 
 * Responsibilities:
 * - Role-based content filtering
 * - Resource modal interactions
 * - Resource card management
 */

/**
 * Initialize resources module
 * Sets up event listeners and initial state
 */
function initResources() {
    // Role buttons
    document.querySelectorAll('.role-btn[data-role]').forEach(btn => {
        btn.addEventListener('click', function () {
            const role = this.getAttribute('data-role');
            if (role) switchRole(role, this);
        });
    });

    setupActionButtons();
}

/**
 * Setup action button interactions
 * Adds hover effects and click handlers
 */
function setupActionButtons() {
    const actionButtons = document.querySelectorAll('.action-button[data-resource-title][data-resource-text]');

    actionButtons.forEach(button => {

        button.addEventListener('click', function () {
            const title = this.getAttribute('data-resource-title');
            const text = this.getAttribute('data-resource-text');
            if (title && text) showResource(title, text);
        });

        // Accessibility: keyboard navigation
        button.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Get resources for a specific role
 * @param {string} role - The role (student, teacher, database)
 * @returns {HTMLElement} The role info container
 */
function getResourcesByRole(role) {
    return document.getElementById(role + '-info');
}

/**
 * Validate resource data
 * @param {string} title - Resource title
 * @param {string} text - Resource text
 * @returns {boolean} True if valid, false otherwise
 */
function validateResource(title, text) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
        console.warn('Invalid resource title');
        return false;
    }

    if (!text || typeof text !== 'string' || text.trim() === '') {
        console.warn('Invalid resource text');
        return false;
    }

    return true;
}

/**
 * Display resource details
 * Enhanced version of showResource with validation
 * @param {string} title - Resource title
 * @param {string} text - Resource description
 */
function displayResource(title, text) {
    if (!validateResource(title, text)) return;
    showResource(title, text);
}
