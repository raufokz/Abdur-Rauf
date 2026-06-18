'use strict';

(function developerStorytellingLayer() {
  const sectionStories = {
    home: {
      cards: [
        ['Angular', "ng serve --open\n@Component({ selector: 'premium-portfolio' })"],
        ['Laravel', "Route::resource('projects', ProjectController::class);\nphp artisan migrate"],
        ['JavaScript', 'const developer = "Abdur Rauf";\nconsole.log("Dream. Build. Repeat.");'],
        ['Problem Solving', 'function solveProblem() {\n  return "Build Better Solutions";\n}'],
      ],
      notes: [
        'Code Is Poetry.',
        'Make It Work.\nMake It Better.\nMake It Fast.',
      ],
    },
    projects: {
      cards: [
        ['SQL', "SELECT * FROM projects\nWHERE status = 'completed';"],
        ['API', "GET /api/projects/featured\nPOST /api/leads"],
        ['Git', 'git commit -m "Never Stop Learning"\ngit push origin portfolio'],
        ['Result', "return Project::with('results')->latest()->get();"],
      ],
      notes: [
        'Build Something People Love.',
        'Every project is a problem solved twice: once for users, once for the business.',
      ],
    },
    experience: {
      cards: [
        ['Journey', 'while (!success) {\n  learn();\n  improve();\n}'],
        ['Opportunity', 'if (opportunity) {\n  takeIt();\n}'],
        ['Career', "git log --oneline --growth\n2023 learn\n2024 ship\n2025 scale"],
        ['Focus', 'First Solve The Problem,\nThen Write The Code.'],
      ],
      notes: [
        'Stay Hungry. Stay Foolish.',
        'Small consistent commits create big career changes.',
      ],
    },
    contact: {
      cards: [
        ['Terminal', 'ssh client@next-project\nnpm run build'],
        ['Message', "curl -X POST /contact\n--data 'ready=true'"],
        ['Availability', "status --freelance\n> available within 24 hours"],
        ['Next Step', 'composer create-project laravel/idea\ncd better-solution'],
      ],
      notes: [
        'Have an idea? Ship the first version.',
        'Dream. Build. Repeat.',
      ],
    },
  };

  const placement = [
    ['6%', '15%', '-4deg', '0.34', '0s'],
    ['67%', '12%', '3deg', '0.48', '-3s'],
    ['10%', '68%', '2deg', '0.28', '-6s'],
    ['72%', '72%', '-3deg', '0.42', '-9s'],
    ['40%', '26%', '-2deg', '0.18', '-2s'],
    ['49%', '82%', '4deg', '0.25', '-5s'],
  ];

  function createLayer(section, story) {
    if (!section || section.querySelector('.developer-story-layer')) return;

    const layer = document.createElement('div');
    layer.className = 'developer-story-layer';
    layer.setAttribute('aria-hidden', 'true');

    [...story.cards, ...story.notes.map((note) => ['Note', note, true])].forEach((item, index) => {
      const [kind, text, isNote] = item;
      const [x, y, r, depth, delay] = placement[index % placement.length];
      const el = document.createElement('div');
      el.className = isNote ? 'story-note' : 'story-code-card';
      el.dataset.kind = kind;
      el.textContent = text;
      el.style.setProperty('--x', x);
      el.style.setProperty('--y', y);
      el.style.setProperty('--r', r);
      el.style.setProperty('--depth', depth);
      el.style.setProperty('--delay', delay);
      el.style.setProperty('--float', `${12 + index * 1.7}s`);
      el.style.setProperty('--story-opacity', isNote ? '0.075' : '0.065');
      el.style.setProperty('--blur', isNote ? '0.35px' : '0.55px');
      layer.appendChild(el);
    });

    for (let i = 0; i < 7; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'story-pulse-dot';
      dot.style.setProperty('--x', `${12 + ((i * 17) % 76)}%`);
      dot.style.setProperty('--y', `${18 + ((i * 23) % 64)}%`);
      dot.style.setProperty('--delay', `${i * -1.2}s`);
      dot.style.setProperty('--float', `${8 + i}s`);
      layer.appendChild(dot);
    }

    section.prepend(layer);
  }

  Object.entries(sectionStories).forEach(([id, story]) => {
    createLayer(document.getElementById(id), story);
  });

  const sectionAliases = {
    experience: document.querySelector('.timeline-section'),
  };
  if (sectionAliases.experience && !sectionAliases.experience.querySelector('.developer-story-layer')) {
    createLayer(sectionAliases.experience, sectionStories.experience);
  }

  document.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 28;
    const y = (event.clientY / window.innerHeight - 0.5) * 28;
    document.documentElement.style.setProperty('--story-mx', `${x}px`);
    document.documentElement.style.setProperty('--story-my', `${y}px`);

    document.querySelectorAll('.developer-story-layer').forEach((layer) => {
      const rect = layer.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      layer.style.setProperty('--story-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      layer.style.setProperty('--story-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
  }, { passive: true });

  let clickedSnippets = new Set();
  let toastTimer = 0;

  function showUnlockToast() {
    let toast = document.querySelector('.story-unlock-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'story-unlock-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = '<strong>Achievement Unlocked 🚀</strong><span>Developer Mode Activated</span>';
      document.body.appendChild(toast);
    }

    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
  }

  document.addEventListener('click', (event) => {
    const snippet = event.target.closest('.story-code-card, .story-note');
    if (!snippet) return;
    snippet.classList.add('is-clicked');
    clickedSnippets.add(snippet.textContent.trim());
    if (clickedSnippets.size >= 4) showUnlockToast();
  });
})();
