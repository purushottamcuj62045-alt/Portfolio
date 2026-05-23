/* ════════════════════════════════════════════════════════════
    PURUSHOTTAM — PORTFOLIO  ·  script.js
    Typing effect · Canvas particles · Scroll reveal
    Sticky nav · Active highlight · Skill bars · Form
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    /* ═══════════ TYPING ANIMATION ═══════════ */
    const typedEl = document.getElementById('typed');
    const roles = [
        'Cybersecurity Analyst',
        'Penetration Tester',
        'Threat Hunter',
        'Security Researcher',
        'CTF Hunter'
    ];
    let rIdx = 0, cIdx = 0, deleting = false, speed = 110;
    function type() {
        const word = roles[rIdx];
        if (!deleting) {
            typedEl.textContent = word.slice(0, ++cIdx);
            speed = 100 + Math.random() * 40;          // natural variance
            if (cIdx === word.length) { speed = 2200; deleting = true; }
        } else {
            typedEl.textContent = word.slice(0, --cIdx);
            speed = 45;
            if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; speed = 350; }
        }
        setTimeout(type, speed);
    }
    type();
    /* ═══════════ CANVAS PARTICLE FIELD ═══════════ */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 55;
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.r = Math.random() * 1.6 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.alpha = Math.random() * 0.35 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(192, 57, 43, ${this.alpha})`;
            ctx.fill();
        }
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw faint lines between nearby particles
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.strokeStyle = `rgba(192, 57, 43, ${0.06 * (1 - dist / 140)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
    /* ═══════════ STICKY NAVBAR ═══════════ */
    const nav = document.getElementById('navbar');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    /* ═══════════ MOBILE MENU ═══════════ */
    const toggle = document.getElementById('menuToggle');
    const links = document.getElementById('navLinks');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
    });
    document.querySelectorAll('.nav-item').forEach(a => {
        a.addEventListener('click', () => {
            toggle.classList.remove('open');
            links.classList.remove('open');
        });
    });
    /* ═══════════ ACTIVE SECTION HIGHLIGHT ═══════════ */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    function highlightNav() {
        const y = window.scrollY + 130;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const h = sec.offsetHeight;
            const id = sec.id;
            if (y >= top && y < top + h) {
                navItems.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNav);
    /* ═══════════ SCROLL REVEAL ═══════════ */
    const revealEls = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0, 10);
                setTimeout(() => entry.target.classList.add('visible'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
    /* ═══════════ SKILL BAR FILL ═══════════ */
    const skillBars = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.pct + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });
    skillBars.forEach(bar => skillObserver.observe(bar));
    /* ═══════════ CONTACT FORM ═══════════ */
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.background = '';
            form.reset();
        }, 2800);
    });
    /* ═══════════ SMOOTH SCROLL (fallback) ═══════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});