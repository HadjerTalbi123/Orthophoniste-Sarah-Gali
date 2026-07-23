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
   PROJETS — données + rendu des cartes + modal de détails
   ========================================================================== */

const projects = [
    {
        number: "01",
        category: "FORMATION",
        title: "Stimulation Cognitive & Maladies Neurodégénératives",
        image: "../images/formation-1.jpg",
        summary: "Formation animée à l'EPSP de Zeralda à destination de collègues orthophonistes et psychologues, portant sur la stimulation cognitive dans le cadre des maladies neurodégénératives.",
        tags: ["ÉVALUATION COGNITIVE", "BILAN NEUROPSYCHOLOGIQUE", "RÉÉDUCATION"],
        context: "EPSP de Zeralda — Formation animée à destination de collègues orthophonistes et psychologues.",
        overview: [
            "C'était avec un grand plaisir que j'ai animé une formation au sein de l'EPSP de Zeralda à destination de mes collègues orthophonistes et psychologues, portant sur la stimulation cognitive dans le cadre des maladies neurodégénératives.",
            "Au cours de cette formation, nous avons abordé l'évaluation cognitive complète, la réalisation du bilan cognitif, l'interprétation des résultats ainsi que les différentes approches de prise en charge et de rééducation.",
            "Merci à cette formidable équipe pour son accueil chaleureux, sa participation active, la richesse des échanges, des débats et des discussions qui ont contribué au succès de cette journée de formation.",
            "Ce fut un véritable moment de partage professionnel et humain. Au plaisir de vous retrouver lors de prochaines rencontres formatives."
        ],
        gallery: [
            "../images/formation-1.jpg",
            "../images/formation-2.jpg",
            "../images/formation-3.jpg",
            "../images/formation-4.jpg",
            "../images/formation-5.jpg"
        ]
    },
    {
        number: "02",
        category: "FORMATION",
        title: "Stimulation Cognitive dans Parkinson & Alzheimer",
        image: "../images/formation2-1.jpg",
        summary: "Formation animée à l'EPSP de Zeralda sur la stimulation cognitive dans les maladies neurodégénératives, notamment la maladie de Parkinson et la maladie d'Alzheimer.",
        tags: ["MALADIE DE PARKINSON", "MALADIE D'ALZHEIMER", "STIMULATION COGNITIVE"],
        context: "EPSP de Zeralda — Formation continue des psychologues et des orthophonistes.",
        overview: [
            "Aujourd'hui, j'ai eu le plaisir d'animer une formation sur la stimulation cognitive dans les maladies neurodégénératives, notamment la maladie de Parkinson et la maladie d'Alzheimer, au sein de l'EPSP de Zeralda.",
            "Je tiens à remercier chaleureusement la responsable de la formation continue des psychologues et des orthophonistes pour sa confiance, son accueil et son professionnalisme.",
            "Ce fut un réel plaisir de rencontrer une équipe au top, des collègues investis, bienveillants et passionnés par leur métier.",
            "À très bientôt inch'Allah pour continuer ce beau parcours de formation et de partage."
        ],
        gallery: [
            "../images/formation2-1.jpg",
            "../images/formation2-2.jpg",
            "../images/formation2-3.jpg"
        ]
    },
    {
        number: "03",
        category: "SENSIBILISATION",
        type: "video",
        title: "Sensibilisation au Trouble Alimentaire Pédiatrique (TAP)",
        videoSrc: "../videos/SarahGali.mp4",
        summary: "Vidéo de sensibilisation au trouble alimentaire pédiatrique, repartagée à la demande du Dr Sebar Khadidja, pédiatre.",
        tags: ["TROUBLE ALIMENTAIRE PÉDIATRIQUE", "PRISE EN CHARGE PLURIDISCIPLINAIRE", "PÉDIATRIE"],
        context: "Vidéo repartagée à la demande du Dr Sebar Khadidja, Pédiatre des champions.",
        overview: [
            "Suite à la demande du Dr Sebar Khadidja, Pédiatre des champions, et dans le cadre de la sensibilisation au trouble alimentaire pédiatrique, je repartage cette vidéo pour sensibiliser au TAP. D'autres vidéos suivront, notamment sur le rôle de l'orthophonie dans la prise en charge.",
            "N'oublions pas que la prise en charge est pluridisciplinaire : le rôle du pédiatre est essentiel, tout comme celui de l'orthophoniste, du gastro-pédiatre et des autres professionnels impliqués."
        ]
    },
    {
        number: "04",
        category: "PRISE EN CHARGE",
        type: "video",
        title: "S'appuyer sur les Canaux Préservés",
        videoSrc: "../videos/StimulationCanaux.mp4",
        summary: "Dans les maladies neurodégénératives, certaines voies restent plus accessibles plus longtemps — le rythme, la musique, les automatismes, le sensoriel — pour continuer à stimuler et à garder le lien.",
        tags: ["MALADIES NEURODÉGÉNÉRATIVES", "STIMULATION SENSORIELLE", "RYTHME & MUSIQUE"],
        context: "Approche de prise en charge orientée vers les capacités préservées.",
        overview: [
            "Dans les maladies neurodégénératives, toutes les fonctions du cerveau ne sont pas atteintes de la même manière. Les fonctions cognitives complexes et le langage expressif sont souvent les plus fragilisés.",
            "En revanche, certaines voies restent plus accessibles plus longtemps : le rythme et la musique, les automatismes, les voies sensorielles (auditif, tactile).",
            "C'est pour cela que j'oriente la prise en charge vers ces canaux. On s'appuie sur les capacités préservées pour continuer à stimuler le cerveau, maintenir la communication et garder le lien."
        ]
    },
    {
        number: "05",
        category: "SENSIBILISATION",
        type: "video",
        title: "Journée Mondiale de la Maladie de Parkinson",
        videoSrc: "../videos/JourneeParkinson.mp4",
        summary: "Une pensée sincère à toutes les personnes vivant avec la maladie de Parkinson, à mes patients pour leur courage, et à leurs familles pour leur soutien précieux.",
        tags: ["MALADIE DE PARKINSON", "SENSIBILISATION", "SOUTIEN FAMILIAL"],
        context: "À l'occasion de la Journée mondiale de la maladie de Parkinson.",
        overview: [
            "À l'occasion de la Journée mondiale de la maladie de Parkinson, une pensée sincère à toutes les personnes qui vivent avec cette maladie au quotidien.",
            "Une attention toute particulière à mes patients, pour leur courage et leur persévérance, ainsi qu'à leurs familles, dont le soutien est précieux et essentiel.",
            "Ensemble, continuons à sensibiliser, accompagner et soutenir."
        ]
    },
    {
        number: "06",
        category: "FORMATION",
        title: "CAA dans le Service Étatique",
        image: "../images/caa-1.jpg",
        summary: "Formation consacrée à la Communication Alternative et Améliorée (CAA) animée à l'EPSP Kouba, pour une prise en charge pluridisciplinaire des patients TSA au sein du service étatique.",
        tags: ["CAA", "TSA", "PRISE EN CHARGE PLURIDISCIPLINAIRE"],
        context: "EPSP Kouba — Formation à destination des orthophonistes et psychologues cliniciens.",
        overview: [
            "J'ai eu le plaisir et l'honneur d'animer une formation consacrée à la Communication Alternative et Améliorée (CAA) au sein de l'EPSP Kouba.",
            "Je me réjouis de voir la CAA intégrer progressivement le service étatique, au bénéfice des orthophonistes et psychologues cliniciens. Une avancée importante pour une prise en charge pluridisciplinaire des patients présentant un TSA et des difficultés de communication.",
            "Les choses évoluent, et c'est ensemble que nous faisons bouger les pratiques au service des patients avec TSA.",
            "Je tiens à remercier chaleureusement Madame Oukali, psychologue clinicienne et coordinatrice remarquable. Merci pour votre investissement, la qualité des échanges et la richesse de cette collaboration. Votre professionnalisme et votre engagement ont grandement contribué à la réussite de cette formation."
        ],
        gallery: [
            "../images/caa-1.jpg",
            "../images/caa-2.jpg",
            "../images/caa-3.jpg",
            "../images/caa-4.jpg",
            "../images/caa-5.jpg",
            "../images/caa-6.jpg",
            "../images/caa-7.jpg"
        ],
        videos: [
            "../videos/CAA-Kouba-1.mp4",
            "../videos/CAA-Kouba-2.mp4"
        ]
    },
    {
        number: "07",
        category: "CONFÉRENCE",
        title: "2èmes Rencontres Africaines de la Santé de l'Enfant",
        image: "../images/rencontres-1.jpg",
        summary: "Retour en images sur les 2èmes Rencontres Africaines de la Santé de l'Enfant, avec une table ronde dédiée au trouble du spectre de l'autisme.",
        tags: ["TSA", "TABLE RONDE", "PRISE EN CHARGE PLURIDISCIPLINAIRE"],
        context: "2èmes Rencontres Africaines de la Santé de l'Enfant, Alger — 05, 06 et 07 février 2026.",
        overview: [
            "Retour en images, 2èmes Rencontres Africaines de la Santé de l'Enfant, 05, 06 et 07 février 2026.",
            "Une table ronde dédiée au trouble du spectre de l'autisme, riche en échanges, aux côtés de médecins, psychologues et orthophonistes."
        ],
        gallery: [
            "../images/rencontres-1.jpg",
            "../images/rencontres-2.jpg",
            "../images/rencontres-3.jpg",
            "../images/rencontres-4.jpg",
            "../images/rencontres-5.jpg",
            "../images/rencontres-6.jpg",
            "../images/rencontres-7.jpg",
            "../images/rencontres-8.jpg",
            "../images/rencontres-9.jpg",
            "../images/rencontres-10.jpg",
            "../images/rencontres-11.jpg",
            "../images/rencontres-12.jpg"
        ]
    },
    {
        number: "08",
        category: "PRISE EN CHARGE",
        type: "video",
        title: "Bonjour le Monde, Bonjour l'Humanité",
        videoSrc: "../videos/LangageNaturel.mp4",
        summary: "Une répétition plus naturelle, un langage qui se construit — un moment de prise en charge orthophonique.",
        tags: ["LANGAGE", "RÉPÉTITION NATURELLE", "PRISE EN CHARGE"],
        context: "Séance de prise en charge orthophonique autour de la construction du langage.",
        overview: [
            "Bonjour le monde, bonjour l'humanité.",
            "Une répétition plus naturelle, un langage qui se construit."
        ]
    },
    {
        number: "09",
        category: "PRISE EN CHARGE",
        type: "video",
        title: "Bravo à ma Petite Championne",
        videoSrc: "../videos/PetiteChampionne.mp4",
        summary: "Des progrès construits pas à pas, dans le respect du rythme du patient.",
        tags: ["PROGRÈS", "RYTHME DU PATIENT", "PRISE EN CHARGE"],
        context: "Séance de prise en charge orthophonique — évolution progressive du patient.",
        overview: [
            "Des progrès construits pas à pas, dans le respect du rythme du patient.",
            "Bravo à ma petite championne."
        ]
    },
    {
        number: "10",
        category: "CONFÉRENCE",
        title: "Outils Numériques & IA au Service de l'Orthophonie",
        image: "../images/colloque-2.jpg",
        summary: "Participation au colloque national de l'Université 20 Août 1955 – Skikda, avec une communication à distance sur OrthoMath et PhonoLab, deux outils numériques pour les troubles spécifiques des apprentissages.",
        tags: ["INTELLIGENCE ARTIFICIELLE", "ORTHOMATH & PHONOLAB", "TROUBLES DES APPRENTISSAGES"],
        context: "Colloque national — Université 20 Août 1955 de Skikda, en collaboration avec le Laboratoire d'études et de consultations en psychologie éducative.",
        overview: [
            "C'est avec grand plaisir que je vous annonce ma participation au colloque national organisé par l'Université 20 Août 1955 – Skikda, en collaboration avec le Laboratoire d'études et de consultations en psychologie éducative.",
            "J'aurai l'honneur d'y présenter une communication à distance, en raison de plusieurs engagements professionnels cette semaine qui ne m'ont malheureusement pas permis de me déplacer à Skikda. Ce sera, Inch'Allah, pour une prochaine occasion.",
            "Mon intervention portera sur le thème : « Les outils numériques et l'intelligence artificielle au service de la pratique orthophonique : présentation de deux outils thérapeutiques (OrthoMath et PhonoLab) destinés à la prise en charge des troubles spécifiques des apprentissages en lecture et en mathématiques ».",
            "Je remercie chaleureusement les organisateurs pour l'invitation et la confiance accordée."
        ],
        gallery: [
            "../images/colloque-1.jpg",
            "../images/colloque-2.jpg",
            "../images/colloque-3.jpg",
            "../images/colloque-4.jpg",
            "../images/colloque-5.jpg",
            "../images/colloque-6.jpg"
        ]
    },
    {
        number: "11",
        category: "CONFÉRENCE",
        title: "Congrès Africain de la Santé Mentale de l'Enfant",
        image: "../images/congres-9.jpg",
        summary: "Communication sur la prise en charge pluridisciplinaire du TSA, avec un accent sur la sélectivité alimentaire, le langage et la Communication Alternative et Améliorée (CAA) dans le contexte algérien.",
        tags: ["TSA", "CAA", "PRISE EN CHARGE PLURIDISCIPLINAIRE"],
        context: "Congrès africain de la santé mentale de l'enfant, organisé par HeSPro.",
        overview: [
            "J'ai eu le plaisir de participer au Congrès africain de la santé mentale de l'enfant, organisé par HeSPro.",
            "J'y ai présenté une communication sur la prise en charge pluridisciplinaire, en mettant particulièrement l'accent sur le rôle de l'orthophoniste dans l'accompagnement des patients présentant un trouble du spectre de l'autisme, notamment autour de la sélectivité alimentaire, du langage et de la communication. J'ai également insisté sur l'importance de la Communication Alternative et Améliorée (CAA) et de son utilisation, en tenant compte du contexte algérien.",
            "Je tiens à adresser mes sincères remerciements au Dr Aziza Souad Choukri et au Dr Houbi, avec qui j'ai eu le plaisir de collaborer. Ce fut une expérience très enrichissante de travailler à vos côtés et de partager ce moment professionnel avec vous.",
            "Merci également à tous mes collègues orthophonistes et psychologues présents ce jour-là. Ce fut un réel plaisir de vous rencontrer, d'échanger et de partager nos expériences.",
            "Au plaisir de vous retrouver lors de prochains congrès, incha'Allah. Ensemble, allons plus loin, incha'Allah."
        ],
        gallery: [
            "../images/congres-1.jpg",
            "../images/congres-2.jpg",
            "../images/congres-3.jpg",
            "../images/congres-4.jpg",
            "../images/congres-5.jpg",
            "../images/congres-6.jpg",
            "../images/congres-7.jpg",
            "../images/congres-8.jpg",
            "../images/congres-9.jpg",
            "../images/congres-10.jpg",
            "../images/congres-11.jpg"
        ]
    },
    {
        number: "12",
        category: "PRISE EN CHARGE",
        type: "video",
        title: "CAA & Langage Fonctionnel dans le TSA",
        videoSrc: "../videos/CAALangageFonctionnel.mp4",
        summary: "La CAA soutient le développement d'un langage fonctionnel et naturel, adapté aux besoins de chaque patient avec trouble du spectre de l'autisme.",
        tags: ["CAA", "TSA", "LANGAGE FONCTIONNEL"],
        context: "Séance de prise en charge orthophonique autour de la Communication Alternative et Améliorée.",
        overview: [
            "La CAA soutient le développement d'un langage fonctionnel et naturel, adapté aux besoins de chaque patient avec trouble du spectre de l'autisme."
        ]
    },
    {
        number: "13",
        category: "PRISE EN CHARGE",
        type: "video",
        title: "Derrière Chaque Petit Son",
        videoSrc: "../videos/FiereEvolution.mp4",
        summary: "Derrière chaque petit son se cache un immense effort. Travailler les bases, respecter le rythme de l'enfant et célébrer chaque progrès.",
        tags: ["ARTICULATION", "RYTHME DE L'ENFANT", "PROGRÈS"],
        context: "Séance de prise en charge orthophonique — travail sur les sons de base.",
        overview: [
            "Derrière chaque petit son se cache un immense effort. Travailler les bases, respecter le rythme de l'enfant et célébrer chaque progrès.",
            "Fière de cette évolution."
        ]
    },
    {
        number: "14",
        category: "FORMATION",
        title: "Workshop Doctoral — Bilan Neuropsychologique & Stimulation Cognitive",
        image: "../images/workshop-1.jpg",
        summary: "Workshop doctoral à caractère pratique sur les troubles neurodéveloppementaux chez l'enfant, animé autour de cas cliniques réels issus de la pratique clinique.",
        tags: ["BILAN NEUROPSYCHOLOGIQUE", "STIMULATION COGNITIVE", "TROUBLES NEURODÉVELOPPEMENTAUX"],
        context: "Workshop doctoral — Université d'Alger 2, Laboratoire de Psychologie de la Santé, Prévention et Qualité de Vie.",
        overview: [
            "J'ai eu le plaisir d'animer le workshop doctoral à caractère pratique consacré aux troubles neurodéveloppementaux chez l'enfant, intitulé : Bilan neuropsychologique et la stimulation cognitive chez l'enfant.",
            "Ce workshop s'est appuyé sur une approche appliquée, à travers la présentation et la discussion de cas cliniques réels issus de la pratique clinique.",
            "Je tiens à adresser mes sincères remerciements au Professeur Dalila Zenad pour son engagement constant au service des étudiants et de la recherche scientifique."
        ],
        gallery: [
            "../images/workshop-1.jpg",
            "../images/workshop-2.jpg",
            "../images/workshop-3.jpg"
        ]
    },
    {
        number: "15",
        category: "CONFÉRENCE",
        title: "Congrès National — Troubles Neurodéveloppementaux",
        image: "../images/congres-neurodev-1.jpg",
        summary: "Communication sur les outils numériques et l'intelligence artificielle dans la prise en charge orthophonique en Algérie, lors d'un congrès national consacré aux troubles neurodéveloppementaux.",
        tags: ["TROUBLES NEURODÉVELOPPEMENTAUX", "INTELLIGENCE ARTIFICIELLE", "OUTILS NUMÉRIQUES"],
        context: "Congrès national consacré aux troubles neurodéveloppementaux, Bibliothèque Nationale d'Algérie.",
        overview: [
            "J'ai eu l'honneur de participer aujourd'hui à un congrès national consacré aux troubles neurodéveloppementaux. À cette occasion, je tiens à adresser mes sincères remerciements à l'organisatrice, notre chère collègue Sarah Assim, pour la qualité remarquable de l'organisation, ainsi que pour tous les efforts fournis afin de réunir des professionnels venus de différents horizons.",
            "Le thème de ma communication était consacré aux outils numériques et à l'intelligence artificielle dans la prise en charge orthophonique en Algérie. Ce type de congrès, organisé en Algérie, est essentiel pour favoriser les échanges, le partage des connaissances et l'évolution de nos pratiques professionnelles.",
            "Ce fut un véritable plaisir de rencontrer mes collègues orthophonistes, psychologues, pédopsychiatres, ainsi que des enseignants et des professeurs, et d'échanger autour de thématiques aussi importantes.",
            "Je remercie également chaleureusement toute l'équipe d'organisation pour son engagement et son sérieux tout au long de cet événement."
        ],
        gallery: [
            "../images/congres-neurodev-1.jpg",
            "../images/congres-neurodev-2.jpg",
            "../images/congres-neurodev-3.jpg",
            "../images/congres-neurodev-4.jpg",
            "../images/congres-neurodev-5.jpg",
            "../images/congres-neurodev-6.jpg",
            "../images/congres-neurodev-7.jpg",
            "../images/congres-neurodev-8.jpg",
            "../images/congres-neurodev-9.jpg",
            "../images/congres-neurodev-10.jpg",
            "../images/congres-neurodev-11.jpg"
        ]
    }
];

