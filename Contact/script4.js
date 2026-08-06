/* ==========================================================================
   FOND ANIMÉ — champ d'étoiles + étoiles filantes
   ========================================================================== */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

// Configuration des 3 couches d'étoiles (parallaxe)
const layers = [
    { count: 120, speed: .02, size: [.5, 1.2], opacityBase: .4 },
    { count: 80,  speed: .05, size: [1, 1.8],  opacityBase: .6 },
    { count: 40,  speed: .1,  size: [1.5, 2.5], opacityBase: .9 }
];

let stars = [];

function createStars() {
    stars = [];

    layers.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                radius: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
                baseOpacity: layer.opacityBase * (.5 + Math.random() * .5),
                twinkleSpeed: .5 + Math.random() * 1.5,
                twinklePhase: Math.random() * Math.PI * 2,
                speed: layer.speed
            });
        }
    });
}

createStars();
window.addEventListener("resize", createStars);

let shootingStars = [];

function spawnShootingStar() {
    shootingStars.push({
        x: Math.random() * w * .6,
        y: Math.random() * h * .4,
        length: 80 + Math.random() * 120,
        speed: 8 + Math.random() * 6,
        angle: Math.PI / 4 + (Math.random() * .3 - .15),
        life: 1
    });
}

setInterval(spawnShootingStar, 3500);

let time = 0;

function draw() {
    time += 0.016;
    ctx.clearRect(0, 0, w, h);

    // Étoiles fixes avec scintillement
    stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * .3 + .7;
        const opacity = star.baseOpacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.shadowColor = "rgba(180,200,255,.8)";
        ctx.shadowBlur = star.radius * 3;
        ctx.fill();
        ctx.shadowBlur = 0;

        star.y += star.speed;
        if (star.y > h) {
            star.y = 0;
            star.x = Math.random() * w;
        }
    });

    // Étoiles filantes
    shootingStars.forEach((s, index) => {
        const dx = Math.cos(s.angle) * s.length;
        const dy = Math.sin(s.angle) * s.length;

        const gradient = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
        gradient.addColorStop(0, `rgba(255,255,255,${s.life})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - dx, s.y - dy);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= .02;

        if (s.life <= 0) {
            shootingStars.splice(index, 1);
        }
    });

    requestAnimationFrame(draw);
}

draw();

/* ==========================================================================
   RÉVÉLATION AU SCROLL — en-tête, coordonnées et formulaire en cascade
   (même logique que Portfolio.js : reveal → in-view via IntersectionObserver)
   ========================================================================== */

function initContentReveal() {
    const content = document.querySelector(".content");
    const header = document.querySelector(".content-header");
    const infoList = document.querySelector(".info-list");
    const form = document.querySelector(".contact-form");
    if (!content) return;

    const items = [];
    if (header) items.push(header);
    if (infoList) items.push(...Array.from(infoList.children));
    if (form) items.push(form);

    items.forEach((item, i) => {
        item.classList.add("reveal");
        item.style.transitionDelay = `${(i % 8) * 0.07}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, { root: content, threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

    items.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", initContentReveal);
if (document.readyState !== "loading") initContentReveal();

/* ==========================================================================
   FORMULAIRE DE CONTACT — envoi via Gmail (compose pré-rempli)
   ========================================================================== */

function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const messageField = document.getElementById("message");
    const charCount = document.getElementById("charCount");
    const feedback = document.getElementById("formFeedback");

    // Compteur de caractères du message
    if (messageField && charCount) {
        messageField.addEventListener("input", () => {
            charCount.textContent = messageField.value.length;
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const emailAddress = document.getElementById("emailAddress").value.trim();
        const subjectSelect = document.getElementById("subject");
        const subjectLabel = subjectSelect.options[subjectSelect.selectedIndex]
            ? subjectSelect.options[subjectSelect.selectedIndex].text
            : "";
        const message = messageField.value.trim();

        if (!fullName || !emailAddress || !subjectSelect.value || !message) {
            if (feedback) {
                feedback.textContent = "Merci de remplir tous les champs avant d'envoyer.";
                feedback.className = "form-feedback error";
            }
            return;
        }

        const destination = "orthospacealgeria@gmail.com";
        const subjectLine = `${subjectLabel} — ${fullName}`;
        const bodyLines = [
            `Nom complet : ${fullName}`,
            `Email : ${emailAddress}`,
            "",
            message
        ].join("\n");

        // Ouvre directement Gmail (version web) avec le message pré-rempli
        const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1"
            + "&to=" + encodeURIComponent(destination)
            + "&su=" + encodeURIComponent(subjectLine)
            + "&body=" + encodeURIComponent(bodyLines);

        window.open(gmailUrl, "_blank");

        if (feedback) {
            feedback.textContent = "Gmail s'ouvre dans un nouvel onglet pour envoyer votre message.";
            feedback.className = "form-feedback success";
        }

        form.reset();
        if (charCount) charCount.textContent = "0";
    });
}

document.addEventListener("DOMContentLoaded", initContactForm);
if (document.readyState !== "loading") initContactForm();
