/* ============================================================
   PREMIUM PORTFOLIO — JavaScript
   Abdur Rauf | Full Stack Developer
   ============================================================ */

'use strict';

/* ===== UTILITIES ===== */
const qs  = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ===== HERO ORBIT GALLERY ===== */
(function heroOrbit() {
  const orbit   = qs('#heroOrbit');
  const mainImg = qs('#orbitMain');
  const mainSrc = qs('#orbitMainSrc');
  const thumbs  = qsa('.orbit-thumb', orbit || document);
  if (!orbit || !mainImg || !thumbs.length) return;

  let index = 0;
  let timer = null;

  const setActive = (i) => {
    index = (i + thumbs.length) % thumbs.length;
    const t = thumbs[index];
    const img  = t.dataset.img;
    const webp = t.dataset.webp;
    // Swap center photo (prefer WebP), with graceful fallback
    if (mainSrc && webp) mainSrc.srcset = webp;
    mainImg.src = img;
    // Restart the fade animation
    mainImg.style.animation = 'none';
    void mainImg.offsetWidth;
    mainImg.style.animation = '';
    thumbs.forEach((el, j) => el.classList.toggle('is-active', j === index));
  };

  // Fallback if a center image fails to load
  mainImg.addEventListener('error', () => {
    if (!mainImg.src.endsWith('profile.jpg')) mainImg.src = 'assets/images/my-images/profile.jpg';
  });

  const advance = () => setActive(index + 1);
  const start = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stop();
    timer = window.setInterval(advance, 3500);
  };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

  // Click / focus a thumbnail to feature it
  thumbs.forEach((t, i) => {
    t.addEventListener('click', () => { setActive(i); start(); });
  });

  // Pause auto-rotation while interacting
  orbit.addEventListener('mouseenter', stop);
  orbit.addEventListener('mouseleave', start);
  orbit.addEventListener('focusin', stop);
  orbit.addEventListener('focusout', start);

  start();
})();

/* ===== SKILL DETAIL MODAL ===== */
(function skillModal() {
  const cards = qsa('.power-card');
  const modal = qs('#skillModal');
  if (!cards.length || !modal) return;

  // Short, human-readable descriptions shown in the modal (keyed by skill name).
  const SKILL_DESC = {
    'React': 'I build fast, component-driven interfaces with React — hooks, clean state management, and reusable UI that scales as the product grows.',
    'Angular': 'Enterprise single-page apps in Angular using TypeScript, RxJS, and Material — structured, maintainable, and production-ready.',
    'JavaScript': 'Modern ES6+ JavaScript — async/await, clean DOM work, and the logic that powers interactive, dynamic web experiences.',
    'TypeScript': 'Type-safe JavaScript with interfaces and generics — fewer runtime bugs and code that stays easy to maintain at scale.',
    'HTML5': 'Semantic, accessible, SEO-ready markup that gives every project a clean, standards-compliant foundation.',
    'CSS3 / SCSS': 'Pixel-accurate styling with modern CSS and SCSS — Grid, Flexbox, and smooth animations that look right on every screen.',
    'Tailwind CSS': 'Rapid, consistent interfaces built with Tailwind’s utility-first workflow and reusable design systems.',
    'Bootstrap': 'Responsive, mobile-first layouts shipped quickly using Bootstrap’s grid and component library.',
    'Laravel': 'Full-stack Laravel apps — MVC architecture, Eloquent ORM, queues, and secure REST APIs for SaaS platforms and dashboards.',
    'PHP': 'Object-oriented PHP and custom applications, including CodeIgniter — reliable back-ends tailored to real business logic.',
    'MySQL': 'Well-structured relational databases with thoughtful schema design, indexing, and query optimization.',
    'REST APIs': 'Clean, well-documented REST APIs with authentication, validation, and rate limiting for safe, scalable integrations.',
    'Authentication': 'Secure auth flows with JWT, OAuth, and Laravel Sanctum — protecting users and data the right way.',
    'Admin Panels': 'Custom admin dashboards with full CRUD and role-based access so teams can manage everything from one place.',
    'WordPress': 'Custom themes, plugins, and WooCommerce builds — flexible WordPress sites that are fast and easy to manage.',
    'WooCommerce': 'Complete online stores with WooCommerce — products, payments, and extensions configured to sell.',
    'Netlify': 'Modern deployment on Netlify with CI/CD, custom domains, and HTTPS for fast, reliable hosting.',
    'GitHub': 'Version control and team collaboration with Git and GitHub — clean history, branches, and pull requests.',
    'Custom Plugins': 'Bespoke WordPress plugins in PHP that add exactly the functionality a project needs.',
    'Web Hosting': 'End-to-end hosting setup — cPanel, SSL, and DNS — configured for performance and uptime.',
    'Virtual Assistant': 'Reliable VA support: email management, scheduling, customer support, and day-to-day admin handled for you.',
    'Real Estate Listing': 'MLS and property listing management with accurate data and compelling, well-formatted descriptions.',
    'Product Listing': 'SEO-optimized product uploads for Amazon, eBay, Shopify, and WooCommerce that turn browsers into buyers.',
    'GoHighLevel': 'GoHighLevel CRM setup — funnels, pipelines, and automations that capture and nurture leads on autopilot.',
    'SEO Optimization': 'On-page SEO, schema markup, and Core Web Vitals improvements that grow organic traffic and rankings.',
    'AI Photo Design': 'AI-enhanced visuals — background removal, color grading, and creative compositing for standout brand imagery.'
  };

  const mIcon = qs('#smIcon'), mRarity = qs('#smRarity'), mTitle = qs('#smTitle'),
        mDesc = qs('#smDesc'), mLevel = qs('#smLevel'), mPercent = qs('#smPercent'),
        mFill = qs('#smFill'), mClose = qs('#smClose');
  let lastFocused = null;

  const open = (card) => {
    const iconEl   = qs('.pc-icon', card);
    const rarityEl = qs('.pc-rarity', card);
    const power    = card.dataset.power || qs('.pc-power-fill', card)?.dataset.width || '';

    const name = qs('h4', card)?.textContent.trim() || '';
    mIcon.innerHTML   = iconEl ? iconEl.innerHTML : '';
    mTitle.textContent = name;
    mDesc.textContent  = SKILL_DESC[name] || qs('p', card)?.textContent || '';
    mLevel.textContent = qs('.pc-level', card)?.textContent || '';

    mRarity.className = 'sm-rarity';
    if (rarityEl) {
      mRarity.textContent = rarityEl.textContent.trim();
      if (rarityEl.classList.contains('pc-rarity-epic'))      mRarity.classList.add('sm-rarity-epic');
      if (rarityEl.classList.contains('pc-rarity-legendary')) mRarity.classList.add('sm-rarity-legendary');
      mRarity.style.display = '';
    } else {
      mRarity.style.display = 'none';
    }

    mPercent.textContent = power ? power + '%' : '';
    mFill.style.width = '0';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lastFocused = document.activeElement;
    requestAnimationFrame(() => { if (power) mFill.style.width = power + '%'; });
    mClose?.focus();
  };

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  };

  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('skill-modal-backdrop') || e.target.closest('#smClose')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
})();