function renderProjects() {
    const list = document.querySelector(".projects-list");
    if (!list) return;

    list.innerHTML = projects.map((p, i) => `
        <article class="project-card">
            <span class="project-number">${p.number}</span>

            <div class="project-card-grid">
                <div class="project-card-text">
                    <h2 class="project-title">${p.title}</h2>
                    <p class="project-summary">${p.summary}</p>

                    <div class="project-tags">
                        ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join("")}
                    </div>

                    <button class="details-btn" type="button" data-project="${i}">
                        Voir détails <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>

                <div class="project-card-image">
                    ${p.type === "video"
                        ? `<button class="project-video-cover" type="button" data-project="${i}">
                               <video src="${p.videoSrc}" muted playsinline preload="metadata"></video>
                               <i class="fa-solid fa-circle-play"></i>
                               <span>Voir la vidéo</span>
                           </button>`
                        : `<img src="${p.image}" alt="${p.title}">`
                    }
                </div>
            </div>
        </article>
    `).join("") + `
        <a href="Contact.html" class="know-link">
            <span class="know-text">Connectons-nous</span>
            <span class="know-arrow">
                <i class="fa-solid fa-arrow-right-long"></i>
            </span>
        </a>
    `;

    list.querySelectorAll(".project-video-cover").forEach(btn => {
        btn.addEventListener("click", () => openProjectModal(projects[Number(btn.dataset.project)]));
    });

    list.querySelectorAll(".details-btn").forEach(btn => {
        btn.addEventListener("click", () => openProjectModal(projects[Number(btn.dataset.project)]));
    });

    initProjectsReveal();
}

