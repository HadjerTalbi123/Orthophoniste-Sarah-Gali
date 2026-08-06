/* ==========================================================================
   RÉVÉLATION AU SCROLL — sections et cartes en cascade
   ========================================================================== */

function initScrollReveal() {
    // Ajoute la classe "reveal" à chaque élément d'un groupe "stagger"
    // avec un léger délai progressif pour un effet de cascade
    document.querySelectorAll(".stagger").forEach(group => {
        const items = Array.from(group.children);
        items.forEach((item, i) => {
            item.classList.add("reveal");
            item.style.transitionDelay = `${(i % 8) * 0.07}s`;
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

window.addEventListener("load", () => {
    initScrollReveal();
});

/* ==========================================================================
   CERCLES DE PROGRESSION — langues (0% → pourcentage, au scroll)
   ========================================================================== */

function animateCircle(container) {
    const percent = parseInt(container.dataset.percent, 10) || 0;
    const progress = container.querySelector(".circle-progress");
    const label = container.querySelector(".circle-label");
    const circumference = progress.getTotalLength();

    progress.style.strokeDasharray = circumference;
    progress.style.strokeDashoffset = circumference;

    const duration = 1600;
    const start = performance.now();

    function frame(now) {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        const currentPercent = eased * percent;

        progress.style.strokeDashoffset = circumference * (1 - currentPercent / 100);
        label.textContent = Math.round(currentPercent) + "%";

        if (t < 1) {
            requestAnimationFrame(frame);
        } else {
            label.textContent = percent + "%";
            progress.style.strokeDashoffset = circumference * (1 - percent / 100);
        }
    }

    requestAnimationFrame(frame);
}

function initLangCircles() {
    const circles = document.querySelectorAll(".lang-circle");
    if (!circles.length) return;

    const circleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCircle(entry.target);
                circleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    circles.forEach(c => circleObserver.observe(c));
}

window.addEventListener("load", initLangCircles);

/* ==========================================================================
   ORBITE DES SPÉCIALITÉS — pause uniquement au survol d'une icône
   (et non sur toute la zone du cercle)
   ========================================================================== */

function initOrbitHover() {
    const ring = document.querySelector(".orbit-ring");
    const items = document.querySelectorAll(".orbit-item-inner");
    if (!ring || !items.length) return;

    function pauseAll() {
        ring.style.animationPlayState = "paused";
        items.forEach(item => item.style.animationPlayState = "paused");
    }

    function resumeAll() {
        ring.style.animationPlayState = "running";
        items.forEach(item => item.style.animationPlayState = "running");
    }

    items.forEach(item => {
        item.addEventListener("mouseenter", pauseAll);
        item.addEventListener("mouseleave", resumeAll);
    });
}

window.addEventListener("load", initOrbitHover);

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
