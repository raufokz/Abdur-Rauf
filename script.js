(() => {
  const doc = document.documentElement;
  const body = document.body;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  body.classList.add('js-ready');

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const loader = qs('#site-loader');
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add('is-hidden');
    body.classList.remove('is-loading');
  };

  window.addEventListener('load', () => {
    setTimeout(hideLoader, 420);
  });
  setTimeout(hideLoader, 1800);

  const navbar = qs('#navbar');
  const progress = qs('#scroll-progress');
  const navLinks = qsa('.nav-link');

  const updateScrollState = () => {
    const scrollTop = window.scrollY || doc.scrollTop;
    const scrollHeight = doc.scrollHeight - window.innerHeight;
    if (navbar) navbar.classList.toggle('is-scrolled', scrollTop > 18);
    if (progress) progress.style.width = `${scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0}%`;
  };

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  const menuToggle = qs('#menu-toggle');
  const navMenu = qs('#nav-menu');
  const closeMenu = () => {
    navMenu?.classList.remove('is-open');
    menuToggle?.classList.remove('is-active');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = navMenu?.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active', Boolean(isOpen));
    menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

  qsa('main section[id]').forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -70px 0px' });

  qsa('[data-reveal]').forEach((el) => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.count || 0);
      const duration = prefersReduced ? 1 : 1300;
      const start = performance.now();

      const tick = (time) => {
        const progressValue = clamp((time - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        counter.textContent = Math.round(target * eased);
        if (progressValue < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  }, { threshold: 0.55 });

  qsa('.count').forEach((counter) => counterObserver.observe(counter));

  const cursor = qs('#cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let cursorX = 0;
    let cursorY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursor.style.opacity = '1';
    }, { passive: true });

    const renderCursor = () => {
      currentX += (cursorX - currentX) * 0.22;
      currentY += (cursorY - currentY) * 0.22;
      cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };

    renderCursor();

    qsa('a, button, .tilt-card, input, textarea, select').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });
  }

  qsa('.magnetic').forEach((button) => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReduced) return;

    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });

  qsa('.tilt-card').forEach((card) => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReduced) return;

    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  const initSimpleSlider = ({ slides, dotsContainer, interval = 4500, activeClass = 'is-active' }) => {
    if (!slides.length) return { goTo: () => {} };

    let index = 0;
    let timer;
    const dots = [];

    const goTo = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle(activeClass, i === index));
      dots.forEach((dot, i) => dot.classList.toggle(activeClass, i === index));
    };

    const start = () => {
      if (prefersReduced || slides.length < 2) return;
      clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), interval);
    };

    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Show slide ${i + 1}`);
        dot.addEventListener('click', () => {
          goTo(i);
          start();
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    goTo(0);
    start();
    return { goTo, start };
  };

  initSimpleSlider({
    slides: qsa('.profile-slide'),
    dotsContainer: qs('#profile-dots'),
    interval: 4200
  });

  const parallaxZone = qs('#hero-parallax');
  if (parallaxZone && window.matchMedia('(pointer: fine)').matches && !prefersReduced) {
    const items = qsa('.parallax-item', parallaxZone);
    parallaxZone.addEventListener('mousemove', (event) => {
      const rect = parallaxZone.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      items.forEach((item) => {
        const speed = Number(item.dataset.speed || 0.02);
        item.style.transform = `translate3d(${x * speed}px, ${y * speed}px, 0)`;
      });
    });

    parallaxZone.addEventListener('mouseleave', () => {
      items.forEach((item) => {
        item.style.transform = '';
      });
    });
  }

  const skillPanel = qs('#skill-panel');
  const setSkillPanel = (node) => {
    if (!skillPanel || !node) return;
    const name = node.dataset.skill;
    const years = node.dataset.years;
    const projects = node.dataset.projects;
    const percent = node.dataset.percent;
    qsa('.skill-node').forEach((item) => item.classList.toggle('is-active', item === node));
    skillPanel.innerHTML = `
      <span>${years} experience</span>
      <strong>${name}</strong>
      <p>${projects}+ projects completed with ${percent}% practical command.</p>
      <div class="skill-meter"><div style="width: ${percent}%"></div></div>
    `;
  };

  qsa('.skill-node').forEach((node) => {
    node.addEventListener('mouseenter', () => setSkillPanel(node));
    node.addEventListener('focus', () => setSkillPanel(node));
  });

  const featuredProjects = qsa('.featured-project');
  const featuredProgress = qs('#featured-progress-bar');
  const featuredPrev = qs('#featured-prev');
  const featuredNext = qs('#featured-next');
  let featuredIndex = 0;
  let featuredStart = performance.now();
  const featuredDuration = 5000;

  const showFeatured = (nextIndex) => {
    if (!featuredProjects.length) return;
    featuredIndex = (nextIndex + featuredProjects.length) % featuredProjects.length;
    featuredProjects.forEach((project, i) => {
      project.classList.toggle('is-active', i === featuredIndex);
    });
    featuredStart = performance.now();
    if (featuredProgress) featuredProgress.style.width = '0%';
  };

  const animateFeaturedProgress = (time) => {
    if (featuredProjects.length && !prefersReduced) {
      const percent = clamp(((time - featuredStart) / featuredDuration) * 100, 0, 100);
      if (featuredProgress) featuredProgress.style.width = `${percent}%`;
      if (percent >= 100) showFeatured(featuredIndex + 1);
    }
    requestAnimationFrame(animateFeaturedProgress);
  };

  featuredPrev?.addEventListener('click', () => showFeatured(featuredIndex - 1));
  featuredNext?.addEventListener('click', () => showFeatured(featuredIndex + 1));
  showFeatured(0);
  requestAnimationFrame(animateFeaturedProgress);

  const makeDraggableScroll = (track) => {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    track.addEventListener('pointerdown', (event) => {
      isDown = true;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture?.(event.pointerId);
    });

    track.addEventListener('pointermove', (event) => {
      if (!isDown) return;
      event.preventDefault();
      track.scrollLeft = startScroll - (event.clientX - startX);
    });

    const stop = (event) => {
      isDown = false;
      track.classList.remove('is-dragging');
      if (event.pointerId !== undefined) track.releasePointerCapture?.(event.pointerId);
    };

    track.addEventListener('pointerup', stop);
    track.addEventListener('pointercancel', stop);
    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('is-dragging');
    });
  };

  qsa('.rail-track').forEach(makeDraggableScroll);

  const projectMarquee = qs('#project-marquee');
  if (projectMarquee) {
    let dragging = false;
    let startX = 0;
    let offset = 0;
    const tracks = qsa('.project-marquee-track', projectMarquee);

    projectMarquee.addEventListener('pointerdown', (event) => {
      dragging = true;
      startX = event.clientX;
      projectMarquee.classList.add('is-dragging');
      projectMarquee.setPointerCapture?.(event.pointerId);
    });

    projectMarquee.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      event.preventDefault();
      offset = clamp(event.clientX - startX, -180, 180);
      tracks.forEach((track) => {
        track.style.transform = `translateX(${offset}px)`;
      });
    });

    const endMarqueeDrag = (event) => {
      dragging = false;
      offset = 0;
      projectMarquee.classList.remove('is-dragging');
      tracks.forEach((track) => {
        track.style.transform = '';
      });
      if (event?.pointerId !== undefined) projectMarquee.releasePointerCapture?.(event.pointerId);
    };

    projectMarquee.addEventListener('pointerup', endMarqueeDrag);
    projectMarquee.addEventListener('pointercancel', endMarqueeDrag);
    projectMarquee.addEventListener('mouseleave', endMarqueeDrag);
  }

  const railTabs = qsa('.rail-tab');
  const rails = qsa('.project-rail');

  railTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      railTabs.forEach((item) => item.classList.toggle('is-active', item === tab));
      rails.forEach((rail) => {
        const category = rail.dataset.category || '';
        rail.classList.toggle('is-hidden', filter !== 'all' && !category.includes(filter));
      });
    });
  });

  const pricingButtons = qsa('[data-plan-mode]');
  const priceValues = qsa('.price-card h3[data-project-price]');

  pricingButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.planMode;
      pricingButtons.forEach((item) => item.classList.toggle('is-active', item === button));
      priceValues.forEach((price) => {
        price.style.opacity = '0';
        price.style.transform = 'translateY(8px)';
        setTimeout(() => {
          price.textContent = mode === 'monthly' ? price.dataset.monthlyPrice : price.dataset.projectPrice;
          price.style.opacity = '1';
          price.style.transform = '';
        }, 150);
      });
    });
  });

  const journeyMap = qs('#journey-map');
  const journeyPath = qs('#journey-path-progress');
  const journeyPathBg = qs('#journey-path-bg');
  const journeyRocket = qs('#journey-rocket');
  let pathLength = 0;

  const setupJourney = () => {
    if (!journeyPath || !journeyPathBg) return;
    pathLength = journeyPath.getTotalLength();
    journeyPath.style.strokeDasharray = `${pathLength}`;
    journeyPath.style.strokeDashoffset = `${pathLength}`;
  };

  const updateJourney = () => {
    if (!journeyMap || !journeyPath || !journeyPathBg || !journeyRocket || !pathLength) return;
    const rect = journeyMap.getBoundingClientRect();
    const progressValue = clamp((window.innerHeight * 0.72 - rect.top) / (rect.height * 0.9), 0, 1);
    journeyPath.style.strokeDashoffset = `${pathLength * (1 - progressValue)}`;
    const point = journeyPath.getPointAtLength(pathLength * progressValue);
    journeyRocket.style.left = `${(point.x / 1100) * 100}%`;
    journeyRocket.style.top = `${(point.y / 520) * 100}%`;
  };

  setupJourney();
  updateJourney();
  window.addEventListener('scroll', updateJourney, { passive: true });
  window.addEventListener('resize', () => {
    setupJourney();
    updateJourney();
  });

  const reviewTrack = qs('#review-track');
  let reviewIndex = 0;
  let reviewTimer;

  const updateReviews = () => {
    if (!reviewTrack) return;
    const cards = qsa('.review-card', reviewTrack);
    if (!cards.length) return;
    const first = cards[0];
    const style = window.getComputedStyle(reviewTrack);
    const gap = parseFloat(style.columnGap || style.gap || 0);
    const cardWidth = first.getBoundingClientRect().width + gap;
    const visible = Math.max(1, Math.floor((reviewTrack.parentElement.clientWidth + gap) / cardWidth));
    const maxIndex = Math.max(0, cards.length - visible);
    reviewIndex = reviewIndex > maxIndex ? 0 : reviewIndex;
    reviewTrack.style.transform = `translateX(${-reviewIndex * cardWidth}px)`;
  };

  const startReviews = () => {
    if (!reviewTrack || prefersReduced) return;
    clearInterval(reviewTimer);
    reviewTimer = setInterval(() => {
      const cards = qsa('.review-card', reviewTrack);
      const first = cards[0];
      if (!first) return;
      const style = window.getComputedStyle(reviewTrack);
      const gap = parseFloat(style.columnGap || style.gap || 0);
      const cardWidth = first.getBoundingClientRect().width + gap;
      const visible = Math.max(1, Math.floor((reviewTrack.parentElement.clientWidth + gap) / cardWidth));
      const maxIndex = Math.max(0, cards.length - visible);
      reviewIndex = reviewIndex >= maxIndex ? 0 : reviewIndex + 1;
      updateReviews();
    }, 4300);
  };

  reviewTrack?.addEventListener('mouseenter', () => clearInterval(reviewTimer));
  reviewTrack?.addEventListener('mouseleave', startReviews);
  window.addEventListener('resize', updateReviews);
  updateReviews();
  startReviews();

  const modal = qs('#project-modal');
  const modalTitle = qs('#modal-title');
  const modalDescription = qs('#modal-description');
  const projectDescriptions = {
    'Omni Referral Management': 'A CRM-oriented referral platform focused on attribution, partner visibility, lead movement, and reporting discipline.',
    'SoftoTeam Dashboard': 'A dashboard experience built to make internal team activity easier to read, manage, and act on.',
    'iProply Estate Platform': 'A real estate workflow that connects property presentation with lead capture and CRM-friendly follow-up.',
    'Trufijo Professional': 'A polished service website that improves trust, content hierarchy, and lead conversion paths.',
    'SevenTech LLC': 'A corporate WordPress build designed for credibility, clarity, and responsive browsing.',
    'Deals Down Store': 'A commerce-focused WordPress experience built around clear product pathways and campaign pages.',
    'One Church United': 'A community platform with publishing, contact, and information architecture shaped for clarity.',
    'Capital Edu System': 'An education system interface focused on organized data, admissions, and admin usability.',
    'QuizByRauf': 'A JavaScript quiz application with interactive state, feedback, and responsive behavior.',
    'Attendance Management System': 'A structured internal system for attendance records, team tracking, and reporting.'
  };

  const openModal = (title) => {
    if (!modal) return;
    if (modalTitle) modalTitle.textContent = title || 'Project Snapshot';
    if (modalDescription) modalDescription.textContent = projectDescriptions[title] || 'A focused project snapshot from Abdur Rauf portfolio.';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  };

  qsa('.open-project').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.project || button.closest('[data-title]')?.dataset.title));
  });

  qsa('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  const form = qs('#contact-form');
  const formStatus = qs('#form-status');

  const setStatus = (message, isError = false) => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.style.color = isError ? 'var(--coral)' : 'var(--gold)';
  };

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = qsa('input, select, textarea', form);
    let valid = true;

    fields.forEach((field) => {
      const isEmail = field.type === 'email';
      const value = field.value.trim();
      const fieldValid = field.required
        ? value.length > 0 && (!isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        : true;

      field.classList.toggle('is-invalid', !fieldValid);
      if (!fieldValid) valid = false;
    });

    if (!valid) {
      setStatus('Please complete the highlighted fields.', true);
      return;
    }

    setStatus('Sending your message...');
    const submitButton = qs('button[type="submit"]', form);
    submitButton?.setAttribute('disabled', 'disabled');

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Form request failed');
      form.reset();
      setStatus('Message sent. I will get back to you soon.');
    } catch (error) {
      setStatus('The message could not be sent right now. Email or WhatsApp still works.', true);
    } finally {
      submitButton?.removeAttribute('disabled');
    }
  });

  qsa('.contact-form input, .contact-form select, .contact-form textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('is-invalid'));
  });

  const footerYear = qs('#footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();
})();