/* ===== CUSTOM CURSOR ===== */
const cursorDot  = qs('#cursorDot');
const cursorRing = qs('#cursorRing');
if (cursorDot && cursorRing) {
  let rx = 0, ry = 0;
  document.addEventListener('pointermove', e => {
    cursorDot.style.transform  = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    rx += (e.clientX - rx) * 0.14;
    ry += (e.clientY - ry) * 0.14;
    cursorRing.style.transform = `translate3d(calc(${rx}px - 50%), calc(${ry}px - 50%), 0)`;
  });
  // Smooth ring follow via RAF
  (function rafFollow() {
    requestAnimationFrame(rafFollow);
  })();

  qsa('a, button, .magnetic, .sp-tab, .svc-tab, .nav-link, .proj-card, .price-card, .svc-card, .desk-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

/* ===== SCROLL PROGRESS ===== */
const scrollBar = qs('#scroll-progress');
window.addEventListener('scroll', () => {
  if (!scrollBar) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
}, { passive: true });

/* ===== HEADER SCROLL STATE ===== */
const header = qs('#header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ===== BACK TO TOP ===== */
const btt = qs('#backToTop');
window.addEventListener('scroll', () => {
  if (!btt) return;
  btt.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });
btt?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== MOBILE NAVIGATION ===== */
const navToggle    = qs('#navToggle');
const mobileMenu   = qs('#mobileMenu');
const mobileClose  = qs('#mobileClose');

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('is-open');
  navToggle?.classList.add('is-open');
  navToggle?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('is-open');
  navToggle?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
navToggle?.addEventListener('click', openMobileMenu);
mobileClose?.addEventListener('click', closeMobileMenu);
qsa('.nav-mobile-link, .nav-mobile-cta', mobileMenu).forEach(a => {
  a.addEventListener('click', closeMobileMenu);
});

/* ===== TYPEWRITER ===== */
const typewriterEl = qs('#typewriter');
const words = [
  'Full Stack Developer',
  'Laravel Developer',
  'React Developer',
  'WordPress Expert',
  'Angular Developer',
  'API Integration Expert',
];
let wIdx = 0, cIdx = 0, isDel = false;
function typeWrite() {
  if (!typewriterEl) return;
  const word = words[wIdx];
  typewriterEl.textContent = word.substring(0, cIdx);
  if (isDel) { cIdx--; } else { cIdx++; }
  let speed = isDel ? 80 : 160;
  if (!isDel && cIdx === word.length)   { speed = 2200; isDel = true; }
  else if (isDel && cIdx === 0)          { isDel = false; wIdx = (wIdx + 1) % words.length; speed = 350; }
  setTimeout(typeWrite, speed);
}
typeWrite();

/* ===== HERO SPOTLIGHT ===== */
const spotlight = qs('#heroSpotlight');
const heroSection = qs('#home');
if (spotlight && heroSection) {
  heroSection.addEventListener('pointermove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    spotlight.style.left = `${e.clientX - rect.left}px`;
    spotlight.style.top  = `${e.clientY - rect.top}px`;
  });
}

/* ===== PARALLAX ===== */
window.addEventListener('pointermove', (e) => {
  const mx = (e.clientX / window.innerWidth  - 0.5);
  const my = (e.clientY / window.innerHeight - 0.5);
  document.documentElement.style.setProperty('--mx', `${mx * 14}px`);
  document.documentElement.style.setProperty('--my', `${my * 14}px`);
  qsa('[data-parallax]').forEach(el => {
    const s = parseFloat(el.dataset.parallax) || 10;
    el.style.transform = `translate3d(${mx * s}px,${my * s}px,0)`;
  });
});

/* ===== ACTIVE NAV LINK ===== */
const navLinks = qs('#navLinks');
const sections = qsa('main section[id]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      qsa('.nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
sections.forEach(sec => navObserver.observe(sec));

/* ===== PROJECT DATA ===== */
const featuredProjects = [
  {
    name: 'OmniReferral',
    category: 'Laravel / SaaS',
    image: 'assets/images/projects/omnireferral-logo.webp',
    fallback: 'assets/images/projects/omnireferral-logo.webp',
    link: 'https://omnireferral.us',
    tech: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
    description: 'High-performance SaaS referral management system handling thousands of leads with automated commission tracking.',
    problem: 'Complex referral and commission logic scattered across manual spreadsheets.',
    result: 'Scalable Laravel backend with clean admin dashboard, real-time tracking, and 40% faster lead processing.',
  },
  {
    name: 'iProply',
    category: 'Real Estate CRM',
    image: 'assets/images/projects/iproply-logo.webp',
    fallback: 'assets/images/projects/iproply-logo.webp',
    link: 'https://iproply.com',
    tech: ['Laravel', 'PHP', 'MySQL', 'JavaScript'],
    description: 'Real estate CRM with property management, lead distribution, and automated client follow-ups.',
    problem: 'Agents juggling multiple tools for listings, leads, and follow-up communications.',
    result: 'Unified dashboard reducing response time by 60% and improving lead conversion.',
  },
  {
    name: 'Company Hub',
    category: 'Angular Application',
    image: 'assets/images/projects/softoteam.png',
    fallback: 'assets/images/projects/softoteam.png',
    link: 'https://github.com/SoftoSol/SoftoTeam-web',
    tech: ['Angular', 'TypeScript', 'Bootstrap', 'REST API'],
    description: 'Internal team collaboration suite with HR management, task tracking, and real-time updates.',
    problem: 'Teams relying on email and spreadsheets for HR and task coordination.',
    result: 'Shared workspace that reduced meeting overhead and improved cross-team visibility.',
  },
  {
    name: 'Open Referral',
    category: 'WordPress',
    image: 'assets/images/projects/OpenReferral.png',
    fallback: 'assets/images/projects/OpenReferral.png',
    link: 'https://openreferral.us',
    tech: ['WordPress', 'PHP', 'MySQL', 'JavaScript'],
    description: 'Referral marketing platform with dynamic form flows and automated lead capture.',
    problem: 'No clean, branded entry point for capturing and managing referrals.',
    result: 'Lightweight WordPress funnel that improved referral submission rates significantly.',
  },
  {
    name: 'Quiz By Rauf',
    category: 'Angular App',
    image: 'assets/images/projects/QuizByRauf.png',
    fallback: 'assets/images/projects/QuizByRauf.webp',
    link: 'https://quiz-by-rauf.vercel.app/home',
    tech: ['Angular', 'TypeScript', 'Firebase'],
    description: 'Interactive quiz application with dynamic questions, live scoring, and smooth animations.',
    problem: 'Needed a fast, engaging quiz experience with immediate real-time feedback.',
    result: 'Smooth quiz flow deployed on Vercel with near-instant score calculations.',
  },
  {
    name: 'Shooter Game',
    category: 'JavaScript Game',
    image: 'assets/images/projects/shooter_game.png',
    fallback: 'assets/images/projects/shooter_game.webp',
    link: 'https://shootergame-raufokz.netlify.app',
    tech: ['HTML', 'CSS', 'JavaScript', 'Canvas'],
    description: 'Browser-based arcade shooter with keyboard controls, score tracking, and fast Canvas rendering.',
    problem: 'Needed a playful proof of JavaScript game logic, collision detection, and responsive interaction.',
    result: 'A lightweight mini-game that adds personality to the portfolio and proves interactive front-end skills.',
  },
];

const allProjects = [
  ...featuredProjects,
  { name: 'Axis Referral',      category: 'WordPress',   image: 'assets/images/projects/AxisReferral.webp',         fallback: 'assets/images/projects/AxisReferral.webp',         link: 'https://axisreferral.com',                          tech: ['WordPress', 'PHP', 'MySQL'],        description: 'Custom referral marketing site for a financial services brand.' },
  { name: 'Trufijo',            category: 'WordPress',   image: 'assets/images/projects/Trufijo.png',               fallback: 'assets/images/projects/Trufijo.png',               link: 'https://tufijo.com',                                tech: ['WordPress', 'Elementor'],           description: 'Bilingual business website with Elementor and custom theme.' },
  { name: 'Seven Tech LLC',     category: 'WordPress',   image: 'assets/images/projects/seventechllc.webp',         fallback: 'assets/images/projects/seventechllc.webp',         link: 'https://seventechllc.com',                          tech: ['WordPress', 'PHP'],                 description: 'Tech company website with service pages and contact integration.' },
  { name: 'Deals Down',         category: 'WordPress',   image: 'assets/images/projects/DealsDown_Logo.png',        fallback: 'assets/images/projects/DealsDown_Logo.png',        link: 'https://dealsdown.com',                             tech: ['WordPress', 'WooCommerce'],         description: 'Deal aggregator platform built on WordPress and WooCommerce.' },
  { name: 'One Church United',  category: 'Laravel',     image: 'assets/images/projects/onechurchunited.webp',      fallback: 'assets/images/projects/onechurchunited.webp',      link: 'https://onechurchuniteddmv.com',                    tech: ['Laravel', 'PHP', 'MySQL'],          description: 'Church community management platform with events and donor tools.' },
  { name: 'Strong Enough To Break', category: 'Laravel', image: 'assets/images/projects/strongenoughtobreak31.webp',fallback: 'assets/images/projects/strongenoughtobreak31.webp',link: 'https://strongenoughtobreak31.com',                  tech: ['Laravel', 'PHP'],                   description: 'Motivational brand website with custom Laravel backend.' },
  { name: 'Attendance System',  category: 'Laravel',     image: 'assets/images/projects/attendance_ms.png',         fallback: 'assets/images/projects/attendance_ms.png',         link: 'https://github.com/raufokz/attendance-system',      tech: ['Laravel', 'PHP', 'MySQL', 'Chart.js'], description: 'Employee attendance management system with analytics dashboard.' },
  { name: 'Capital Education System', category: 'JavaScript', image: 'assets/images/projects/capitaledusystem.png', fallback: 'assets/images/projects/capitaledusystem.webp',     link: 'https://capital-education-system.netlify.app',      tech: ['HTML', 'CSS', 'JavaScript'],        description: 'Educational system web app with course listings and student portal.' },
  { name: 'Company Hub CRM',    category: 'CRM',         image: 'assets/images/perfex_crm.png',                     fallback: 'assets/images/projects/private.jpeg',             link: 'https://github.com/arham-anees/perfex-crm',         tech: ['Perfex CRM', 'PHP', 'MySQL'],       description: 'CRM customization workspace for teams, client records, and operational follow-ups.' },
  { name: 'Azure Heights Hotel',category: 'JavaScript',  image: 'assets/images/projects/azure.png',                 fallback: 'assets/images/projects/azure.png',                 link: 'https://azure-hotel.netlify.app',                   tech: ['HTML', 'CSS', 'JavaScript'],        description: 'Elegant hotel booking UI with room gallery and contact forms.' },
  { name: 'Lelameid',           category: 'JavaScript',  image: 'assets/images/projects/lelameid.svg',              fallback: 'assets/images/projects/lelameid.svg',              link: 'https://lelameid.netlify.app',                      tech: ['HTML', 'CSS', 'JavaScript'],        description: 'Creative branding and portfolio microsite.' },
  { name: 'Perfex CRM Setup',   category: 'CRM',         image: 'assets/images/projects/private.jpeg',              fallback: 'assets/images/projects/private.jpeg',              link: 'https://github.com/arham-anees/perfex-crm',         tech: ['Perfex CRM', 'PHP', 'MySQL'],       description: 'Custom Perfex CRM modules, workflow automation, and white-label setup.' },
];

/* ===== PROJECT CARD HTML ===== */
function projCardHtml(p) {
  const isRepo = p.link.includes('github.com');
  return `
  <article class="proj-card" role="article">
    <div class="proj-card-img">
      <img src="${p.image}" data-fallback="${p.fallback}" alt="${p.name} — ${p.category} project by Abdur Rauf" loading="lazy" width="280" height="160">
      <div class="proj-card-overlay" aria-hidden="true">
        <a class="proj-overlay-btn" href="${p.link}" target="_blank" rel="noopener noreferrer">${isRepo ? 'View Repo' : 'Live Site'}</a>
      </div>
    </div>
    <div class="proj-card-body">
      <div class="proj-cat">${p.category}</div>
      <h4>${p.name}</h4>
      ${p.description ? `<p>${p.description}</p>` : '<p>&nbsp;</p>'}
      <div class="proj-tech-tags">${p.tech.map(t => `<span class="proj-tech">${t}</span>`).join('')}</div>
    </div>
  </article>`;
}

/* ===== FEATURED SLIDER ===== */
const featured = {
  idx: 0,
  slides: [],
  track: qs('#featuredTrack'),
  dotsWrap: qs('#featuredDots'),
  progressBar: qs('#featuredProgressBar'),
  viewport: qs('#featuredViewport'),
  timer: null,
};

function buildFeatured() {
  if (!featured.track || !featured.dotsWrap) return;
  featuredProjects.forEach((p, i) => {
    const isRepo = p.link.includes('github.com');
    const slide = document.createElement('div');
    slide.className = 'feat-slide';
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-label', p.name);
    slide.innerHTML = `
      <div class="feat-img">
        <img src="${p.image}" data-fallback="${p.fallback}" alt="${p.name} — ${p.category} project" loading="lazy" width="900" height="500">
      </div>
      <div class="feat-info">
        <span class="feat-cat">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="feat-case">
          <div class="feat-case-item"><strong>Problem</strong><p>${p.problem}</p></div>
          <div class="feat-case-item"><strong>Result</strong><p>${p.result}</p></div>
        </div>
        <div class="feat-tags">${p.tech.map(t => `<span class="feat-tag">${t}</span>`).join('')}</div>
        <div class="feat-actions">
          <a class="btn-primary btn btn-sm magnetic" href="${p.link}" target="_blank" rel="noopener noreferrer">
            View Project
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <a class="btn-outline btn btn-sm magnetic" href="${p.link}" target="_blank" rel="noopener noreferrer">${isRepo ? 'View Repo' : 'Live Demo'}</a>
        </div>
      </div>`;
    featured.track.appendChild(slide);
    featured.slides.push(slide);

    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to ${p.name}`);
    dot.addEventListener('click', () => goToFeatured(i));
    featured.dotsWrap.appendChild(dot);
  });
  goToFeatured(0);
  startFeaturedTimer();
}

function goToFeatured(i) {
  featured.idx = (i + featured.slides.length) % featured.slides.length;
  if (featured.track) featured.track.style.transform = `translateX(-${featured.idx * 100}%)`;
  featured.slides.forEach((s, idx) => s.classList.toggle('is-active', idx === featured.idx));
  qsa('button', featured.dotsWrap).forEach((d, idx) => d.classList.toggle('active', idx === featured.idx));
  resetFeaturedProgress();
}

function resetFeaturedProgress() {
  if (!featured.progressBar) return;
  featured.progressBar.style.animation = 'none';
  void featured.progressBar.offsetWidth;
  featured.progressBar.style.animation = 'featuredProgress 5s linear forwards';
}

function startFeaturedTimer() {
  if (featured.timer) clearInterval(featured.timer);
  featured.timer = setInterval(() => goToFeatured(featured.idx + 1), 5000);
}

buildFeatured();

qs('#featuredNext')?.addEventListener('click', () => { clearInterval(featured.timer); goToFeatured(featured.idx + 1); startFeaturedTimer(); });
qs('#featuredPrev')?.addEventListener('click', () => { clearInterval(featured.timer); goToFeatured(featured.idx - 1); startFeaturedTimer(); });

if (featured.viewport) {
  let startX = 0;
  featured.viewport.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  featured.viewport.addEventListener('pointerup', (e) => {
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 50) { clearInterval(featured.timer); goToFeatured(featured.idx + (delta < 0 ? 1 : -1)); startFeaturedTimer(); }
  });
}

/* ===== THREE PROJECT MARQUEE ROWS ===== */
function buildMarqueeRows() {
  const row1 = qs('#projRow1');
  const row2 = qs('#projRow2');
  const row3 = qs('#projRow3');
  if (!row1 || !row2 || !row3) return;

  const third = Math.ceil(allProjects.length / 3);
  const slice1 = allProjects.slice(0, third);
  const slice2 = allProjects.slice(third, third * 2);
  const slice3 = allProjects.slice(third * 2);

  // Each row is duplicated for infinite scroll
  const makeHtml = (arr) => arr.map(p => projCardHtml(p)).join('');
  row1.innerHTML = makeHtml(slice1) + makeHtml(slice1);
  row2.innerHTML = makeHtml(slice2) + makeHtml(slice2);
  row3.innerHTML = makeHtml(slice3) + makeHtml(slice3);
}
buildMarqueeRows();

/* ===== PROJECT FILTERS (category sections) ===== */
function buildProjectFilters() {
  const filterWrap = qs('#projectFilters');
  if (!filterWrap) return;
  const categories = ['All', 'Laravel', 'WordPress', 'Angular', 'JavaScript', 'CRM'];
  filterWrap.innerHTML = categories.map(c =>
    `<button class="proj-filter${c === 'All' ? ' active' : ''}" data-filter="${c.toLowerCase()}" aria-pressed="${c === 'All'}">${c}</button>`
  ).join('');

  filterWrap.addEventListener('click', e => {
    const btn = e.target.closest('.proj-filter');
    if (!btn) return;
    qsa('.proj-filter', filterWrap).forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    const v = btn.dataset.filter;
    // Filter the marquee rows by pausing / showing
    const rows = qs('#projectMarquees');
    if (!rows) return;
    if (v === 'all') {
      buildMarqueeRows();
    } else {
      // Show all rows but build them from filtered data
      const filtered = allProjects.filter(p => p.category.toLowerCase().includes(v));
      if (filtered.length === 0) return;
      const row1 = qs('#projRow1');
      const row2 = qs('#projRow2');
      const row3 = qs('#projRow3');
      const html = filtered.map(p => projCardHtml(p)).join('');
      if (row1) row1.innerHTML = html + html;
      if (row2) row2.innerHTML = html + html;
      if (row3) row3.innerHTML = html + html;
    }
  });
}
buildProjectFilters();

/* ===== REVIEWS ===== */
function buildReviews() {
  const reviewsData = [
    { name: 'Tony S.',    project: 'Website Design & Upkeep',          stars: 5, text: 'Abdur is a great freelancer. This is my second project with him. Look forward to the continued relationship.' },
    { name: 'Tony S.',    project: 'Ongoing Web Design & Maintenance',  stars: 5, text: 'Abdur is an outstanding professional who created an exceptional website for me. Highly responsive, efficient, and committed throughout. Exceeded every expectation.' },
    { name: 'Frank U.',   project: 'Custom Design Work',               stars: 5, text: 'Abdur was spot on and fast to make changes. Exactly what I was looking for. Professional, clear communication, and quality output.' },
    { name: 'Saeed A.',   project: 'GitHub / Logo Design',             stars: 5, text: 'Good guy to work with. Delivered on time and exactly as briefed. Very professional and easy to communicate with.' },
    { name: 'Alyssamoe', project: 'Vintage Blues Band Logo',           stars: 5, text: 'Very talented and prompt. Understood my brief perfectly and delivered creative, polished results I was very happy with.' },
    { name: 'Ayan H.',    project: 'Sales-Boosting Branding',          stars: 5, text: 'Working with Abdur R. has been a great experience. Very talented, creative, and pays close attention to detail. Excellent communication. Delivered exactly what I envisioned. Would definitely hire again.' },
  ];

  const track = qs('#reviewTrack');
  const dotsWrap = qs('#reviewDots');
  if (!track || !dotsWrap) return;

  const starsHtml = (n) => '★'.repeat(n);
  track.innerHTML = reviewsData.map((r, i) => `
    <div class="review-card" role="tabpanel" aria-label="Review from ${r.name}">
      <div class="stars" aria-label="${r.stars} out of 5 stars">${starsHtml(r.stars)}</div>
      <p class="review-text">${r.text}</p>
      <div class="review-author">
        <strong>${r.name}</strong>
        <span>${r.project}</span>
      </div>
    </div>`).join('');

  dotsWrap.innerHTML = reviewsData.map((_, i) =>
    `<button aria-label="Review ${i + 1}" class="${i === 0 ? 'active' : ''}"></button>`
  ).join('');

  let rIdx = 0;
  const goToReview = (i) => {
    rIdx = (i + reviewsData.length) % reviewsData.length;
    track.style.transform = `translateX(-${rIdx * 100}%)`;
    qsa('button', dotsWrap).forEach((b, idx) => b.classList.toggle('active', idx === rIdx));
    clearInterval(window._reviewTimer);
    window._reviewTimer = setInterval(() => goToReview(rIdx + 1), 5000);
  };

  qsa('button', dotsWrap).forEach((btn, i) => btn.addEventListener('click', () => goToReview(i)));

  // Swipe
  const outer = qs('#reviewCarousel');
  if (outer) {
    let sX = 0;
    outer.addEventListener('pointerdown', e => { sX = e.clientX; });
    outer.addEventListener('pointerup', e => { const d = e.clientX - sX; if (Math.abs(d) > 50) goToReview(rIdx + (d < 0 ? 1 : -1)); });
  }
  goToReview(0);
}
buildReviews();

/* ===== ANIMATED COUNTERS ===== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    counterObserver.unobserve(el);
    const target = parseFloat(el.dataset.counterTarget);
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = target >= 1000 ? Math.floor(target * eased).toLocaleString() : Math.floor(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.3 });
qsa('.counter').forEach(el => counterObserver.observe(el));

/* ===== SUPERPOWER BAR ANIMATIONS ===== */
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    qsa('.pc-power-fill', entry.target).forEach(bar => {
      bar.style.width = `${bar.dataset.width}%`;
    });
  });
}, { threshold: 0.1 });
qsa('.sp-panel').forEach(panel => skillBarObserver.observe(panel));

/* ===== SUPERPOWER TABS ===== */
const skillTabs   = qsa('.sp-tab');
const skillPanels = qsa('.sp-panel');
skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    skillTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    skillPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panelId = `sp-panel-${tab.dataset.tab.replace('sp-', '')}`;
    const panel = qs(`#${panelId}`);
    if (panel) {
      panel.classList.add('active');
      qsa('.pc-power-fill', panel).forEach(bar => {
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = `${bar.dataset.width}%`; }, 50);
      });
    }
  });
});
setTimeout(() => {
  qsa('#sp-panel-frontend .pc-power-fill').forEach(bar => { bar.style.width = `${bar.dataset.width}%`; });
}, 300);

