/**
 * Resources Module
 * ==================
 * Handles the ecological exploration gateway cards.
 * Each card opens the resource info modal via showResource() (modal.js).
 */

function initResources() {
    setupGatewayCards();
}

/**
 * Bind click & keyboard events to the three .res-card gateway cards.
 */
function setupGatewayCards() {
    document.querySelectorAll('.res-card[data-resource-title]').forEach(card => {
        card.addEventListener('click', function () {
            const title = this.getAttribute('data-resource-title');
            const text  = this.getAttribute('data-resource-text');
            if (title && text && typeof showResource === 'function') {
                showResource(title, text);
            }
        });

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

