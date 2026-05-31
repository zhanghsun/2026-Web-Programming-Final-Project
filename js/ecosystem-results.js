/**
 * ecosystem-results.js
 * Campus Ecosystem Guardian — Results Page Logic
 *
 * Reads sessionStorage 'eg_results' set by ecosystem-game.js,
 * then animates the score ring, renders guardian title,
 * species impact cards, and the decision timeline.
 *
 * Requires: ecosystem-game-data.js (window.GAME_SCENARIOS)
 */
(function () {
    'use strict';

    /* ──────────────────────────────────────────────────
       GUARDIAN TIER DEFINITIONS
    ────────────────────────────────────────────────── */
    const TIERS = [
        {
            min: 90,
            emoji: '👑',
            title: 'NCU Ecosystem Master',
            cssClass: 'er-tier-badge--master',
            ringClass: 'er-ring__fill--gold',
            flavor: '你在每一個關鍵時刻都展現出卓越的生態智慧，以兼顧自然與人文的眼光守護了校園生態系統。中央大學的每一棵樹、每一隻鳥，都因你而更加繁盛。這不只是一場遊戲的勝利，更是對真實自然的深刻理解。',
        },
        {
            min: 70,
            emoji: '🌿',
            title: 'Campus Guardian',
            cssClass: 'er-tier-badge--guardian',
            ringClass: '',
            flavor: '你在複雜的取捨中找到了自然與現實的平衡點，用智慧和行動撐起了校園生態的一片綠。大多數時候，你選擇了聆聽生態的聲音，讓校園的食物鏈與棲地維持在一個更健康的狀態。',
        },
        {
            min: 50,
            emoji: '🌱',
            title: 'Nature Observer',
            cssClass: 'er-tier-badge--observer',
            ringClass: 'er-ring__fill--teal',
            flavor: '你開始理解每一個決策背後的生態影響，踏上了守護自然的旅途。雖然有些選擇讓生態承受了壓力，但這些經歷是認識校園生命最寶貴的課程。繼續前進，自然需要你。',
        },
        {
            min: 0,
            emoji: '📚',
            title: 'Explorer in Training',
            cssClass: 'er-tier-badge--explorer',
            ringClass: 'er-ring__fill--blue',
            flavor: '校園生態系統面臨了嚴峻考驗。但這場旅程最珍貴的地方，在於它讓我們看見了那些平常被忽略的生命——水邊的鷺鷥、樹梢的藍鵲、草叢裡的攀蜥。帶著這些認識，再試一次吧。',
        },
    ];

    /* ──────────────────────────────────────────────────
       SPECIES OUTCOMES MAP
       Key format: '{chapter}-{choice}'
       Each entry: array of species that BENEFITED
    ────────────────────────────────────────────────── */
    const SPECIES_OUTCOMES = {
        /* Chapter 1 — 湖岸草澤棲地整治 */
        '1-A': [],
        '1-B': [
            {
                name: '黑冠麻鷺',
                img: 'assets/images/species/黑冠麻鷺/黑冠麻鷺1.jpg',
                category: '留鳥',
                note: '蘆葦棲地保留，繁殖順利',
            },
            {
                name: '澤蛙',
                img: 'assets/images/species/澤蛙/澤蛙1.jpg',
                category: '兩棲類',
                note: '淺水繁殖場完好無損',
            },
            {
                name: '霜白蜻蜓',
                img: 'assets/images/species/霜白蜻蜓/霜白蜻蜓1.jpg',
                category: '昆蟲',
                note: '水域產卵環境未受破壞',
            },
        ],
        '1-C': [
            {
                name: '黑冠麻鷺',
                img: 'assets/images/species/黑冠麻鷺/黑冠麻鷺1.jpg',
                category: '留鳥',
                note: '棲地暫獲保護，等待評估期間繁殖如常',
            },
        ],

        /* Chapter 2 — 百年老榕修剪爭議 */
        '2-A': [],
        '2-B': [
            {
                name: '臺灣藍鵲',
                img: 'assets/images/species/臺灣藍鵲/台灣藍鵲1.jpg',
                category: '野鳥',
                note: '百年榕樹保留，巢位延續世代',
            },
            {
                name: '赤腹松鼠',
                img: 'assets/images/species/赤腹松鼠/赤腹松鼠1.jpg',
                category: '哺乳類',
                note: '老樹棲地維持，覓食無礙',
            },
            {
                name: '大卷尾',
                img: 'assets/images/species/大卷尾/大卷尾1.jpg',
                category: '野鳥',
                note: '樹冠領域未受干擾，繁殖成功',
            },
            {
                name: '榕樹',
                img: 'assets/images/plants/榕樹/榕樹1.jpg',
                category: '百年老樹',
                note: '百年老樹獲救，繼續庇蔭校園',
            },
        ],
        '2-C': [
            {
                name: '臺灣藍鵲',
                img: 'assets/images/species/臺灣藍鵲/台灣藍鵲1.jpg',
                category: '野鳥',
                note: '專業評估期間棲地受保護',
            },
            {
                name: '赤腹松鼠',
                img: 'assets/images/species/赤腹松鼠/赤腹松鼠1.jpg',
                category: '哺乳類',
                note: '樹木保留，棲地維持穩定',
            },
        ],

        /* Chapter 3 — 校園蚊蟲季節管理 */
        '3-A': [],
        '3-B': [
            {
                name: '霜白蜻蜓',
                img: 'assets/images/species/霜白蜻蜓/霜白蜻蜓1.jpg',
                category: '昆蟲',
                note: '繁殖高峰未受殺蟲劑影響',
            },
            {
                name: '澤蛙',
                img: 'assets/images/species/澤蛙/澤蛙1.jpg',
                category: '兩棲類',
                note: '天然防蚊功能獲重視，族群穩定',
            },
            {
                name: '黑冠麻鷺',
                img: 'assets/images/species/黑冠麻鷺/黑冠麻鷺1.jpg',
                category: '留鳥',
                note: '食物鏈完整，獵食無虞',
            },
        ],
        '3-C': [
            {
                name: '澤蛙',
                img: 'assets/images/species/澤蛙/澤蛙1.jpg',
                category: '兩棲類',
                note: '科學評估保護了天然防蚊系統',
            },
            {
                name: '霜白蜻蜓',
                img: 'assets/images/species/霜白蜻蜓/霜白蜻蜓1.jpg',
                category: '昆蟲',
                note: '族群高峰期未受干擾，繁殖如常',
            },
        ],

        /* Chapter 4 — 生態敏感區校舍擴建 */
        '4-A': [],
        '4-B': [
            {
                name: '斯文豪氏攀蜥',
                img: 'assets/images/species/斯文豪氏攀蜥/斯文豪氏攀蜥1.jpg',
                category: '爬蟲類',
                note: '棲地灌木叢獲保留，領域未受侵擾',
            },
            {
                name: '草花蛇',
                img: 'assets/images/species/草花蛇/草花蛇1.jpg',
                category: '爬蟲類',
                note: '草地棲地部分保存，族群延續',
            },
        ],
        '4-C': [
            {
                name: '斯文豪氏攀蜥',
                img: 'assets/images/species/斯文豪氏攀蜥/斯文豪氏攀蜥1.jpg',
                category: '爬蟲類',
                note: '棲地未受工程影響，完整保存',
            },
            {
                name: '草花蛇',
                img: 'assets/images/species/草花蛇/草花蛇1.jpg',
                category: '爬蟲類',
                note: '草地棲地完整，食物鏈健全',
            },
            {
                name: '松雀鷹',
                img: 'assets/images/species/松雀鷹/松雀鳥1.jpg',
                category: '猛禽',
                note: '棲息緩衝帶受到充分保護',
            },
        ],

        /* Chapter 5 — 野鴿群聚管理爭議 */
        '5-A': [],
        '5-B': [
            {
                name: '野鴿',
                img: 'assets/images/species/野鴿/野鴿1.jpg',
                category: '野鳥',
                note: '族群以人道方式管理，與校園和諧共存',
            },
            {
                name: '鳳頭蒼鷹',
                img: 'assets/images/species/鳳頭蒼鷹/鳳頭蒼鷹1.jpg',
                category: '猛禽',
                note: '築巢行為未受干擾，育雛成功',
            },
        ],
        '5-C': [
            {
                name: '鳳頭蒼鷹',
                img: 'assets/images/species/鳳頭蒼鷹/鳳頭蒼鷹1.jpg',
                category: '猛禽',
                note: '棲架提供新獵場，族群趨於穩定',
            },
            {
                name: '松雀鷹',
                img: 'assets/images/species/松雀鷹/松雀鳥1.jpg',
                category: '猛禽',
                note: '棲架成為固定狩獵瞭望台',
            },
        ],
    };

    /* ──────────────────────────────────────────────────
       CHAPTER METADATA (titles for timeline)
    ────────────────────────────────────────────────── */
    const CHAPTER_META = [
        { title: '湖岸草澤棲地整治',   category: '棲地管理' },
        { title: '百年老榕修剪爭議',   category: '老樹保育' },
        { title: '校園蚊蟲季節管理',   category: '蟲害防治' },
        { title: '生態敏感區校舍擴建', category: '校園開發' },
        { title: '野鴿群聚管理爭議',   category: '外來物種' },
    ];

    /* ──────────────────────────────────────────────────
       LOAD RESULTS FROM sessionStorage
    ────────────────────────────────────────────────── */
    let results = null;
    try {
        const raw = sessionStorage.getItem('eg_results');
        if (raw) results = JSON.parse(raw);
    } catch (e) { /* ignore */ }

    /* Demo/fallback — show something even if navigated directly */
    if (!results || !Array.isArray(results.choices)) {
        results = {
            score: 72,
            choices: ['B', 'B', 'C', 'B', 'C'],
            deltas:  [10, 12, 2, 8, 11],
        };
    }

    const { score, choices, deltas } = results;

    /* ──────────────────────────────────────────────────
       DETERMINE TIER
    ────────────────────────────────────────────────── */
    const tier = TIERS.find(t => score >= t.min) || TIERS[TIERS.length - 1];

    /* ──────────────────────────────────────────────────
       COLLECT BENEFITED SPECIES (deduplicated)
    ────────────────────────────────────────────────── */
    const seen = new Set();
    const benefitedSpecies = [];

    choices.forEach((choice, idx) => {
        const key = `${idx + 1}-${choice}`;
        const list = SPECIES_OUTCOMES[key] || [];
        list.forEach(sp => {
            if (!seen.has(sp.name)) {
                seen.add(sp.name);
                benefitedSpecies.push(sp);
            }
        });
    });

    /* ──────────────────────────────────────────────────
       DOM REFERENCES
    ────────────────────────────────────────────────── */
    const scoreRingEl  = document.getElementById('scoreRing');
    const scoreNumEl   = document.getElementById('scoreNum');
    const tierBadgeEl  = document.getElementById('tierBadge');
    const tierEmojiEl  = document.getElementById('tierEmoji');
    const tierNameEl   = document.getElementById('tierName');
    const heroFlavorEl = document.getElementById('heroFlavor');
    const speciesGrid  = document.getElementById('speciesGrid');
    const speciesEmpty = document.getElementById('speciesEmpty');
    const speciesDesc  = document.getElementById('speciesDesc');
    const timeline     = document.getElementById('journeyTimeline');

    /* ──────────────────────────────────────────────────
       APPLY TIER STYLING
    ────────────────────────────────────────────────── */
    tierBadgeEl.classList.add(tier.cssClass);
    if (tier.ringClass) scoreRingEl.classList.add(tier.ringClass);
    tierEmojiEl.textContent = tier.emoji;
    tierNameEl.textContent  = tier.title;
    heroFlavorEl.textContent = tier.flavor;

    /* ──────────────────────────────────────────────────
       ANIMATE SCORE RING
       CIRCUMFERENCE = 2π × r = 2π × 96 ≈ 603
       (desktop; mobile overrides via CSS media queries
        adjust the dasharray, but we keep the ratio)
    ────────────────────────────────────────────────── */
    const CIRCUMFERENCE = 603;

    function animateRing() {
        const offset = CIRCUMFERENCE * (1 - score / 100);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scoreRingEl.style.strokeDashoffset = offset;
            });
        });
    }

    /* ──────────────────────────────────────────────────
       COUNT-UP SCORE NUMBER
    ────────────────────────────────────────────────── */
    function countUp(el, target, duration) {
        const start     = performance.now();
        const startVal  = 0;

        function step(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(startVal + (target - startVal) * eased);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    /* ──────────────────────────────────────────────────
       RENDER SPECIES GRID
    ────────────────────────────────────────────────── */
    function renderSpecies() {
        if (benefitedSpecies.length === 0) {
            speciesGrid.hidden = true;
            speciesEmpty.hidden = false;
            speciesDesc.textContent = '這一次的旅程讓生態系統承受了衝擊，再試一次讓更多生命因你而守護。';
            return;
        }

        speciesGrid.innerHTML = benefitedSpecies.map(sp => `
            <div class="er-sp-card er-hidden" role="article" aria-label="${sp.name}">
                <img class="er-sp-card__photo"
                     src="${sp.img}"
                     alt="${sp.name}"
                     loading="lazy"
                     onerror="this.style.display='none'" />
                <div class="er-sp-card__overlay" aria-hidden="true"></div>
                <span class="er-sp-card__badge" aria-hidden="true">受保護</span>
                <div class="er-sp-card__body">
                    <span class="er-sp-card__category">${sp.category}</span>
                    <div class="er-sp-card__name">${sp.name}</div>
                    <div class="er-sp-card__note">${sp.note}</div>
                </div>
            </div>
        `).join('');
    }

    /* ──────────────────────────────────────────────────
       RENDER JOURNEY TIMELINE
    ────────────────────────────────────────────────── */
    function renderTimeline() {
        // Try to get delta values; fall back to looking up from GAME_SCENARIOS
        const scenarios = window.GAME_SCENARIOS || [];

        timeline.innerHTML = choices.map((choice, idx) => {
            const meta    = CHAPTER_META[idx] || { title: `Chapter ${idx + 1}`, category: '' };
            let delta     = (deltas && deltas[idx] !== undefined) ? deltas[idx] : null;

            // If deltas not stored, derive from GAME_SCENARIOS
            if (delta === null && scenarios[idx]) {
                const choiceObj = scenarios[idx].choices.find(c => c.key === choice);
                if (choiceObj) delta = choiceObj.feedback.delta;
            }

            const isPos  = delta !== null && delta > 0;
            const isNeg  = delta !== null && delta < 0;
            const dirCls = isPos ? 'er-timeline-step--positive'
                         : isNeg ? 'er-timeline-step--negative'
                         :         'er-timeline-step--neutral';

            const deltaStr = delta !== null
                ? (delta >= 0 ? `+${delta}` : `${delta}`)
                : '±0';

            // Get choice text from GAME_SCENARIOS if available
            let choiceText = `選擇了方案 ${choice}`;
            if (scenarios[idx]) {
                const choiceObj = scenarios[idx].choices.find(c => c.key === choice);
                if (choiceObj) choiceText = choiceObj.text;
            }

            return `
                <div class="er-timeline-step ${dirCls} er-hidden" role="listitem">
                    <div class="er-timeline-step__dot" aria-hidden="true">
                        ${String(idx + 1).padStart(2, '0')}
                    </div>
                    <div class="er-timeline-step__body">
                        <div class="er-timeline-step__chapter">${meta.category} · CHAPTER ${idx + 1}</div>
                        <div class="er-timeline-step__title">${meta.title}</div>
                        <div class="er-timeline-step__choice">方案 ${choice}：${choiceText}</div>
                        <span class="er-timeline-step__delta" aria-label="健康值變化 ${deltaStr}">
                            ${isPos ? '▲' : isNeg ? '▼' : '—'} ${deltaStr}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ──────────────────────────────────────────────────
       INTERSECTION OBSERVER — scroll reveal
    ────────────────────────────────────────────────── */
    function initScrollReveal() {
        const targets = document.querySelectorAll('.er-hidden');
        if (!targets.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.remove('er-hidden');
                    el.classList.add('er-visible');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(el => observer.observe(el));
    }

    /* ──────────────────────────────────────────────────
       INIT — sequence animations after page load
    ────────────────────────────────────────────────── */
    function init() {
        renderSpecies();
        renderTimeline();

        // Trigger ring + count-up after short delay (let CSS transitions settle)
        setTimeout(() => {
            animateRing();
            countUp(scoreNumEl, score, 1800);
        }, 300);

        // Scroll reveal with slight delay to allow DOM to paint
        setTimeout(initScrollReveal, 600);
    }

    // Wait for GAME_SCENARIOS to be available (loaded via defer)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
