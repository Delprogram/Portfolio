/**
 * PORTFOLIO IMPROVEMENTS — Fidel AHOUANHOU
 * Ajouter avant </body> :
 * <script src="portfolio-improvements.js"></script>
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. DARK / LIGHT MODE ── */
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Injecter le bouton toggle
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  toggleBtn.setAttribute('aria-label', 'Basculer le mode sombre/clair');
  toggleBtn.innerHTML = `<span class="icon">${savedTheme === 'dark' ? '☀️' : '🌙'}</span><span class="label">${savedTheme === 'dark' ? 'Clair' : 'Sombre'}</span>`;
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggleBtn.innerHTML = `<span class="icon">${next === 'dark' ? '☀️' : '🌙'}</span><span class="label">${next === 'dark' ? 'Clair' : 'Sombre'}</span>`;
  });


  /* ── 2. BADGE DISPONIBILITÉ dans le hero ── */
  const heroTitle = document.querySelector('h1');
  if (heroTitle) {
    const badge = document.createElement('div');
    badge.className = 'availability-badge';
    badge.innerHTML = `<span class="dot"></span> Disponible en alternance — Septembre 2026`;
    heroTitle.parentNode.insertBefore(badge, heroTitle);
  }


  /* ── 3. FILTRES PROJETS ── */
  const projectsSection = document.querySelector('#projets') ||
    [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Projets'));

  if (projectsSection) {
    // Récupérer toutes les cartes projet
    const cards = document.querySelectorAll('.project-card, article, .projet');

    // Si les cartes n'ont pas de classe spécifique, les identifier par structure
    const projectCards = document.querySelectorAll('section article, .projects-grid > div, .project');

    // Créer les filtres
    const filters = document.createElement('div');
    filters.className = 'project-filters';
    filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', 'Filtrer les projets par technologie');

    const technologies = ['Tous', 'Python', 'JavaScript', 'Java', 'PHP', 'Django'];

    technologies.forEach(tech => {
      const btn = document.createElement('button');
      btn.className = `filter-btn ${tech === 'Tous' ? 'active' : ''}`;
      btn.textContent = tech;
      btn.setAttribute('aria-pressed', tech === 'Tous' ? 'true' : 'false');

      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Filtrer les projets basé sur les tags de technologie
        const allProjectCards = document.querySelectorAll('.project-card');
        allProjectCards.forEach(card => {
          if (tech === 'Tous') {
            card.classList.remove('hidden');
          } else {
            const tags = card.querySelectorAll('.tag, .tech-tag, span');
            const hasTech = [...tags].some(tag =>
              tag.textContent.toLowerCase().includes(tech.toLowerCase())
            );
            card.classList.toggle('hidden', !hasTech);
          }
        });
      });

      filters.appendChild(btn);
    });

    // Insérer les filtres après le titre de la section projets
    const projectsParent = projectsSection.parentNode;
    projectsParent.insertBefore(filters, projectsSection.nextSibling);
  }


  /* ── 4. FORMULAIRE CONTACT FONCTIONNEL (Formspree) ── */
  const form = document.querySelector('form');
  if (form) {
    // Ajouter la classe et l'action Formspree
    form.classList.add('contact-form-improved');
    // IMPORTANT : Remplace YOUR_FORM_ID par ton ID Formspree après inscription sur formspree.io
    form.setAttribute('action', 'https://formspree.io/f/YOUR_FORM_ID');
    form.setAttribute('method', 'POST');

    // Ajouter les labels aux champs existants
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      const placeholder = input.getAttribute('placeholder') || input.getAttribute('name');
      if (placeholder && !input.id) {
        const id = placeholder.toLowerCase().replace(/\s+/g, '-');
        input.id = id;
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.textContent = placeholder;
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(label);
        wrapper.appendChild(input);
      }
    });

    // Message de succès
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    successMsg.textContent = '✅ Message envoyé ! Je vous répondrai rapidement.';
    form.appendChild(successMsg);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.reset();
          successMsg.classList.add('visible');
          setTimeout(() => successMsg.classList.remove('visible'), 5000);
        }
      } catch (err) {
        console.error('Erreur envoi formulaire:', err);
      }
    });
  }


  /* ── 5. LAZY LOADING SUR LES IMAGES ── */
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });


  /* ── 6. ARIA-LABELS SUR LES LIENS SOCIAUX ── */
  document.querySelectorAll('a[href*="github.com"]').forEach(link => {
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Profil GitHub de Fidel AHOUANHOU');
    }
  });

  document.querySelectorAll('a[href*="linkedin.com"]').forEach(link => {
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Profil LinkedIn de Fidel AHOUANHOU');
    }
  });


  /* ── 7. SCROLL TO TOP ── */
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-top';
  scrollBtn.setAttribute('aria-label', 'Retour en haut de page');
  scrollBtn.innerHTML = '↑';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── 8. CORRECTION TYPOS ── */
  // "Dashbord" → "Dashboard"
  document.querySelectorAll('*').forEach(el => {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
      el.textContent = el.textContent.replace('Dashbord', 'Dashboard');
    }
  });

  // "PortFolio" dans le footer → "Portfolio"
  document.querySelectorAll('h2, h3, p, footer *').forEach(el => {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
      el.textContent = el.textContent.replace('PortFolio', 'Portfolio');
    }
  });


  /* ── 9. OPEN GRAPH META TAGS ── */
  const ogTags = [
    { property: 'og:title', content: 'Fidel AHOUANHOU — Développeur Fullstack' },
    { property: 'og:description', content: 'Étudiant en Bachelor Fullstack à CODA Orléans. Python, Django, JavaScript, Java. Disponible en alternance septembre 2026.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://delprogram.github.io/Portfolio/' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'description', content: 'Portfolio de Fidel AHOUANHOU, développeur fullstack. Python, Django, JavaScript, Java, React, Angular.' }
  ];

  ogTags.forEach(tag => {
    const existing = tag.property
      ? document.querySelector(`meta[property="${tag.property}"]`)
      : document.querySelector(`meta[name="${tag.name}"]`);

    if (!existing) {
      const meta = document.createElement('meta');
      if (tag.property) meta.setAttribute('property', tag.property);
      if (tag.name) meta.setAttribute('name', tag.name);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    }
  });


  /* ── 10. MARQUER LES CARTES PROJET POUR LE FILTRE ── */
  // Ajouter data-tech aux cartes de projets basé sur leur contenu
  const projectMapping = {
    'CapAccess': ['php', 'wordpress', 'figma'],
    'MIFFA': ['python', 'django', 'javascript', 'postgresql'],
    'JsArena': ['javascript', 'python'],
    'Dashboard': ['javascript', 'python'],
    'FarmMyFarm': ['java'],
    'GALAXY': ['python']
  };

  document.querySelectorAll('h3').forEach(h3 => {
    const title = h3.textContent.trim();
    const match = Object.keys(projectMapping).find(k => title.includes(k));
    if (match) {
      const card = h3.closest('article, section, div[class*="project"], .card') || h3.parentElement;
      card.classList.add('project-card');
      card.setAttribute('data-tech', projectMapping[match].join(','));
    }
  });

});