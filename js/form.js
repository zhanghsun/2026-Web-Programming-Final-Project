/**
 * Form Module
 * =============
 * Handles form submission and validation.
 * 
 * Responsibilities:
 * - Form validation
 * - Submit to Google Sheets
 * - User feedback handling
 */

/**
 * Validate form data
 * @param {string} name - User name
 * @param {string} type - Feedback type
 * @param {string} message - Message content
 * @returns {boolean} True if valid
 */
function validateFormData(name, type, message) {
    if (!name || name.trim() === '') {
        alert('請輸入您的姓名');
        return false;
    }

    if (!type || type.trim() === '') {
        alert('請選擇回饋類型');
        return false;
    }

    if (!message || message.trim() === '') {
        alert('請輸入詳細內容');
        return false;
    }

    // Check minimum length
    if (message.trim().length < 10) {
        alert('詳細內容至少需要 10 個字元');
        return false;
    }

    return true;
}

/**
 * Submit the join/feedback form
 * @param {Event} event - Form submit event
 */
async function submitJoinForm(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const typeSelect = document.getElementById('type');
    const messageTextarea = document.getElementById('message');
    const submitBtn = event.target.querySelector('.submit-btn');

    if (!nameInput || !typeSelect || !messageTextarea) {
        console.error('Form elements not found');
        alert('表單載入出錯，請重新整理頁面');
        return;
    }

    const name = nameInput.value;
    const type = typeSelect.value;
    const message = messageTextarea.value;

    // Validate form data
    if (!validateFormData(name, type, message)) {
        return;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '送出中...';
    }

    // Google Sheets API URL
    // Note: Replace with your actual Google Sheets API endpoint
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyyRxo3uNj0q3bYifVNR5q1aCm_IzJ0PsMD2WmfJYw27W6TwG-4R7jMNpl0gp1JthrC6A/exec';

    try {
        // Prepare data
        const data = new URLSearchParams();
        data.append('name', name);
        data.append('type', type);
        data.append('message', message);
        data.append('timestamp', new Date().toLocaleString('zh-TW'));

        // Send request
        const response = await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: data
        });

        // Show success message
        alert('感謝您的回饋，我們已收到資料！');

        // Reset form
        event.target.reset();
        nameInput.focus();

        // Navigate to home page
        showPage('home');

    } catch (error) {
        console.error('Form submission error:', error);
        alert('送出失敗，請檢查網路連線或稍後重試。');
    } finally {
        // Restore button state
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '送出回饋';
        }
    }
}

/**
 * Initialize form module
 * Sets up form event listeners and validation
 */
function initForm() {
    const form = document.querySelector('.form-container form');
    if (!form) return;
    form.addEventListener('submit', submitJoinForm);
}
