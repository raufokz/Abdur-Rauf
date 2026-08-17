/* =========================================================================
   Abdur Rauf — Portfolio scripts
   Built to spec: scroll reveal, stagger, sliders, horizontal timeline,
   accordion, real-time validation, page loader, back to top.
   Progressive enhancement only — all content works with JS disabled.
   ========================================================================= */
(function () {
  'use strict';

  var qs = function (s, r) { return (r || document).querySelector(s); };
  var qsa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Page loader: minimal progress bar at top ---- */
  var loader = qs('#pageLoader');
  if (loader) {
    loader.style.width = '35%';
    document.addEventListener('readystatechange', function () {
      if (document.readyState === 'interactive') loader.style.width = '70%';
    });
    window.addEventListener('load', function () {
      loader.style.width = '100%';
      setTimeout(function () { loader.style.opacity = '0'; }, 250);
    });
  }

  /* ---- Scroll progress ---- */
  var progress = qs('#scrollProgress');

  /* ---- Theme toggle ---- */
  var toggle = qs('#themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ar-theme', next); } catch (e) {}
      toggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  /* ---- Header state, scroll progress, back to top ---- */
  var header = qs('#header');
  var toTop = qs('#toTop');
  var onScroll = function () {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 500);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? (y / max * 100) + '%' : '0%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---- Mobile drawer ---- */
  var drawer = qs('#drawer'), openBtn = qs('#navToggle'), closeBtn = qs('#drawerClose');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = qs('a, button', drawer); if (f) f.focus(); }
    else if (openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setDrawer(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });
  if (drawer) qsa('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) setDrawer(false);
  });

  /* ---- Scrollspy: active link underline ---- */
  var spyLinks = qsa('.nav-list a[href^="#"]');
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var map = {}, targets = [];
    spyLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (!el) return;
      (map[id] = map[id] || []).push(link);
      if (targets.indexOf(el) === -1) targets.push(el);
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        spyLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
        (map[entry.target.id] || []).forEach(function (l) { l.setAttribute('aria-current', 'true'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ---- Scroll reveal + stagger ---- */
  var animated = qsa('.reveal, .stagger');
  if (!('IntersectionObserver' in window) || reduced) {
    animated.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        ro.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    animated.forEach(function (el) { ro.observe(el); });
  }

  /* ---- Image fallbacks ---- */
  qsa('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      var fb = img.getAttribute('data-fallback');
      if (fb && img.getAttribute('src') !== fb) img.setAttribute('src', fb);
    }, { once: true });
  });

  /* =======================================================================
     Slider — arrows + dots, autoplay optional, swipe, keyboard
     Cards live in the DOM and are moved with a transform, so every project
     stays crawlable regardless of which slide is showing.
     ======================================================================= */
  function makeSlider(root) {
    var track = qs('.slider-track', root);
    if (!track) return;
    var slides = qsa('.slide', track);
    if (!slides.length) return;

    var prev = qs('[data-slider-prev]', root);
    var next = qs('[data-slider-next]', root);
    var dotsWrap = qs('[data-slider-dots]', root);
    var autoplay = parseInt(root.getAttribute('data-autoplay') || '0', 10);
    var index = 0, pages = 1, timer = null;

    function perView() {
      var w = window.innerWidth;
      if (root.classList.contains('slider--single')) return 1;
      if (w <= 767) return 1;
      if (w <= 1199) return 2;
      return 3;
    }

    function recalc() {
      pages = Math.max(1, Math.ceil(slides.length / perView()));
      if (index > pages - 1) index = pages - 1;
      renderDots();
      go(index, false);
    }

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to slide group ' + (i + 1));
        b.setAttribute('aria-current', i === index ? 'true' : 'false');
        (function (n) { b.addEventListener('click', function () { go(n); restart(); }); })(i);
        dotsWrap.appendChild(b);
      }
    }

    function go(i, animate) {
      index = (i + pages) % pages;
      var step = slides[0].getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      track.style.transition = animate === false ? 'none' : '';
      track.style.transform = 'translateX(-' + (index * perView() * (step + gap)) + 'px)';
      if (animate === false) { void track.offsetWidth; track.style.transition = ''; }
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === pages - 1;
      if (dotsWrap) qsa('button', dotsWrap).forEach(function (d, n) {
        d.setAttribute('aria-current', n === index ? 'true' : 'false');
      });
    }

    function restart() {
      if (!autoplay || reduced) return;
      clearInterval(timer);
      timer = setInterval(function () { go(index + 1); }, autoplay);
    }

    if (prev) prev.addEventListener('click', function () { go(index - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(index + 1); restart(); });

    // swipe
    var startX = 0, dragging = false;
    root.addEventListener('pointerdown', function (e) { startX = e.clientX; dragging = true; });
    root.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      var d = e.clientX - startX;
      if (Math.abs(d) > 50) { go(index + (d < 0 ? 1 : -1)); restart(); }
    });
    root.addEventListener('pointercancel', function () { dragging = false; });

    // pause autoplay on hover / focus
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', restart);
    root.addEventListener('focusin', function () { clearInterval(timer); });
    root.addEventListener('focusout', restart);

    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(recalc, 150); });

    recalc();
    restart();
    root.__recalc = recalc;
  }
  qsa('[data-slider]').forEach(makeSlider);

  /* ---- Horizontal timeline: active node + line fill on scroll ---- */
  var rail = qs('#timelineRail');
  if (rail && 'IntersectionObserver' in window) {
    var nodes = qsa('.tl-node', rail);
    var tlObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var i = nodes.indexOf(entry.target);
        nodes.forEach(function (n, j) { n.classList.toggle('is-active', j <= i); });
        rail.style.setProperty('--tl-progress', ((i + 1) / nodes.length * 100) + '%');
      });
    }, { threshold: 0.5, rootMargin: '0px -20% 0px -20%' });
    nodes.forEach(function (n) { tlObs.observe(n); });
  }

  /* ---- Project filters ---- */
  var filterBar = qs('#projectFilters');
  if (filterBar) {
    var chips = qsa('.chip', filterBar);
    var cards = qsa('#projects [data-cat]');
    var countEl = qs('#filterCount');
    var total = cards.length;

    var applyFilter = function (filter) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = filter === 'all' ||
          (card.getAttribute('data-cat') || '').split(/\s+/).indexOf(filter) !== -1;
        card.classList.toggle('is-filtered-out', !match);
        if (match) shown++;
      });
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-filter') === filter ? 'true' : 'false');
      });
      if (countEl) {
        countEl.textContent = filter === 'all' ? total + ' projects' : shown + ' of ' + total + ' projects';
      }
      var grid = qs('#projects .grid-3');
      if (grid) grid.classList.toggle('is-filtered-out', qsa('[data-cat]:not(.is-filtered-out)', grid).length === 0);
    };

    filterBar.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (chip) applyFilter(chip.getAttribute('data-filter'));
    });
    applyFilter('all');
  }

  /* ---- Contact form: real-time validation + loading state ---- */
  var form = qs('#contactForm');
  if (form) {
    var status = qs('#formStatus');
    var submit = qs('#formSubmit');
    var fields = qsa('input, select, textarea', form);

    function validate(el) {
      var wrap = el.closest('.field');
      if (!wrap) return el.checkValidity();
      var ok = el.checkValidity();
      var touched = wrap.getAttribute('data-touched') === 'true';
      wrap.classList.toggle('is-invalid', touched && !ok);
      wrap.classList.toggle('is-valid', touched && ok && el.value.trim() !== '');
      return ok;
    }

    fields.forEach(function (el) {
      var wrap = el.closest('.field');
      el.addEventListener('blur', function () {
        if (wrap) wrap.setAttribute('data-touched', 'true');
        validate(el);
      });
      el.addEventListener('input', function () { validate(el); });
      el.addEventListener('change', function () {
        if (wrap) wrap.setAttribute('data-touched', 'true');
        validate(el);
      });
    });

    if (window.fetch) {
      form.addEventListener('submit', function (e) {
        fields.forEach(function (el) {
          var w = el.closest('.field');
          if (w) w.setAttribute('data-touched', 'true');
          validate(el);
        });
        if (!form.checkValidity()) return;   // browser shows its own messages

        e.preventDefault();
        if (submit) { submit.disabled = true; submit.classList.add('is-loading'); submit.dataset.label = submit.textContent; submit.textContent = 'Sending…'; }
        if (status) { status.className = 'form-status'; status.textContent = ''; }

        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        }).then(function (res) {
          if (!res.ok) throw new Error('failed');
          if (status) {
            status.className = 'form-status is-ok';
            status.textContent = 'Thanks — your message is on its way. I reply within one business day.';
          }
          form.reset();
          qsa('.field', form).forEach(function (w) {
            w.classList.remove('is-valid', 'is-invalid');
            w.removeAttribute('data-touched');
          });
        }).catch(function () {
          if (status) {
            status.className = 'form-status is-err';
            status.innerHTML = 'Sending failed. Please email <a href="mailto:rauforakzai10@gmail.com">rauforakzai10@gmail.com</a> or message +92 370 1913453 on WhatsApp.';
          }
        }).then(function () {
          if (submit) {
            submit.disabled = false;
            submit.classList.remove('is-loading');
            submit.textContent = submit.dataset.label || 'Send enquiry';
          }
        });
      });
    }
  }

  /* ---- Accordion: only one open at a time ---- */
  var accs = qsa('.acc');
  accs.forEach(function (acc) {
    acc.addEventListener('toggle', function () {
      if (!acc.open) return;
      accs.forEach(function (other) { if (other !== acc) other.open = false; });
    });
  });

  /* ---- Current year ---- */
  qsa('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
