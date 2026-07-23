/* ==========================================================================
   EFFET DE FRAPPE (typing effect) — titre et paragraphe du hero
   ========================================================================== */

function typeHTML(element, speed, callback) {
    const html = element.innerHTML;

    element.innerHTML = "";
    element.style.visibility = "visible";
    element.classList.add("typing-cursor");

    let i = 0;
    let current = "";

    function type() {
        if (i >= html.length) {
            element.classList.remove("typing-cursor");
            if (callback) callback();
            return;
        }

        // Si on rencontre une balise HTML (<span>, <strong>, <br>...) on l'ajoute d'un coup
        if (html[i] === "<") {
            const end = html.indexOf(">", i);
            current += html.substring(i, end + 1);
            element.innerHTML = current;
            i = end + 1;
        } else {
            current += html[i];
            element.innerHTML = current;
            i++;
        }

        setTimeout(type, speed);
    }

    type();
}

window.addEventListener("load", () => {
    const title = document.querySelector(".hero h1");
    const paragraph = document.querySelector(".hero p");

    typeHTML(title, 60, () => {
        typeHTML(paragraph, 18, () => {
            const services = document.querySelector(".services-animation");
            services.classList.add("show");

            // Attendre la fin de l'animation des services (1000ms) avant d'afficher le lien
            setTimeout(() => {
                document.querySelector(".know-link").classList.add("show");
            }, 1000);
        });
    });
});

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
