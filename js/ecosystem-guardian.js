/**
 * ecosystem-guardian.js
 * Campus Ecosystem Guardian — Landing Page Interactions
 */

(function () {
    'use strict';

    /* ── Scroll Reveal ── */
    function initScrollReveal() {
        const targets = document.querySelectorAll(
            '.eg-card, .eg-sdg-card, .eg-story__inner, .eg-section-title, .eg-section-desc'
        );

        targets.forEach(el => el.classList.add('eg-reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger sibling elements
                    const siblings = entry.target.closest('.eg-cards, .eg-sdg__grid');
                    if (siblings) {
                        const index = Array.from(siblings.children).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 90}ms`;
                    }
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        targets.forEach(el => observer.observe(el));
    }

    /* ── Nav background on scroll ── */
    function initNavScroll() {
        const nav = document.querySelector('.eg-nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            nav.style.background = window.scrollY > 40
                ? 'rgba(3, 10, 5, 0.96)'
                : 'rgba(5, 15, 7, 0.88)';
        }, { passive: true });
    }

    /* ── Smooth scroll for anchor links ── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const target = document.querySelector(a.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    /* ── Card hover tilt effect ── */
    function initCardTilt() {
        document.querySelectorAll('.eg-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top)  / rect.height - 0.5;
                card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ── Init ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initScrollReveal();
            initNavScroll();
            initSmoothScroll();
            initCardTilt();
        });
    } else {
        initScrollReveal();
        initNavScroll();
        initSmoothScroll();
        initCardTilt();
    }
})();