/* ==========================================================================
   RÉVÉLATION AU SCROLL — cartes de projets en cascade
   (même logique que Profil.js : reveal → in-view via IntersectionObserver)
   ========================================================================== */

function initProjectsReveal() {
    const content = document.querySelector(".content");
    const header = document.querySelector(".content-header");
    const list = document.querySelector(".projects-list");
    if (!list) return;

    const items = [];
    if (header) items.push(header);
    items.push(...Array.from(list.children)); // project-cards + know-link

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

function openProjectModal(p) {
    let overlay = document.querySelector(".modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        document.body.appendChild(overlay);
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeProjectModal();
        });
    }

    overlay.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" type="button" aria-label="Fermer">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <span class="modal-label">PROJET · ${p.number}</span>
            <h2 class="modal-title">${p.title}</h2>

            <div class="project-tags">
                ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join("")}
            </div>

            <hr class="modal-divider">

            <span class="modal-section-label">CONTEXTE</span>
            <p class="modal-text">${p.context}</p>

            <span class="modal-section-label">APERÇU</span>
            ${p.overview.map(par => `<p class="modal-text">${par}</p>`).join("")}

            ${p.type === "video"
                ? `<span class="modal-section-label">VIDÉO</span>
                   <div class="modal-video">
                       <video src="${p.videoSrc}" controls playsinline preload="metadata"></video>
                   </div>`
                : `<span class="modal-section-label">Images</span>
                   <div class="modal-gallery">
                       ${p.gallery.map(src => `<img src="${src}" alt="${p.title}">`).join("")}
                   </div>`
            }

            ${p.videos ? `
                <span class="modal-section-label">VIDÉOS</span>
                <div class="modal-videos-grid">
                    ${p.videos.map(src => `
                        <div class="modal-video">
                            <video src="${src}" controls playsinline preload="metadata"></video>
                        </div>
                    `).join("")}
                </div>
            ` : ""}
        </div>
    `;

    overlay.querySelector(".modal-close").addEventListener("click", closeProjectModal);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeProjectModal() {
    const overlay = document.querySelector(".modal-overlay");
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", renderProjects);
if (document.readyState !== "loading") renderProjects();
