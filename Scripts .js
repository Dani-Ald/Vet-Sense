/* ============================================================
   VETSENSE — scripts.js
   Interacciones: nav scroll, mobile menu, scroll reveal
   ============================================================ */

/* ── 1. NAV — scroll state ──────────────────────────────────── */
(function () {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function updateNav() {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
})();


/* ── 2. NAV — mobile toggle ────────────────────────────────── */
(function () {
    const toggle = document.querySelector('.nav__toggle');
    const mobileNav = document.getElementById('nav-mobile');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        mobileNav.hidden = isOpen;
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            toggle.setAttribute('aria-expanded', 'false');
            mobileNav.hidden = true;
        });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
            toggle.setAttribute('aria-expanded', 'false');
            mobileNav.hidden = true;
        }
    });
})();


/* ── 3. ACTIVE NAV LINK on scroll ──────────────────────────── */
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (link) {
                        const href = link.getAttribute('href');
                        if (href === '#' + entry.target.id) {
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        },
        { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(function (section) { observer.observe(section); });
})();


/* ── 4. SCROLL REVEAL ──────────────────────────────────────── */
(function () {
    var targets = document.querySelectorAll(
        '.problem-card, .flow__step, .tech-card, .result-item, ' +
        '.section__heading, .section__label, .pull-quote, ' +
        '.packet-demo, .arch-diagram, .hero__stats, .hero__badge'
    );

    if (!targets.length) return;

    // Add reveal class
    targets.forEach(function (el, i) {
        el.classList.add('reveal');
        // Stagger siblings within same parent
        var siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
        var idx = siblings.indexOf(el);
        if (idx > 0 && idx < 5) {
            el.classList.add('reveal-delay-' + idx);
        }
    });

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    targets.forEach(function (el) { observer.observe(el); });
})();


/* ── 5. KEYBOARD: skip to main content ─────────────────────── */
(function () {
    var skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.setAttribute('class', 'sr-only');
    skipLink.style.cssText =
        'position:fixed;top:8px;left:8px;z-index:9999;padding:8px 16px;' +
        'background:var(--color-teal);color:var(--color-dark);border-radius:6px;' +
        'font-weight:600;font-size:14px;';
    skipLink.addEventListener('focus', function () {
        skipLink.style.clip = 'auto';
        skipLink.style.width = 'auto';
        skipLink.style.height = 'auto';
        skipLink.style.overflow = 'visible';
        skipLink.style.position = 'fixed';
    });
    document.body.prepend(skipLink);

    var main = document.querySelector('main');
    if (main) main.id = 'main';
})();