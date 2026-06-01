/**
 * ecosystem-game.js
 * Campus Ecosystem Guardian — Game Engine
 *
 * Requires: ecosystem-game-data.js loaded first (window.GAME_SCENARIOS)
 */
(function () {
    'use strict';

    /* ─────────────────────────────────────────────
       GUARD — wait for data
    ───────────────────────────────────────────── */
    if (!Array.isArray(window.GAME_SCENARIOS) || window.GAME_SCENARIOS.length === 0) {
        console.error('ecosystem-game.js: GAME_SCENARIOS not found. Load ecosystem-game-data.js first.');
        return;
    }

    /* ─────────────────────────────────────────────
       STATE
    ───────────────────────────────────────────── */
    const state = {
        currentChapter: 1,
        totalChapters:  window.GAME_SCENARIOS.length,
        health:         70,
        maxHealth:      100,
        minHealth:      0,
        isAnimating:    false,
        hasChosen:      false,
        choices:        [],   // records chosen key per chapter: ['A','B','C',...]
        deltas:         [],   // records health delta per chapter
    };

    /* ─────────────────────────────────────────────
       DOM REFERENCES
    ───────────────────────────────────────────── */
    const DOM = {
        healthFill:    document.getElementById('healthFill'),
        healthGlow:    document.getElementById('healthGlow'),
        healthNum:     document.getElementById('healthNum'),
        healthMeter:   document.querySelector('.gm-health'),
        chapterLabel:  document.getElementById('chapterLabel'),
        chapterPips:   document.querySelectorAll('.gm-chapter-pip'),

        sceneBg:       document.getElementById('sceneBg'),
        gameScene:     document.getElementById('gameScene'),

        storyCard:     document.getElementById('storyCard'),

        // card content targets
        cardChapterTag:  document.getElementById('cardChapterTag'),
        cardCategory:    document.getElementById('cardCategory'),
        cardTitle:       document.getElementById('cardTitle'),
        cardDesc:        document.getElementById('cardDesc'),
        cardSpeciesList: document.querySelector('#cardSpecies .gm-card__species-list'),
        cardDecisions:   document.getElementById('cardDecisions'),
        cardPrompt:      document.getElementById('cardPrompt'),

        // feedback panel
        feedbackPanel: document.getElementById('feedbackPanel'),
        feedbackIcon:  document.getElementById('feedbackIcon'),
        feedbackTitle: document.getElementById('feedbackTitle'),
        feedbackBody:  document.getElementById('feedbackBody'),
        deltaValue:    document.getElementById('deltaValue'),
        nextBtn:       document.getElementById('nextBtn'),

        // end screen
        endScreen:    document.getElementById('endScreen'),
        ringFill:     document.getElementById('ringFill'),
        endScoreNum:  document.getElementById('endScoreNum'),
        endVerdict:   document.getElementById('endVerdict'),
        restartBtn:   document.getElementById('restartBtn'),
        viewResultsBtn: document.getElementById('viewResultsBtn'),
    };

    /* ─────────────────────────────────────────────
       HEALTH BAR
    ───────────────────────────────────────────── */

    /**
     * Animate health bar to a new value (0–100).
     * @param {number} targetValue
     * @param {number} [duration=800] ms
     */
    function animateHealth(targetValue, duration = 800) {
        const clampedTarget = Math.max(state.minHealth, Math.min(state.maxHealth, targetValue));
        const startValue    = state.health;
        const startTime     = performance.now();

        function tick(now) {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased    = 1 - Math.pow(1 - progress, 3);
            const current  = Math.round(startValue + (clampedTarget - startValue) * eased);

            _applyHealth(current);

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                state.health = clampedTarget;
                _applyHealth(clampedTarget);
            }
        }
        requestAnimationFrame(tick);
    }

    function _applyHealth(value) {
        const pct = value + '%';
        DOM.healthFill.style.width = pct;
        DOM.healthGlow.style.width = pct;
        DOM.healthNum.textContent  = value;
        DOM.healthMeter.setAttribute('aria-valuenow', value);

        // Colour level
        const level = value >= 55 ? 'high' : value >= 30 ? 'medium' : 'low';
        DOM.healthFill.dataset.level = level;
        DOM.healthGlow.style.background = '';   // let CSS data-attr handle fill colour

        // Pulse on critical change
        if (value <= 25) {
            DOM.healthFill.classList.add('gm-health__fill--critical');
        } else {
            DOM.healthFill.classList.remove('gm-health__fill--critical');
        }
    }

    /* ─────────────────────────────────────────────
       CHAPTER PROGRESS PIPS
    ───────────────────────────────────────────── */

    function updateChapterUI(chapter) {
        state.currentChapter = chapter;
        DOM.chapterLabel.textContent = `章節 ${chapter} / ${state.totalChapters}`;

        DOM.chapterPips.forEach((pip, i) => {
            const num = i + 1;
            pip.classList.remove('gm-chapter-pip--done', 'gm-chapter-pip--active');
            if (num < chapter)       pip.classList.add('gm-chapter-pip--done');
            else if (num === chapter) pip.classList.add('gm-chapter-pip--active');
        });
    }

    /* ─────────────────────────────────────────────
       CARD TRANSITIONS
    ───────────────────────────────────────────── */

    /**
     * Animate the story card out, then call `callback`, then animate it back in.
     * direction: 'up' (exit current) | 'right' (next chapter enters from right)
     */
    function transitionCard(callback, direction = 'right') {
        if (state.isAnimating) return;
        state.isAnimating = true;

        // Exit animation
        DOM.storyCard.classList.add('gm-card--exit');

        const DURATION = 450;
        setTimeout(() => {
            DOM.storyCard.classList.remove('gm-card--exit');

            // Update DOM content via callback
            if (typeof callback === 'function') callback();

            // Entrance animation
            const entranceClass = direction === 'right'
                ? 'gm-card--enter-right'
                : 'gm-card__entrance';   // fallback uses CSS default

            DOM.storyCard.classList.add(entranceClass);

            // Clean up after entrance
            const onEnd = () => {
                DOM.storyCard.classList.remove(entranceClass);
                state.isAnimating = false;
                DOM.storyCard.removeEventListener('animationend', onEnd);
            };
            DOM.storyCard.addEventListener('animationend', onEnd, { once: true });

        }, DURATION);
    }

    /* ─────────────────────────────────────────────
       SCENE BACKGROUND TRANSITION
    ───────────────────────────────────────────── */

    /**
     * Swap scene background image with a cross-fade.
     * @param {string} newSrc — path to new image
     */
    function changeSceneBg(newSrc) {
        const img = DOM.sceneBg.querySelector('img');
        if (!img) return;

        DOM.gameScene.classList.add('gm-scene--transitioning');

        setTimeout(() => {
            img.src = newSrc;
            img.onload = () => {
                DOM.gameScene.classList.remove('gm-scene--transitioning');
            };
            // Fallback in case onload doesn't fire (cached images)
            setTimeout(() => DOM.gameScene.classList.remove('gm-scene--transitioning'), 1000);
        }, 600);
    }

    /* ─────────────────────────────────────────────
       RENDER SCENARIO
    ───────────────────────────────────────────── */

    /**
     * Populate the story card with a scenario's data.
     * @param {object} scenario — one entry from GAME_SCENARIOS
     */
    function renderScenario(scenario) {
        DOM.cardChapterTag.textContent = 'CHAPTER ' + scenario.chapter;

        // Category label (preserve the animated dot element)
        DOM.cardCategory.innerHTML =
            '<span class="gm-card__category-dot"></span>' + scenario.category;

        DOM.cardTitle.textContent  = scenario.title;
        DOM.cardDesc.textContent   = scenario.description;
        DOM.cardPrompt.textContent = scenario.prompt || '身為生態顧問，你建議採取哪種措施？';

        // Species chips
        DOM.cardSpeciesList.innerHTML = scenario.species.map(s =>
            `<div class="gm-species-chip gm-species-chip--${s.type}" aria-label="${s.name} ${s.statusLabel}">
                <span class="gm-species-chip__icon" aria-hidden="true">${s.icon}</span>
                <span class="gm-species-chip__name">${s.name}</span>
                <span class="gm-species-chip__status">${s.statusLabel}</span>
            </div>`
        ).join('');

        // Decision buttons — rebuilt in place; event delegation on #cardDecisions persists
        DOM.cardDecisions.innerHTML = scenario.choices.map(c =>
            `<button class="gm-decision gm-decision--${c.key}" data-choice="${c.key}" aria-label="選項 ${c.key}：${c.text}">
                <div class="gm-decision__header">
                    <span class="gm-decision__key" aria-hidden="true">${c.key}</span>
                    <span class="gm-decision__impact gm-decision__impact--${c.impactType}">
                        ${c.impactLabel}
                    </span>
                </div>
                <p class="gm-decision__text">${c.text}</p>
                <div class="gm-decision__shine" aria-hidden="true"></div>
            </button>`
        ).join('');

        // Scene background
        if (scenario.bgImage) changeSceneBg(scenario.bgImage);
    }

    /* ─────────────────────────────────────────────
       DECISION HANDLING — event delegation
    ───────────────────────────────────────────── */

    DOM.cardDecisions.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-choice]');
        if (btn) handleDecision(btn.dataset.choice);
    });

    function handleDecision(choice) {
        if (state.hasChosen || state.isAnimating) return;
        state.hasChosen = true;

        const scenario = window.GAME_SCENARIOS[state.currentChapter - 1];
        const chosen   = scenario && scenario.choices.find(c => c.key === choice);
        if (!chosen) return;

        DOM.cardDecisions.querySelectorAll('[data-choice]').forEach(btn => {
            if (btn.dataset.choice === choice) btn.classList.add('gm-decision--selected');
            else                               btn.classList.add('gm-decision--disabled');
        });

        const newHealth = Math.max(
            state.minHealth,
            Math.min(state.maxHealth, state.health + chosen.feedback.delta)
        );

        // Record this chapter's choice for the results page
        state.choices.push(choice);
        state.deltas.push(chosen.feedback.delta);

        setTimeout(() => showFeedback({
            icon:      chosen.feedback.icon,
            title:     chosen.feedback.title,
            body:      chosen.feedback.body,
            delta:     chosen.feedback.delta,
            newHealth,
        }), 400);
    }

    /* ─────────────────────────────────────────────
       FEEDBACK PANEL
    ───────────────────────────────────────────── */

    function showFeedback({ icon, title, body, delta, newHealth }) {
        DOM.feedbackIcon.textContent  = icon;
        DOM.feedbackTitle.textContent = title;
        DOM.feedbackBody.textContent  = body;

        const deltaEl = DOM.deltaValue;
        deltaEl.textContent = (delta >= 0 ? '+' : '') + delta;
        deltaEl.classList.toggle('positive', delta > 0);

        DOM.feedbackPanel.hidden = false;
        DOM.feedbackPanel.removeAttribute('aria-hidden');

        animateHealth(newHealth);
    }

    function hideFeedback() {
        DOM.feedbackPanel.hidden = true;
        DOM.feedbackPanel.setAttribute('aria-hidden', 'true');
    }

    /* ─────────────────────────────────────────────
       ADVANCE CHAPTER
    ───────────────────────────────────────────── */

    function advanceChapter() {
        hideFeedback();

        const nextChapter = state.currentChapter + 1;

        if (nextChapter > state.totalChapters) {
            showEndScreen();
            return;
        }

        transitionCard(() => {
            updateChapterUI(nextChapter);
            state.hasChosen = false;
            renderScenario(window.GAME_SCENARIOS[nextChapter - 1]);
        });
    }

    /* ─────────────────────────────────────────────
       END SCREEN
    ───────────────────────────────────────────── */

    function showEndScreen() {
        // Save results to sessionStorage for the results page
        try {
            sessionStorage.setItem('eg_results', JSON.stringify({
                score:   state.health,
                choices: state.choices.slice(),
                deltas:  state.deltas.slice(),
            }));
        } catch (e) { /* ignore storage errors */ }

        // Populate end screen content
        DOM.endScoreNum.textContent = state.health;

        // Animate ring fill (circumference = 2π × 50 ≈ 314)
        requestAnimationFrame(() => {
            DOM.ringFill.style.strokeDashoffset =
                Math.round(314 * (1 - state.health / 100));
        });

        // Verdict text based on final health
        DOM.endVerdict.textContent =
            state.health >= 80
                ? '出色！你在每一個關鍵時刻都展現了對自然的深刻理解，讓校園生命更加繁盛。'
            : state.health >= 60
                ? '稱職的生態顧問，在多數決策中找到了人與自然的平衡點。'
            : state.health >= 40
                ? '你開始感受生態兩難的複雜性，每次嘗試都讓理解更深一層。再試一次！'
            : '這次旅程讓生態承受了考驗，但每次嘗試都是寶貴的學習。再試一次吧！';

        // Show the end screen
        DOM.endScreen.hidden = false;
    }

    /* ─────────────────────────────────────────────
       RESTART
    ───────────────────────────────────────────── */

    function restartGame() {
        DOM.endScreen.hidden = true;
        state.health      = 70;
        state.hasChosen   = false;
        state.isAnimating = false;
        state.choices     = [];
        state.deltas      = [];

        _applyHealth(70);
        updateChapterUI(1);

        DOM.storyCard.classList.add('gm-card--enter-right');
        renderScenario(window.GAME_SCENARIOS[0]);
        DOM.storyCard.addEventListener('animationend', () => {
            DOM.storyCard.classList.remove('gm-card--enter-right');
        }, { once: true });
    }

    /* ─────────────────────────────────────────────
       EVENT LISTENERS
    ───────────────────────────────────────────── */

    // Keyboard A / B / C shortcuts
    document.addEventListener('keydown', e => {
        if (state.hasChosen || !DOM.feedbackPanel.hidden) return;
        const key = e.key.toUpperCase();
        if (['A', 'B', 'C'].includes(key)) {
            const btn = DOM.cardDecisions.querySelector(`[data-choice="${key}"]`);
            if (btn) btn.click();
        }
    });

    DOM.nextBtn.addEventListener('click', advanceChapter);
    DOM.restartBtn.addEventListener('click', restartGame);

    DOM.viewResultsBtn.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.style.transition = 'opacity 0.9s ease';
        document.body.style.opacity    = '0';
        setTimeout(() => {
            window.location.href = 'pages/ecosystem-results.html';
        }, 900);
    });

    // Subtle 3-D card tilt (pointer devices only)
    if (window.matchMedia('(hover: hover)').matches) {
        DOM.storyCard.addEventListener('mousemove', e => {
            const rect  = DOM.storyCard.getBoundingClientRect();
            const cx    = rect.left + rect.width  / 2;
            const cy    = rect.top  + rect.height / 2;
            const dx    = (e.clientX - cx) / (rect.width  / 2);
            const dy    = (e.clientY - cy) / (rect.height / 2);
            DOM.storyCard.style.transform =
                `perspective(900px) rotateX(${dy * -4}deg) rotateY(${dx * 5}deg)`;
        });
        DOM.storyCard.addEventListener('mouseleave', () => {
            DOM.storyCard.style.transform = '';
        });
    }

    /* ─────────────────────────────────────────────
       INIT
    ───────────────────────────────────────────── */

    function init() {
        _applyHealth(state.health);
        updateChapterUI(state.currentChapter);
        renderScenario(window.GAME_SCENARIOS[0]);
    }

    init();

    /* ─────────────────────────────────────────────
       PUBLIC API
    ───────────────────────────────────────────── */
    window.EcosystemGame = {
        animateHealth,
        updateChapterUI,
        transitionCard,
        changeSceneBg,
        renderScenario,
        showFeedback,
        hideFeedback,
        showEndScreen,
    };

}());
