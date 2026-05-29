/**
 * species-page.js — Wildlife Character Detail Page
 * ==================================================
 * Reads ?key=barbet from URL, populates all 9 sections
 * from speciesData (species-data.js).
 */

(function () {
    'use strict';

    // -----------------------------------------------------------------------
    // Constants
    // -----------------------------------------------------------------------
    const STORAGE_KEY = 'ncu-wildlife-discovered';

    const GROUP_META = {
        forest: { label: '森林住民',   emoji: '🌲', color: '#52b788', rgb: '82,183,136' },
        sky:    { label: '天空守衛',   emoji: '🦅', color: '#74b3ce', rgb: '116,179,206' },
        night:  { label: '夜行者',     emoji: '🌙', color: '#6b7fb6', rgb: '107,127,182' },
        ground: { label: '地面探索者', emoji: '🐾', color: '#c4956a', rgb: '196,149,106' },
        icon:   { label: '校園代表',   emoji: '⭐', color: '#d4a843', rgb: '212,168,67' },
        urban:  { label: '城市倖存者', emoji: '🏙️', color: '#9ba8b5', rgb: '155,168,181' },
    };

    const SECTIONS = [
        { id: 'sp-hero',       label: '簡介' },
        { id: 'sp-gallery',    label: '照片' },
        { id: 'sp-detective',  label: '辨認' },
        { id: 'sp-story',      label: '故事' },
        { id: 'sp-locations',  label: '熱點' },
        { id: 'sp-profile',    label: '檔案' },
        { id: 'sp-challenges', label: '威脅' },
        { id: 'sp-actions',    label: '保育' },
        { id: 'sp-related',    label: '相關' },
    ];

    // -----------------------------------------------------------------------
    // State
    // -----------------------------------------------------------------------
    let currentPhotoIndex = 0;
    let photos = [];

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------
    function getKey() {
        return new URLSearchParams(window.location.search).get('key');
    }

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function setHtml(id, html) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }

    // Parse HTML <ul><li><strong>Title:</strong> desc</li>...</ul>
    function parseHtmlList(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        return Array.from(div.querySelectorAll('li')).map(function (li) {
            var strong = li.querySelector('strong');
            var title = strong ? strong.textContent.replace(/[：:]\s*$/, '') : '';
            var desc = li.textContent
                .replace(strong ? strong.textContent : '', '')
                .replace(/^[：:]\s*/, '')
                .trim();
            return { title: title, desc: desc };
        });
    }

    function difficultyStars(d) {
        var filled = d || 3;
        var s = '';
        for (var i = 1; i <= 5; i++) {
            s += '<span style="opacity:' + (i <= filled ? '1' : '.2') + ';color:#fbbf24">★</span>';
        }
        return s;
    }

    function difficultyLabel(d) {
        return ['', '非常容易', '容易', '普通', '困難', '極為困難'][d] || '普通';
    }

    // -----------------------------------------------------------------------
    // Section populators
    // -----------------------------------------------------------------------

    function populateHero(sp) {
        // Background photo
        var heroBg = document.getElementById('spHeroBg');
        var heroPhoto = (sp.photos && sp.photos[0]) || sp.avatar || '';
        if (heroBg && heroPhoto) heroBg.style.backgroundImage = "url('" + heroPhoto + "')";

        // Group accent color
        var group = sp.group || 'ground';
        var gm = GROUP_META[group] || GROUP_META.ground;
        document.documentElement.style.setProperty('--sp-accent', gm.color);
        document.documentElement.style.setProperty('--sp-accent-rgb', gm.rgb);
        document.body.dataset.group = group;

        // Badges
        var badgesEl = document.getElementById('spBadges');
        if (badgesEl) {
            var tags = sp.conservationTags || [];
            var badgeHtml = '<span class="sp-badge sp-badge--group">' + gm.emoji + ' ' + gm.label + '</span>';
            tags.forEach(function (tag) {
                var cls = tag.indexOf('特有') !== -1 ? ' sp-badge--endemic' : '';
                badgeHtml += '<span class="sp-badge' + cls + '">' + tag + '</span>';
            });
            badgeHtml += '<span class="sp-badge sp-badge--diff">🔍 ' + difficultyLabel(sp.difficulty) + '</span>';
            badgeHtml += '<span class="sp-badge sp-badge--time">🕒 ' + (sp.activityTime || '') + '</span>';
            badgesEl.innerHTML = badgeHtml;
        }

        // Character title
        setText('spCharacter', sp.characterTitle ? '「' + sp.characterTitle + '」' : '');

        // Names
        setText('spName',       sp.name       || '');
        setText('spEnglish',    sp.englishName || '');
        setText('spScientific', sp.scientific  || '');

        // Story preview (first sentence)
        if (sp.story) {
            var preview = sp.story.split('。')[0] + '。';
            setText('spStoryPreview', preview);
        }

        // Top nav name (shows when scrolled)
        setText('spTopName', sp.name || '');
    }

    function populateGallery(sp) {
        photos = sp.photos || (sp.avatar ? [sp.avatar] : []);
        var tips = sp.photoTips || [];
        if (!photos.length) return;

        var mainImg    = document.getElementById('spMainPhoto');
        var captionEl  = document.getElementById('spPhotoCaption');
        var thumbsEl   = document.getElementById('spThumbs');
        var counterEl  = document.getElementById('spPhotoCounter');

        function showPhoto(idx) {
            currentPhotoIndex = idx;
            if (mainImg) {
                mainImg.style.opacity = '0';
                setTimeout(function () {
                    mainImg.src = photos[idx];
                    mainImg.alt = (sp.name || '') + ' 照片 ' + (idx + 1);
                    mainImg.style.opacity = '1';
                }, 220);
            }
            if (captionEl) captionEl.textContent = tips[idx] || '';
            if (counterEl) counterEl.textContent = (idx + 1) + ' / ' + photos.length;
            if (thumbsEl) {
                thumbsEl.querySelectorAll('.sp-thumb').forEach(function (t, i) {
                    t.classList.toggle('active', i === idx);
                });
            }
        }

        if (thumbsEl) {
            thumbsEl.innerHTML = photos.map(function (p, i) {
                return '<button class="sp-thumb ' + (i === 0 ? 'active' : '') +
                    '" data-index="' + i + '" aria-label="照片 ' + (i + 1) + '">' +
                    '<img src="' + p + '" alt="縮略圖 ' + (i + 1) + '" loading="lazy"></button>';
            }).join('');

            thumbsEl.querySelectorAll('.sp-thumb').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    showPhoto(parseInt(btn.dataset.index, 10));
                });
            });
        }

        showPhoto(0);

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') showPhoto((currentPhotoIndex + 1) % photos.length);
            if (e.key === 'ArrowLeft')  showPhoto((currentPhotoIndex - 1 + photos.length) % photos.length);
        });
    }

    function populateDetective(sp) {
        var container = document.getElementById('spClues');
        if (!container || !sp.idClues) return;
        container.innerHTML = sp.idClues.map(function (clue, i) {
            return '<div class="sp-clue-card sp-reveal" style="animation-delay:' + (i * 0.08) + 's">' +
                '<div class="sp-clue-card__num">' + String(i + 1).padStart(2, '0') + '</div>' +
                '<div class="sp-clue-card__text">' + clue + '</div>' +
                '</div>';
        }).join('');
    }

    function populateStory(sp) {
        setText('spStoryText', sp.story || '');
    }

    function populateLocations(sp) {
        // Hotspot location cards
        var hotspotEl = document.getElementById('spHotspot');
        if (hotspotEl && sp.hotspot) {
            var locs = sp.hotspot.split('、');
            hotspotEl.innerHTML = locs.map(function (loc) {
                return '<div class="sp-location-card">' +
                    '<span class="sp-location-card__icon">📍</span>' +
                    '<span class="sp-location-card__name">' + loc.trim() + '</span></div>';
            }).join('');
        }

        // Best times
        var timesEl = document.getElementById('spBestTimes');
        if (timesEl && sp.bestTimes) {
            timesEl.innerHTML = sp.bestTimes.map(function (t) {
                return '<span class="sp-time-chip">' + t + '</span>';
            }).join('');
        }

        // Difficulty bar
        var diffEl = document.getElementById('spDifficultyBar');
        if (diffEl) {
            var d = sp.difficulty || 3;
            diffEl.innerHTML =
                '<div class="sp-diff-label">觀察難度：' + difficultyLabel(d) + '</div>' +
                '<div class="sp-diff-track">' +
                '<div class="sp-diff-fill" id="spDiffFill" style="width:0%"></div></div>';
            setTimeout(function () {
                var fill = document.getElementById('spDiffFill');
                if (fill) fill.style.width = (d * 20) + '%';
            }, 400);
        }
    }

    function populateProfile(sp) {
        var container = document.getElementById('spProfile');
        if (!container) return;
        var items = [
            { icon: '🔬', label: '學名',   value: '<em>' + (sp.scientific || '—') + '</em>' },
            { icon: '🍽️', label: '食性',   value: sp.diet || '—' },
            { icon: '📏', label: '體型',   value: sp.size || '—' },
            { icon: '♻️', label: '生態角色', value: sp.role || '—' },
            { icon: '📅', label: '壽命',   value: sp.lifespan || '—' },
            { icon: '🌿', label: '分類',   value: (sp.classification || '').split('／')[0] || '—' },
        ];
        container.innerHTML = items.map(function (item) {
            return '<div class="sp-profile-card">' +
                '<div class="sp-profile-card__icon">' + item.icon + '</div>' +
                '<div class="sp-profile-card__label">' + item.label + '</div>' +
                '<div class="sp-profile-card__value">' + item.value + '</div></div>';
        }).join('');
    }

    function populateChallenges(sp) {
        var container = document.getElementById('spChallenges');
        if (!container || !sp.threats) return;
        var items = parseHtmlList(sp.threats);
        container.innerHTML = items.map(function (item, i) {
            return '<div class="sp-challenge-card" style="animation-delay:' + (i * 0.1) + 's">' +
                '<div class="sp-challenge-card__header">' +
                '<span class="sp-challenge-card__icon">⚠️</span>' +
                '<span class="sp-challenge-card__title">' + item.title + '</span></div>' +
                '<p class="sp-challenge-card__desc">' + item.desc + '</p></div>';
        }).join('');
    }

    function populateActions(sp) {
        var container = document.getElementById('spActions');
        if (!container || !sp.conservation) return;
        var items = parseHtmlList(sp.conservation);
        container.innerHTML = items.map(function (item, i) {
            return '<div class="sp-action-card" style="animation-delay:' + (i * 0.1) + 's">' +
                '<div class="sp-action-card__num">' + String(i + 1).padStart(2, '0') + '</div>' +
                '<div class="sp-action-card__body">' +
                '<div class="sp-action-card__title">' + item.title + '</div>' +
                '<p class="sp-action-card__desc">' + item.desc + '</p></div></div>';
        }).join('');
    }

    function populateRelated(key, sp) {
        var container = document.getElementById('spRelated');
        if (!container) return;
        var group = sp.group || 'ground';
        var groups = sp.groups || [group];

        var related = Object.entries(speciesData)
            .filter(function (entry) {
                var k = entry[0], v = entry[1];
                return k !== key && v.category === 'animal' &&
                    (v.groups || [v.group]).some(function (g) { return groups.indexOf(g) !== -1; });
            })
            .slice(0, 3);

        if (!related.length) {
            var relSection = document.getElementById('sp-related');
            if (relSection) relSection.style.display = 'none';
            return;
        }

        container.innerHTML = related.map(function (entry) {
            var k = entry[0], v = entry[1];
            var photo = v.avatar || (v.photos && v.photos[0]) || '';
            return '<a href="pages/species.html?key=' + k + '" class="sp-related-card">' +
                '<div class="sp-related-card__photo-wrap"><img src="' + photo + '" alt="' + v.name + '" loading="lazy"></div>' +
                '<div class="sp-related-card__body">' +
                '<div class="sp-related-card__name">' + v.name + '</div>' +
                '<div class="sp-related-card__en">' + (v.englishName || '') + '</div>' +
                '<div class="sp-related-card__char">' + (v.characterTitle ? '「' + v.characterTitle + '」' : '') + '</div>' +
                '</div></a>';
        }).join('');
    }

    // -----------------------------------------------------------------------
    // Scroll spy for section nav dots
    // -----------------------------------------------------------------------
    function initScrollNav() {
        var nav = document.getElementById('spSectionNav');
        if (!nav) return;

        nav.innerHTML = SECTIONS.map(function (s) {
            return '<button class="sp-nav-dot" data-target="' + s.id + '" title="' + s.label + '" aria-label="' + s.label + '"></button>';
        }).join('');

        var dots = nav.querySelectorAll('.sp-nav-dot');

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.id;
                    // Show top-nav name when scrolled past hero
                    var nameEl = document.getElementById('spTopName');
                    if (nameEl) nameEl.classList.toggle('visible', id !== 'sp-hero');
                    dots.forEach(function (d) {
                        d.classList.toggle('active', d.dataset.target === id);
                    });
                }
            });
        }, { threshold: 0.4 });

        SECTIONS.forEach(function (s) {
            var el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var el = document.getElementById(dot.dataset.target);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // -----------------------------------------------------------------------
    // Hero parallax on scroll
    // -----------------------------------------------------------------------
    function initHeroParallax() {
        var bg = document.getElementById('spHeroBg');
        if (!bg) return;
        window.addEventListener('scroll', function () {
            var y = window.scrollY;
            bg.style.transform = 'scale(1.1) translateY(' + (y * 0.25) + 'px)';
        }, { passive: true });
    }

    // -----------------------------------------------------------------------
    // Scroll reveal via IntersectionObserver
    // -----------------------------------------------------------------------
    function initScrollReveal() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.sp-reveal').forEach(function (el) {
            observer.observe(el);
        });
    }

    // -----------------------------------------------------------------------
    // Discovery tracking
    // -----------------------------------------------------------------------
    function markDiscovered(key) {
        try {
            var discovered = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
            discovered.add(key);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(discovered)));
            // Update progress pill
            var pill = document.querySelector('.sp-topnav__progress-pill b');
            if (pill) pill.textContent = discovered.size;
        } catch (e) { /* localStorage not available */ }
    }

    function getDiscoveredCount() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').length;
        } catch (e) { return 0; }
    }

    // -----------------------------------------------------------------------
    // Main entry
    // -----------------------------------------------------------------------
    function init() {
        var key = getKey();
        if (!key || !hasSpecies(key)) {
            window.location.href = 'pages/animals.html';
            return;
        }

        var sp = speciesData[key];

        // Update page title
        document.title = sp.name + ' — 中大校園野生動物';

        // Populate all sections
        populateHero(sp);
        populateGallery(sp);
        populateDetective(sp);
        populateStory(sp);
        populateLocations(sp);
        populateProfile(sp);
        populateChallenges(sp);
        populateActions(sp);
        populateRelated(key, sp);

        // Update progress pill
        var pill = document.querySelector('.sp-topnav__progress-pill b');
        if (pill) pill.textContent = getDiscoveredCount();

        // Mark as discovered
        markDiscovered(key);

        // Init nav + interactions
        initScrollNav();
        initHeroParallax();
        initScrollReveal();

        // Hero load animation (Ken Burns)
        requestAnimationFrame(function () {
            var hero = document.getElementById('sp-hero');
            if (hero) hero.classList.add('loaded');
        });
    }

    document.addEventListener('DOMContentLoaded', init);

})();
