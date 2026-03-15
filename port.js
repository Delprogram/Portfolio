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
        const parentDiv = button.parentElement; 
        const codeDiv = parentDiv.querySelector('.code');

        description.classList.toggle("active");

        if (description.classList.contains("active")) {
            codeDiv.style.paddingBottom = '3rem'; 
            button.textContent = "Voir moins ▲";
        } else {
            codeDiv.style.paddingBottom = '';
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

emailjs.init("C6XhxCQ_8gpWb5xg4");

document.querySelector(".contactform").addEventListener("submit", function(e) {
    e.preventDefault();

    const templateParams = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
    };

    emailjs.send("service_6z8k7i9", "template_1mqtb5k", templateParams)
        .then(() => {
            alert("Message envoyé ✅");
            this.reset();
        })
        .catch((error) => {
            console.log(error);
            // alert("Erreur ❌ : " + JSON.stringify(error));
        });
});