/* ===== SERVICE CARDS — inject "Learn more →" on each card ===== */
qsa('.svc-card').forEach(card => {
  const link = document.createElement('a');
  link.href = '#contact';
  link.className = 'svc-more';
  link.setAttribute('aria-label', 'Inquire about this service');
  link.innerHTML = 'Learn more <span aria-hidden="true">→</span>';
  card.appendChild(link);
});

/* ===== SERVICES TABS FILTER ===== */
const svcTabs  = qsa('.svc-tab');
const svcCards = qsa('.svc-card');
svcTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    svcTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const cat = tab.dataset.svc;
    svcCards.forEach(card => {
      if (cat === 'all' || card.dataset.svcCat === cat) {
        card.classList.remove('svc-hidden');
      } else {
        card.classList.add('svc-hidden');
      }
    });
  });
});

/* ===== REVEAL ANIMATIONS ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.08 });
qsa('.reveal, .reveal-fade').forEach(el => revealObserver.observe(el));

/* ===== STAT CARD PROGRESS BARS ===== */
const statCardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    statCardObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });
qsa('.stat-card').forEach(el => statCardObserver.observe(el));

/* ===== TILT EFFECT ===== */
qsa('.tilt').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const dx = (x - 0.5) * 10;
    const dy = (y - 0.5) * 10;
    card.style.transform = `perspective(800px) rotateX(${-dy}deg) rotateY(${dx}deg) translateZ(4px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

/* ===== MAGNETIC BUTTONS ===== */
qsa('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate3d(${x * 0.22}px,${y * 0.22}px,0)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ===== PRICING TOGGLE ===== */
qs('.pricing-toggle')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.pricing-opt');
  if (!btn) return;
  qsa('.pricing-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const billing = btn.dataset.billing;
  qsa('.price-num').forEach(pv => {
    const projectPrice = pv.dataset.projectPrice;
    const monthlyPrice = pv.dataset.monthlyPrice;
    const val = billing === 'monthly' ? monthlyPrice : projectPrice;
    const suffix = val.includes('/hr') ? '/hr' : '+';
    const numPart = val.replace(/[^0-9]/g, '');
    const isPeriod = val.includes('/hr');
    pv.innerHTML = `<span class="accent">$</span>${numPart}<span style="font-size:1rem;font-weight:500;color:var(--text-3)">${suffix}</span>`;
    const periodEl = pv.nextElementSibling;
    if (periodEl && periodEl.classList.contains('price-period')) {
      periodEl.textContent = billing === 'monthly' ? (isPeriod ? 'per hour' : 'per month') : (isPeriod ? 'starting rate' : 'per project');
    }
  });
});

/* ===== CONTACT FORM ===== */
const contactForm = qs('#contactForm');
const submitBtn   = qs('#submitBtn');
const formStatus  = qs('#formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="uil uil-spinner-alt" style="animation:spin 1s linear infinite"></i> Sending...';
    formStatus.className = 'form-status';
    formStatus.textContent = '';
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        formStatus.className = 'form-status success';
        formStatus.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
        contactForm.reset();
      } else {
        throw new Error('Failed');
      }
    } catch {
      formStatus.className = 'form-status error';
      formStatus.textContent = '✕ Something went wrong. Please email me directly at raufabdur886@gmail.com';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="uil uil-telegram-alt"></i> Send Project Request';
    }
  });
}

/* ===== TECH ICON CDN MAPPING ===== */
const DEVICONS = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
const techIconMap = {
  'assets/images/tech/laravel.svg':    `${DEVICONS}laravel/laravel-original.svg`,
  'assets/images/tech/php.svg':        `${DEVICONS}php/php-original.svg`,
  'assets/images/tech/react.svg':      `${DEVICONS}react/react-original.svg`,
  'assets/images/tech/angular.svg':    `${DEVICONS}angularjs/angularjs-original.svg`,
  'assets/images/tech/wordpress.svg':  `${DEVICONS}wordpress/wordpress-original.svg`,
  'assets/images/tech/javascript.svg': `${DEVICONS}javascript/javascript-original.svg`,
  'assets/images/tech/typescript.svg': `${DEVICONS}typescript/typescript-original.svg`,
  'assets/images/tech/mysql.svg':      `${DEVICONS}mysql/mysql-original.svg`,
  'assets/images/tech/html.svg':       `${DEVICONS}html5/html5-original.svg`,
  'assets/images/tech/css.svg':        `${DEVICONS}css3/css3-original.svg`,
  'assets/images/tech/bootstrap.svg':  `${DEVICONS}bootstrap/bootstrap-original.svg`,
  'assets/images/tech/tailwind.svg':   `${DEVICONS}tailwindcss/tailwindcss-original.svg`,
  'assets/images/tech/github.svg':     `${DEVICONS}github/github-original.svg`,
  'assets/images/tech/firebase.svg':   `${DEVICONS}firebase/firebase-original.svg`,
  'assets/images/tech/woocommerce.svg':`${DEVICONS}woocommerce/woocommerce-original.svg`,
  'assets/images/tech/rest-api.svg':   `${DEVICONS}fastapi/fastapi-original.svg`,
  'assets/images/tech/perfex.svg':     `${DEVICONS}php/php-original.svg`,
  'assets/images/tech/gohighlevel.svg':`${DEVICONS}javascript/javascript-original.svg`,
  'assets/images/tech/elementor.svg':  `${DEVICONS}wordpress/wordpress-original.svg`,
};
qsa('img[src^="assets/images/tech/"]').forEach(img => {
  const mapped = techIconMap[img.getAttribute('src')];
  if (mapped) img.src = mapped;
});

/* ===== IMAGE FALLBACKS ===== */
qsa('img[data-fallback]').forEach(img => {
  img.addEventListener('error', () => {
    const fb = img.getAttribute('data-fallback');
    if (fb && img.src !== fb) img.src = fb;
  }, { once: true });
});

/* ===== KEYFRAME for progress bar ===== */
const style = document.createElement('style');
style.textContent = `
  @keyframes featuredProgress {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

/* ===== JOURNEY ROCKET (scroll-driven) ===== */
const journeyMap    = qs('#journeyMap');
const journeyRocket = qs('#journeyCart');
if (journeyMap && journeyRocket) {
  const jObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    const track = () => {
      const rect = journeyMap.getBoundingClientRect();
      const progress = Math.min(Math.max((-rect.top) / (rect.height - window.innerHeight * 0.5), 0), 1);
      journeyRocket.style.top = `${progress * 90}%`;
    };
    track();
    window.addEventListener('scroll', track, { passive: true });
  }, { threshold: 0.01 });
  jObserver.observe(journeyMap);
}
