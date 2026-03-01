const slides = document.querySelector('.slides');
const slide = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
let index = 0;

// Création des dots
slide.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll('.dots span');

// Fonctions
function updateSlider() {
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

// Navigation
const nextBtn = document.querySelector('.arrow.right');
const prevBtn = document.querySelector('.arrow.left');

nextBtn.addEventListener('click', () => {
    index = (index + 1) % slide.length;
    updateSlider();
});

prevBtn.addEventListener('click', () => {
    index = (index - 1 + slide.length) % slide.length;
    updateSlider();
});

// Cliquer sur dot
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        index = i;
        updateSlider();
    });
});

document.querySelectorAll(".see-more").forEach(button => {
    button.addEventListener("click", () => {
        const description = button.previousElementSibling;
        const parentDiv = button.parentElement; // div directement contenant le paragraphe et le bouton
        const codeDiv = parentDiv.querySelector('.code'); // prend seulement le .code de ce slide

        description.classList.toggle("active");

        if (description.classList.contains("active")) {
            codeDiv.style.paddingBottom = '3rem'; // augmente le padding
            button.textContent = "Voir moins ▲";
        } else {
            codeDiv.style.paddingBottom = ''; // revient à la valeur initiale
            button.textContent = "Voir plus ▼";
        }
    });
});


const section = document.querySelector('.competences');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            section.classList.add('animate');
            observer.unobserve(section); 
        }
    });
}, { threshold: 0.4 });

observer.observe(section);
