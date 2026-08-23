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

       Posts to Web3Forms, which relays the enquiry by email — so the visitor
       never leaves the page and never needs a configured mail client.

       If the access key has not been filled in yet, we fall back to composing
       a mailto: instead of POSTing with a placeholder key and failing. The
       form is therefore functional at every stage of setup.
       --------------------------------------------------------------------- */
    var form = document.getElementById('contactForm');
    var status = document.getElementById('formStatus');
    var submitBtn = document.getElementById('submitBtn');
    var PLACEHOLDER_KEY = 'REPLACE_WITH_WEB3FORMS_ACCESS_KEY';

    function setStatus(message, kind) {
        if (!status) return;
        status.textContent = message;
        status.classList.remove('is-ok', 'is-error', 'is-pending');
        status.classList.add('is-' + kind);
        status.hidden = false;
    }

    function fallbackToMailto(data, address) {
        var subject = 'Website enquiry: ' + (data.get('interest') || 'General')
            + (data.get('company') ? ' \u2014 ' + data.get('company') : '');
        var body = [
            'Name: ' + (data.get('name') || ''),
            'Company: ' + (data.get('company') || '\u2014'),
            'Email: ' + (data.get('email') || ''),
            'Area of interest: ' + (data.get('interest') || ''),
            '',
            'Requirement:',
            data.get('message') || ''
        ].join('\n');

        window.location.href = 'mailto:' + address
            + '?subject=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(body);

        setStatus('Your email client should now open with this enquiry ready to send. '
            + 'If nothing happened, email ' + address + ' directly.', 'ok');
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            if (!form.reportValidity()) return;
            e.preventDefault();

            var data = new FormData(form);
            var address = form.getAttribute('data-fallback-email') || '';
            var key = data.get('access_key');

            // Setup incomplete — hand off to the mail client rather than fail.
            if (!key || key === PLACEHOLDER_KEY) {
                fallbackToMailto(data, address);
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending\u2026';
            }
            setStatus('Sending your enquiry\u2026', 'pending');

            var payload = {};
            data.forEach(function (value, key) { payload[key] = value; });

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(function (res) {
                return res.json().then(function (body) { return { ok: res.ok, body: body }; });
            })
            .then(function (result) {
                if (!result.ok || result.body.success === false) {
                    throw new Error(result.body && result.body.message ? result.body.message : 'Send failed');
                }
                form.reset();
                setStatus('Thank you \u2014 your enquiry has been sent. We usually reply '
                    + 'within two business days.', 'ok');
            })
            .catch(function () {
                setStatus('Sorry, the enquiry could not be sent. Please email '
                    + address + ' directly and we will pick it up.', 'error');
            })
            .finally(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send enquiry';
                }
            });
        });
    }

    /* ---------------------------------------------------------------------
       Footer year
       --------------------------------------------------------------------- */
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
}());
