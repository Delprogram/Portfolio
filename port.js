/* =========================================================
   Portfolio — Fidel AHOUANHOU
   JavaScript sans framework
   ========================================================= */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}

function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* stockage indisponible */ }
}

/* ===== Toast (petites notifications) ===== */
const toast = document.querySelector('.toast');
let toastTimer;

function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ===== Thème clair / sombre ===== */
const themeBtn = document.querySelector('.theme-toggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const dark = theme === 'dark';
    themeBtn.innerHTML = `<i class="fa-solid ${dark ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>`;
    themeBtn.setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
}

applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storageSet('theme', next);
});

/* ===== Navigation : menu mobile, section active, barre de progression ===== */
const nav = document.querySelector('header nav');
const menuBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('#menu a');

function closeMenu() {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Ouvrir le menu');
    menuBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
}

menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menuBtn.innerHTML = `<i class="fa-solid ${open ? 'fa-xmark' : 'fa-bars'}" aria-hidden="true"></i>`;
});

navLinks.forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target)) closeMenu();
});

// Met en surbrillance la section visible dans le menu
const sections = ['accueil', 'apropos', 'parcours', 'competences', 'projets', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

function updateActiveLink() {
    const line = window.scrollY + window.innerHeight * 0.35;
    let currentId = sections[0].id;
    sections.forEach(sec => {
        if (sec.getBoundingClientRect().top + window.scrollY <= line) currentId = sec.id;
    });
    navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${currentId}`;
        link.parentElement.classList.toggle('current', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
    });
}

const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
let ticking = false;

function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    backToTop.classList.toggle('visible', window.scrollY > 600);
    nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
}, { passive: true });
onScroll();

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

/* ===== Hero : halo qui suit la souris + texte animé ===== */
const header = document.querySelector('header');

header.addEventListener('mousemove', (e) => {
    const rect = header.getBoundingClientRect();
    header.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    header.style.setProperty('--my', `${e.clientY - rect.top}px`);
});

const typed = document.querySelector('.typed');
if (typed && !prefersReducedMotion) {
    const words = typed.dataset.words.split('|');
    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;

    function typeLoop() {
        const word = words[wordIndex];
        if (deleting) {
            charIndex--;
            typed.textContent = word.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(typeLoop, 40);
        } else {
            const next = words[wordIndex];
            charIndex++;
            typed.textContent = next.slice(0, charIndex);
            if (charIndex === next.length) {
                deleting = true;
                setTimeout(typeLoop, 2200);
            } else {
                setTimeout(typeLoop, 75);
            }
        }
    }
    setTimeout(typeLoop, 2500);
}

/* ===== Apparition au défilement ===== */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('visible'));
}

/* ===== Chiffres clés animés ===== */
const allCards = [...document.querySelectorAll('.slides .card')];
const autoCounts = {
    'auto-projects': allCards.length,
    'auto-skills': document.querySelectorAll('.competences li').length,
};

function animateCount(el) {
    const raw = el.dataset.count;
    const target = autoCounts[raw] ?? parseInt(raw, 10);
    if (prefersReducedMotion) {
        el.textContent = target;
        return;
    }
    const duration = 1200;
    const start = performance.now();
    function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

const statsBlock = document.querySelector('.stats');
if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            statsBlock.querySelectorAll('.stat-number').forEach(animateCount);
            statsObserver.disconnect();
        }
    }, { threshold: 0.4 });
    statsObserver.observe(statsBlock);
} else {
    statsBlock.querySelectorAll('.stat-number').forEach(animateCount);
}

/* ===== Barres de compétences ===== */
const skillsSection = document.querySelector('.competences');

if ('IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            skillsSection.classList.add('animate');
            skillsObserver.disconnect();
        }
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsSection);
} else {
    skillsSection.classList.add('animate');
}

/* ===== Projets : pages + filtres + swipe ===== */
const slidesEl = document.querySelector('.slides');
const dotsContainer = document.querySelector('.dots');
const prevBtn = document.querySelector('.arrow.left');
const nextBtn = document.querySelector('.arrow.right');
const filterBtns = document.querySelectorAll('.filter-btn');

let pageIndex = 0;
let pageCount = 1;
let currentFilter = 'all';
let currentPerPage = 0;

function perPage() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
}

function buildSlides() {
    currentPerPage = perPage();
    const visible = allCards.filter(card =>
        currentFilter === 'all' || card.dataset.tech.split(' ').includes(currentFilter));

    slidesEl.innerHTML = '';
    for (let i = 0; i < visible.length; i += currentPerPage) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        visible.slice(i, i + currentPerPage).forEach(card => slide.appendChild(card));
        slidesEl.appendChild(slide);
    }
    if (!visible.length) {
        const empty = document.createElement('div');
        empty.className = 'slide';
        empty.innerHTML = '<p class="slide-empty">Aucun projet pour ce filtre.</p>';
        slidesEl.appendChild(empty);
    }

    pageCount = slidesEl.children.length;
    pageIndex = Math.min(pageIndex, pageCount - 1);

    dotsContainer.innerHTML = '';
    for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement('span');
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', `Page de projets ${i + 1} sur ${pageCount}`);
        dot.addEventListener('click', () => goTo(i));
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goTo(i);
            }
        });
        dotsContainer.appendChild(dot);
    }

    const single = pageCount <= 1;
    dotsContainer.style.visibility = single ? 'hidden' : '';
    prevBtn.style.visibility = single ? 'hidden' : '';
    nextBtn.style.visibility = single ? 'hidden' : '';
    updateSlider();
}

function updateSlider() {
    slidesEl.style.transform = `translateX(-${pageIndex * 100}%)`;
    dotsContainer.querySelectorAll('span').forEach((dot, i) => {
        dot.classList.toggle('active', i === pageIndex);
        dot.setAttribute('aria-current', i === pageIndex ? 'true' : 'false');
    });
}

function goTo(i) {
    pageIndex = (i + pageCount) % pageCount;
    updateSlider();
}

prevBtn.addEventListener('click', () => goTo(pageIndex - 1));
nextBtn.addEventListener('click', () => goTo(pageIndex + 1));

// Flèches du clavier quand on est dans la section projets
document.querySelector('.divprojets').addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowRight') goTo(pageIndex + 1);
    if (e.key === 'ArrowLeft') goTo(pageIndex - 1);
});

// Swipe sur mobile
let touchStartX = null;
slidesEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });
slidesEl.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) goTo(delta < 0 ? pageIndex + 1 : pageIndex - 1);
    touchStartX = null;
});

// Filtres (avec le nombre de projets par techno)
filterBtns.forEach(btn => {
    const f = btn.dataset.filter;
    const count = f === 'all'
        ? allCards.length
        : allCards.filter(c => c.dataset.tech.split(' ').includes(f)).length;
    btn.insertAdjacentHTML('beforeend', ` <span class="count">${count}</span>`);

    btn.addEventListener('click', () => {
        if (f === currentFilter) return;
        currentFilter = f;
        filterBtns.forEach(b => {
            const active = b === btn;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', String(active));
        });
        pageIndex = 0;
        slidesEl.classList.add('fading');
        setTimeout(() => {
            buildSlides();
            slidesEl.classList.remove('fading');
        }, prefersReducedMotion ? 0 : 250);
    });
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (perPage() !== currentPerPage) buildSlides();
    }, 150);
});

buildSlides();

/* ===== Voir plus / Voir moins ===== */
document.querySelectorAll('.see-more').forEach(button => {
    button.addEventListener('click', () => {
        const description = button.previousElementSibling;
        const open = description.classList.toggle('active');
        button.textContent = open ? 'Voir moins ▲' : 'Voir plus ▼';
        button.setAttribute('aria-expanded', String(open));
    });
});

/* ===== Visionneuse d'images ===== */
const lightbox = document.querySelector('.lightbox');
const lbImg = lightbox.querySelector('img');
const lbTitle = lightbox.querySelector('#lightbox-title');
const lbCounter = lightbox.querySelector('.lightbox-counter');
const lbPrev = lightbox.querySelector('.lightbox-nav.prev');
const lbNext = lightbox.querySelector('.lightbox-nav.next');
let gallery = [];
let galleryIndex = 0;
let lastFocus = null;

function showImage() {
    lbImg.src = gallery[galleryIndex];
    lbImg.alt = `${lbTitle.textContent} — capture ${galleryIndex + 1}`;
    lbCounter.textContent = gallery.length > 1 ? `${galleryIndex + 1} / ${gallery.length}` : '';
    lbPrev.hidden = lbNext.hidden = gallery.length < 2;
}

function openLightbox(card) {
    gallery = card.dataset.gallery.split('|');
    galleryIndex = 0;
    lbTitle.textContent = card.querySelector('h3').textContent;
    showImage();
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
}

function stepLightbox(step) {
    galleryIndex = (galleryIndex + step + gallery.length) % gallery.length;
    showImage();
}

allCards.forEach(card => {
    const img = card.querySelector('img');
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.addEventListener('click', () => openLightbox(card));
    img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(card);
        }
    });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => stepLightbox(-1));
lbNext.addEventListener('click', () => stepLightbox(1));
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') stepLightbox(1);
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    // Garde le focus dans la visionneuse
    if (e.key === 'Tab') {
        const focusables = [...lightbox.querySelectorAll('button:not([hidden])')];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

/* ===== Copier l'email ===== */
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        try {
            await navigator.clipboard.writeText(text);
            showToast('Adresse email copiée ✅');
        } catch (e) {
            showToast(text);
        }
    });
});

/* ===== Formulaire de contact (EmailJS) ===== */
const form = document.querySelector('.contactform');
const status = form.querySelector('.form-status');
const submitBtn = form.querySelector('button[type="submit"]');
const submitLabel = submitBtn.innerHTML;
const fields = {
    name: form.elements.name,
    email: form.elements.email,
    message: form.elements.message,
};
const charCount = form.querySelector('.char-count span');

const validators = {
    name: v => v.length >= 2 || 'Indiquez votre nom (2 caractères minimum).',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Adresse email invalide.',
    message: v => v.length >= 10 || 'Votre message doit faire au moins 10 caractères.',
};

function validateField(key) {
    const input = fields[key];
    const result = validators[key](input.value.trim());
    const errorEl = document.getElementById(`${key}-error`);
    const ok = result === true;
    input.classList.toggle('invalid', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    input.setAttribute('aria-describedby', `${key}-error`);
    errorEl.textContent = ok ? '' : result;
    return ok;
}

Object.keys(fields).forEach(key => {
    fields[key].addEventListener('blur', () => {
        if (fields[key].value) validateField(key);
    });
    fields[key].addEventListener('input', () => {
        if (fields[key].classList.contains('invalid')) validateField(key);
    });
});

fields.message.addEventListener('input', () => {
    charCount.textContent = fields.message.value.length;
});

function setStatus(text, type) {
    status.textContent = text;
    status.className = `form-status ${type || ''}`;
}

if (window.emailjs) {
    emailjs.init('C6XhxCQ_8gpWb5xg4');
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const allValid = Object.keys(fields).map(validateField).every(Boolean);
    if (!allValid) {
        form.querySelector('.invalid').focus();
        return;
    }

    if (!window.emailjs) {
        setStatus('Le formulaire est indisponible. Écrivez-moi à fidelahouanhou@gmail.com', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';
    setStatus('');

    emailjs.send('service_6z8k7i9', 'template_1mqtb5k', {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        message: fields.message.value.trim(),
    })
        .then(() => {
            setStatus('Message envoyé ✅ Je vous réponds rapidement.', 'success');
            form.reset();
            charCount.textContent = '0';
        })
        .catch((error) => {
            console.error(error);
            setStatus("L'envoi a échoué. Réessayez ou écrivez-moi à fidelahouanhou@gmail.com", 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitLabel;
        });
});

/* ===== Année du footer ===== */
document.querySelector('.year').textContent = new Date().getFullYear();
