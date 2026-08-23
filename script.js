/* =============================================================================
   ChemTech Innovation — ctiworld.online
   Progressive enhancement only: every section is readable and usable with
   JavaScript disabled. Scroll work is batched into a single rAF-throttled
   listener rather than one listener per effect.
   ========================================================================== */

(function () {
    'use strict';

    // Signals to CSS that JS is available, so reveal animations can start hidden.
    // Without this class the .reveal rule never applies and content is visible.
    document.documentElement.classList.add('js');

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------------------
       Mobile navigation
       --------------------------------------------------------------------- */
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    function setMenu(open) {
        if (!navMenu || !navToggle) return;
        navMenu.classList.toggle('is-open', open);
        navToggle.classList.toggle('is-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            setMenu(!navMenu.classList.contains('is-open'));
        });

        // Collapse after choosing a destination.
        navMenu.addEventListener('click', function (e) {
            if (e.target.closest('a')) setMenu(false);
        });

        // Collapse on outside click and on Escape.
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) setMenu(false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                setMenu(false);
                navToggle.focus();
            }
        });
    }

    /* ---------------------------------------------------------------------
       Scroll-driven UI: navbar shadow, active link, back-to-top.
       One listener, one rAF frame per scroll burst.
       --------------------------------------------------------------------- */
    var navbar = document.getElementById('navbar');
    var toTop = document.getElementById('toTop');
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var ticking = false;

    function onScrollFrame() {
        var y = window.scrollY;

        if (navbar) navbar.classList.toggle('is-scrolled', y > 24);
        if (toTop) toTop.classList.toggle('is-visible', y > 600);

        // The section whose top has most recently passed the nav line wins.
        var currentId = '';
        for (var i = 0; i < sections.length; i++) {
            if (sections[i].offsetTop - 120 <= y) currentId = sections[i].id;
        }

        navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
        });

        ticking = false;
    }

    function requestScrollFrame() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(onScrollFrame);
    }

    window.addEventListener('scroll', requestScrollFrame, { passive: true });
    window.addEventListener('resize', requestScrollFrame, { passive: true });
    onScrollFrame();

    if (toTop) {
        toTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    /* ---------------------------------------------------------------------
       Scroll reveal. CSS scroll-padding-top handles anchor offsets, so no
       manual scroll maths is needed here.
       --------------------------------------------------------------------- */
    var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
        revealables.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                // Stagger siblings slightly so grids cascade instead of popping.
                var siblings = Array.prototype.slice.call(entry.target.parentNode.children);
                var delay = Math.min(siblings.indexOf(entry.target), 5) * 70;
                setTimeout(function () { entry.target.classList.add('is-visible'); }, delay);
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealables.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ---------------------------------------------------------------------
       Contact form.
       GitHub Pages serves static files only, so there is no endpoint to POST
       to. Rather than fake a success message, we compose a mailto: link so the
       enquiry genuinely reaches the inbox. The form's action attribute is the
       no-JS fallback.
       --------------------------------------------------------------------- */
    var form = document.getElementById('contactForm');
    var status = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', function (e) {
            if (!form.reportValidity()) return;
            e.preventDefault();

            var data = new FormData(form);
            var name = (data.get('name') || '').trim();
            var company = (data.get('company') || '').trim();
            var email = (data.get('email') || '').trim();
            var interest = data.get('interest') || 'General enquiry';
            var message = (data.get('message') || '').trim();

            var subject = 'Website enquiry: ' + interest + (company ? ' — ' + company : '');
            var body = [
                'Name: ' + name,
                'Company: ' + (company || '—'),
                'Email: ' + email,
                'Area of interest: ' + interest,
                '',
                'Requirement:',
                message
            ].join('\n');

            window.location.href = 'mailto:innovationchemtech@gmail.com'
                + '?subject=' + encodeURIComponent(subject)
                + '&body=' + encodeURIComponent(body);

            if (status) {
                status.textContent = 'Your email client should now open with this enquiry ready to send. '
                    + 'If nothing happened, email innovationchemtech@gmail.com directly.';
                status.classList.add('is-ok');
                status.hidden = false;
            }
        });
    }

    /* ---------------------------------------------------------------------
       Footer year
       --------------------------------------------------------------------- */
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
}());
