/**
 * animals.js — Campus Wildlife Explorer
 * ======================================
 * Handles: card generation, group filter, species drawer, LocalStorage progress.
 * Depends on: speciesData (species-data.js)
 */

(function () {
    'use strict';

    // -----------------------------------------------------------------------
    // Constants
    // -----------------------------------------------------------------------
    const STORAGE_KEY = 'ncu-wildlife-discovered';
    const TOTAL = 17;

    const GROUP_META = {
        all:    { label: '全部',       emoji: '🌿' },
        forest: { label: '森林住民',   emoji: '🌿' },
        sky:    { label: '天空守衛',   emoji: '🦅' },
        night:  { label: '夜行者',     emoji: '🌙' },
        ground: { label: '地面探索者', emoji: '🐾' },
        icon:   { label: '校園代表',   emoji: '⭐' },
        urban:  { label: '城市倖存者', emoji: '🏙️' },
    };

    // -----------------------------------------------------------------------
    // State
    // -----------------------------------------------------------------------
    let currentFilter = 'all';
    let discovered    = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

    // -----------------------------------------------------------------------
    // DOM refs (populated after DOMContentLoaded)
    // -----------------------------------------------------------------------
    let grid, visibleCountEl, progressFill, progressLabel;

    // -----------------------------------------------------------------------
    // Utility helpers
    // -----------------------------------------------------------------------
    function stars(n, max) {
        let html = '';
        for (let i = 1; i <= max; i++) {
            html += `<span class="aw-card__star ${i <= n ? 'lit' : ''}">★</span>`;
        }
        return html;
    }

    function saveDiscovered() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...discovered]));
    }

    // -----------------------------------------------------------------------
    // Build cards
    // -----------------------------------------------------------------------
    function buildCards() {
        const animalKeys = Object.entries(speciesData)
            .filter(([, v]) => v.category === 'animal')
            .map(([k]) => k);

        grid.innerHTML = '';

        animalKeys.forEach(key => {
            const sp = speciesData[key];
            if (!sp || sp.category !== 'animal') return;

            const card = document.createElement('article');
            card.className = 'aw-card' + (discovered.has(key) ? ' discovered' : '');
            card.dataset.key    = key;
            card.dataset.group  = sp.group || 'ground';
            card.dataset.groups = (sp.groups || [sp.group]).join(' ');

            const photoSrc = sp.avatar || (sp.photos && sp.photos[0]) || '';

            card.innerHTML = `
                <div class="aw-card__photo-wrap">
                    <img class="aw-card__photo" src="${photoSrc}" alt="${sp.name}" loading="lazy">
                    <div class="aw-card__photo-overlay"></div>
                    <span class="aw-card__group-badge">${GROUP_META[sp.group]?.emoji || ''} ${GROUP_META[sp.group]?.label || ''}</span>
                    <span class="aw-card__discovered-badge" title="已探索">✓</span>
                    <div class="aw-card__character">${sp.characterTitle || ''}</div>
                </div>
                <div class="aw-card__body">
                    <div class="aw-card__names">
                        <div class="aw-card__name-zh">${sp.name}</div>
                        <div class="aw-card__name-en">${sp.englishName || ''}</div>
                    </div>
                    <div class="aw-card__meta">
                        <div class="aw-card__stars">${stars(sp.commonness || 3, 5)}</div>
                        <span class="aw-card__activity">${sp.activityTime || ''}</span>
                    </div>
                </div>`;

            card.addEventListener('click', () => { window.location.href = 'pages/species.html?key=' + key; });
            grid.appendChild(card);
        });

        updateVisibleCount();
    }

    // -----------------------------------------------------------------------
    // Filter logic
    // -----------------------------------------------------------------------
    function applyFilter(group) {
        currentFilter = group;

        document.querySelectorAll('.aw-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.group === group);
        });

        let visible = 0;
        document.querySelectorAll('.aw-card').forEach(card => {
            const groups = card.dataset.groups ? card.dataset.groups.split(' ') : [card.dataset.group];
            const show = group === 'all' || groups.includes(group);
            card.classList.toggle('hidden', !show);
            if (show) visible++;
        });

        updateVisibleCount(visible);
        checkEmpty(visible);
    }

    function updateVisibleCount(count) {
        if (!visibleCountEl) return;
        if (count === undefined) {
            count = document.querySelectorAll('.aw-card:not(.hidden)').length;
        }
        visibleCountEl.textContent = `共 ${count} 種`;
    }

    function checkEmpty(visible) {
        const empty = document.getElementById('awEmpty');
        if (!empty) return;
        empty.classList.toggle('visible', visible === 0);
    }

    // -----------------------------------------------------------------------
    // (Drawer removed — cards now navigate to pages/species.html)
    // -----------------------------------------------------------------------
    function _drawerRemoved_openDrawer(key) {
        const sp = speciesData[key];
        if (!sp) return;
        currentKey = key;

        // Mark discovered
        if (!discovered.has(key)) {
            discovered.add(key);
            saveDiscovered();
            const card = grid.querySelector(`[data-key="${key}"]`);
            if (card) card.classList.add('discovered');
            updateProgress();
        }

        // Populate drawer
        populateDrawer(key, sp);

        // Open
        drawer.dataset.group = sp.group || 'ground';
        drawer.classList.add('open');
        backdrop.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        backdrop.classList.remove('visible');
        document.body.style.overflow = '';
        currentKey = null;
    }

    function populateDrawer(key, sp) {
        const photos = sp.photos || (sp.avatar ? [sp.avatar] : []);
        const photo0 = photos[0] || '';

        // Build thumb HTML
        const thumbsHtml = photos.map((p, i) => `
            <button class="aw-drawer__thumb ${i === 0 ? 'active' : ''}" data-index="${i}" title="照片 ${i+1}">
                <img src="${p}" alt="照片${i+1}" loading="lazy">
            </button>`).join('');

        // Build drawer HTML
        drawer.innerHTML = `
            <div class="aw-drawer__hero">
                <img class="aw-drawer__hero-img" id="drawerMainPhoto" src="${photo0}" alt="${sp.name}">
                <div class="aw-drawer__hero-overlay"></div>
                <button class="aw-drawer__close" id="drawerClose" aria-label="關閉">✕</button>
                <div class="aw-drawer__thumbs">${thumbsHtml}</div>
            </div>
            <div class="aw-drawer__content">
                <div class="aw-drawer__header">
                    <div class="aw-drawer__group-pill">
                        ${GROUP_META[sp.group]?.emoji || ''} ${GROUP_META[sp.group]?.label || ''}
                    </div>
                    <h2 class="aw-drawer__name-zh">${sp.name}</h2>
                    <div class="aw-drawer__name-en">${sp.englishName || ''}</div>
                    <div class="aw-drawer__scientific">${sp.scientific || ''}</div>
                    ${sp.characterTitle ? `<div class="aw-drawer__character">「${sp.characterTitle}」</div>` : ''}
                </div>

                <div class="aw-drawer__stats">
                    <div class="aw-drawer__stat">
                        <div class="aw-drawer__stat-label">常見度</div>
                        <div class="aw-drawer__stat-value">
                            <div class="aw-drawer__stars">${drawerStars(sp.commonness || 3, 5)}</div>
                        </div>
                    </div>
                    <div class="aw-drawer__stat">
                        <div class="aw-drawer__stat-label">觀察難度</div>
                        <div class="aw-drawer__stat-value">
                            <div class="aw-drawer__stars">${drawerStars(sp.difficulty || 3, 5)}</div>
                        </div>
                    </div>
                    <div class="aw-drawer__stat">
                        <div class="aw-drawer__stat-label">活動時間</div>
                        <div class="aw-drawer__stat-value">${sp.activityTime || '—'}</div>
                    </div>
                    <div class="aw-drawer__stat">
                        <div class="aw-drawer__stat-label">分類</div>
                        <div class="aw-drawer__stat-value" style="font-size:.75rem;line-height:1.4;">${(sp.classification || '').split('／')[0]}</div>
                    </div>
                </div>

                ${sp.story ? `
                <div class="aw-drawer__section">
                    <div class="aw-drawer__section-title">生態故事</div>
                    <p class="aw-drawer__story">${sp.story}</p>
                </div>` : ''}

                ${sp.idClues && sp.idClues.length ? `
                <div class="aw-drawer__section">
                    <div class="aw-drawer__section-title">如何辨認</div>
                    <ul class="aw-drawer__id-clues">
                        ${sp.idClues.map(c => `<li class="aw-drawer__id-clue">${c}</li>`).join('')}
                    </ul>
                </div>` : ''}

                ${sp.hotspot ? `
                <div class="aw-drawer__section">
                    <div class="aw-drawer__section-title">校園熱點</div>
                    <div class="aw-drawer__hotspot">
                        <span class="aw-drawer__hotspot-icon">📍</span>
                        <span>${sp.hotspot}</span>
                    </div>
                </div>` : ''}

                ${sp.dist ? `
                <div class="aw-drawer__section">
                    <div class="aw-drawer__section-title">分布資訊</div>
                    <div class="aw-drawer__dist">${sp.dist}</div>
                </div>` : ''}

                ${sp.conservation ? `
                <div class="aw-drawer__section">
                    <div class="aw-drawer__section-title">保育行動</div>
                    <div class="aw-drawer__conservation">${sp.conservation}</div>
                </div>` : ''}

                <button class="aw-drawer__discover-btn ${discovered.has(key) ? 'discovered-state' : ''}" id="drawerDiscoverBtn">
                    ${discovered.has(key) ? '✓ 已探索' : '標記為已探索'}
                </button>
            </div>`;

        // Bind close
        drawer.querySelector('#drawerClose').addEventListener('click', closeDrawer);

        // Bind photo thumbs
        drawer.querySelectorAll('.aw-drawer__thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const idx = parseInt(thumb.dataset.index, 10);
                const img = drawer.querySelector('#drawerMainPhoto');
                if (img && photos[idx]) {
                    img.src = photos[idx];
                    drawer.querySelectorAll('.aw-drawer__thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                }
            });
        });

        // Bind discover button
        const discoverBtn = drawer.querySelector('#drawerDiscoverBtn');
        if (discoverBtn) {
            discoverBtn.addEventListener('click', () => {
                if (!discovered.has(key)) {
                    discovered.add(key);
                    saveDiscovered();
                    const card = grid.querySelector(`[data-key="${key}"]`);
                    if (card) card.classList.add('discovered');
                    updateProgress();
                }
                discoverBtn.textContent = '✓ 已探索';
                discoverBtn.classList.add('discovered-state');
            });
        }

        // Scroll to top of drawer
        drawer.scrollTop = 0;
    }

    // -----------------------------------------------------------------------
    // Progress
    // -----------------------------------------------------------------------
    function updateProgress() {
        const count = discovered.size;
        const pct   = (count / TOTAL) * 100;

        if (progressFill)  progressFill.style.width  = pct + '%';
        if (progressLabel) {
            const b = progressLabel.querySelector('b');
            if (b) b.textContent = count;
        }

        // Update nav pill
        const pill = document.querySelector('.aw-nav__progress-pill b');
        if (pill) pill.textContent = count;
    }

    // -----------------------------------------------------------------------
    // Init
    // -----------------------------------------------------------------------
    function init() {
        grid           = document.getElementById('awGrid');
        progressFill   = document.getElementById('awProgressFill');
        progressLabel  = document.getElementById('awProgressLabel');
        visibleCountEl = document.getElementById('awVisibleCount');

        if (!grid) return;

        buildCards();
        updateProgress();

        // Filter chip listeners
        document.querySelectorAll('.aw-chip').forEach(chip => {
            chip.addEventListener('click', () => applyFilter(chip.dataset.group));
        });

        // Hero parallax on scroll
        const heroBg = document.querySelector('.aw-hero__bg');
        if (heroBg) {
            window.addEventListener('scroll', () => {
                const y = window.scrollY;
                heroBg.style.transform = `scale(1.05) translateY(${y * 0.25}px)`;
            }, { passive: true });
        }

        // Trigger hero load animation
        requestAnimationFrame(() => {
            const hero = document.querySelector('.aw-hero');
            if (hero) hero.classList.add('loaded');
        });
    }

    document.addEventListener('DOMContentLoaded', init);

})();
