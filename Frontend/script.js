/* ─────────── script.js ─────────── */
'use strict';

// ══════════════════════════════════════
// NAVBAR: scroll + hamburger
// ══════════════════════════════════════
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active link highlight
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

const highlightNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  allNavLinks.forEach(a => {
    a.classList.toggle('active-nav', a.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });

// ══════════════════════════════════════
// HERO: Particles
// ══════════════════════════════════════
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = [
    'rgba(16,185,129,0.6)',
    'rgba(245,200,66,0.5)',
    'rgba(52,211,153,0.4)',
    'rgba(14,165,233,0.3)',
  ];

  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      bottom: -20px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ══════════════════════════════════════
// HERO: Progress bar animation
// ══════════════════════════════════════
const progressFill = document.getElementById('progressFill');
setTimeout(() => {
  if (progressFill) progressFill.style.width = '85%';
}, 400);

// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════
const revealElements = document.querySelectorAll(
  '.project-card, .timeline-card, .skill-category, .about-card, .about-text-section, .contact-card, .contact-scroll, .section-header'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// ══════════════════════════════════════
// SKILLS: Click → Show Projects
// ══════════════════════════════════════
const skillProjectMap = {
  python:       ['GitHub Repo Assistant', 'Customer Churn Prediction', 'ANPR Pipeline'],
  java:         ['Academic coursework'],
  c:            ['Academic coursework'],
  sql:          ['Customer Churn Prediction'],
  ml:           ['Customer Churn Prediction', 'ANPR Pipeline'],
  scikitlearn:  ['Customer Churn Prediction'],
  pandas:       ['Customer Churn Prediction'],
  cv:           ['ANPR Pipeline'],
  nlp:          ['GitHub Repo Assistant (LLM)'],
  yolo:         ['ANPR Pipeline'],
  llm:          ['GitHub Repo Assistant'],
  react:        ['GitHub Repo Assistant', 'ViBe (OSS contribution)'],
  typescript:   ['GitHub Repo Assistant', 'Vicharanashala monorepo (OSS)'],
  nodejs:       ['ViBe — Vicharanashala (OSS)'],
  fastapi:      ['GitHub Repo Assistant'],
  html:         ['Portfolio', 'Phishing Detection Extension'],
  tailwind:     ['GitHub Repo Assistant'],
  git:          ['All Projects — version control'],
  linux:        ['Development environment'],
  mongodb:      ['ViBe — Vicharanashala (OSS)'],
  opencv:       ['ANPR Pipeline'],
};

const skillChips  = document.querySelectorAll('.skill-chip');
const skillPopup  = document.getElementById('skillPopup');
const popupName   = document.getElementById('popupSkillName');
const popupProjects = document.getElementById('popupProjects');
const popupClose  = document.getElementById('popupClose');

skillChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const key = chip.dataset.skill;
    const projects = skillProjectMap[key] || ['No project data available'];
    const label = chip.querySelector('.chip-icon').textContent + ' ' +
                  chip.childNodes[1].textContent.trim();

    // Deactivate others
    skillChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    popupName.textContent = label;
    popupProjects.innerHTML = projects
      .map(p => `<span class="popup-project-tag">${p}</span>`)
      .join('');

    skillPopup.classList.add('show');
  });
});

popupClose.addEventListener('click', () => {
  skillPopup.classList.remove('show');
  skillChips.forEach(c => c.classList.remove('active'));
});

// Close popup when clicking outside
document.addEventListener('click', (e) => {
  if (!skillPopup.contains(e.target) && !e.target.closest('.skill-chip')) {
    skillPopup.classList.remove('show');
    skillChips.forEach(c => c.classList.remove('active'));
  }
});

// ══════════════════════════════════════
// SMOOTH HOVER TILT on project cards
// ══════════════════════════════════════
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, border-color 0.3s, box-shadow 0.3s';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s, border-color 0.3s, box-shadow 0.3s';
  });
});

// ══════════════════════════════════════
// ACTIVE NAV STYLE (CSS injection)
// ══════════════════════════════════════
const style = document.createElement('style');
style.textContent = `
  .nav-link.active-nav {
    color: var(--emerald-light) !important;
    background: rgba(16,185,129,0.08) !important;
  }
`;
document.head.appendChild(style);

// ══════════════════════════════════════
// TYPING EFFECT on hero tagline
// ══════════════════════════════════════
function typeEffect(element, texts, speed = 80, pauseTime = 2000) {
  if (!element) return;
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = texts[textIndex];
    if (!isDeleting) {
      element.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, pauseTime);
        return;
      }
    } else {
      element.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }
    setTimeout(type, isDeleting ? speed / 2 : speed);
  }

  type();
}

const tagline = document.querySelector('.hero-tagline');
if (tagline) {
  const originalText = tagline.textContent;
  tagline.textContent = '';
  typeEffect(tagline, [
    'Building things. Learning fast. Ready for the real world.',
    'AI/ML meets full-stack development.',
    'From idea to deployed app — one build at a time.',
    originalText,
  ]);
}

// ══════════════════════════════════════
// COUNTER ANIMATION on hero stats
// ══════════════════════════════════════
function animateCounter(el, target, suffix = '') {
  let count = 0;
  const step  = Math.ceil(target / 40);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + suffix;
    if (count >= target) clearInterval(timer);
  }, 40);
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statValues = heroStats.querySelectorAll('.stat-value');
        const data = [
          { val: 2, suffix: '' },
          { val: 4, suffix: '+' },
          { val: 15, suffix: '+' },
          { val: 1, suffix: '' },
        ];
        statValues.forEach((el, i) => {
          if (data[i]) animateCounter(el, data[i].val, data[i].suffix);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statsObserver.observe(heroStats);
}
