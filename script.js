// ══════════════════════════════════════════════════
//  SCROLL ANIMATION — canvas is fixed background
// ══════════════════════════════════════════════════
const FRAME_COUNT = 51;
const framePath   = i => `./images/ezgif-frame-${String(i).padStart(3,'0')}.jpg`;

const canvas     = document.getElementById('scroll-canvas');
const ctx        = canvas.getContext('2d');
const loader     = document.getElementById('loader');
const progressEl = document.getElementById('progress-percent');

const frames     = [];
let loadedCount  = 0;
let targetFrame  = 0;
let currentFrame = 0;
let animStarted  = false;

// Match canvas pixels to window size
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  renderFrame(currentFrame);
}

// Contain-fill: entire animation frame visible, centered, no cropping
function renderFrame(idx) {
  const img = frames[Math.round(idx)];
  if (!img || !img.complete || !img.naturalWidth) return;
  const cw = canvas.width, ch = canvas.height;
  const iw = img.naturalWidth, ih = img.naturalHeight;

  // Fill background so no blank areas
  ctx.fillStyle = '#0d0007';
  ctx.fillRect(0, 0, cw, ch);

  // Scale to fit entirely (contain), then center
  const scale = Math.min(cw / iw, ch / ih);
  const sw = iw * scale, sh = ih * scale;
  ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
}

// Map scroll to frame — animation plays from start to end of the entire page scroll
function updateScrollTarget() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) return;
  const fraction = window.scrollY / scrollableHeight;
  targetFrame = fraction * (FRAME_COUNT - 1);
}

// RAF loop with lerp smoothing (lerp factor reduced to 0.05 for fluid, silky transitions)
function animLoop() {
  const diff = targetFrame - currentFrame;
  currentFrame = Math.abs(diff) < 0.001 ? targetFrame : currentFrame + diff * 0.05;
  renderFrame(currentFrame);
  requestAnimationFrame(animLoop);
}

// Preload all 51 frames
function preloadFrames() {
  for (let i = 1; i <= FRAME_COUNT; i++) {
    const img = new Image();
    img.onload = () => {
      loadedCount++;
      progressEl.textContent = Math.floor((loadedCount / FRAME_COUNT) * 100);
      if (i === 1) renderFrame(0);
      if (loadedCount === FRAME_COUNT) {
        updateScrollTarget();
        currentFrame = targetFrame;
        renderFrame(currentFrame);
        loader.classList.add('hidden');
        if (!animStarted) { animStarted = true; animLoop(); }
      }
    };
    img.onerror = () => {
      loadedCount++;
      if (loadedCount === FRAME_COUNT) {
        loader.classList.add('hidden');
        if (!animStarted) { animStarted = true; animLoop(); }
      }
    };
    img.src = framePath(i);
    frames.push(img);
  }
}

window.addEventListener('scroll', updateScrollTarget, { passive: true });
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();
preloadFrames();


// ══════════════════════════════════════════════════
//  INTERACTIVE TERMINAL
// ══════════════════════════════════════════════════
const CMDS = {
  help: `Available commands:\n  about     — Who I am\n  skills    — Technical skillset\n  certs     — Certifications\n  projects  — Featured projects\n  contact   — Contact details\n  ctf       — CTF & security activities\n  clear     — Clear terminal`,
  about: `Purushottam Kumar | Cybersecurity Analyst\n\nB.Tech CS (Cybersecurity) at Central University of Jammu (2025–2029)\nDedicated to defending digital assets, hunting threats, and building\nresilient security architectures.`,
  skills: `Technical Skills:\n\n  Network Security     15%\n  Python / Scripting   22%\n  C Programming        20%\n  Linux / Bash         15%\n  Socket Programming   Active\n  Scapy / Packet Analy Active`,
  certs: `Certifications (2026 — Cisco):\n\n  • Networking Basics\n  • Networking Devices & Basic Configuration\n  • Introduction to Modern AI`,
  projects: `Featured Projects:\n\n  [WEB]       Pluton — AI Code Reviewer\n  [SERVER]    Chatting Server (Python)\n  [RED TEAM]  Brute-force Password Simulator\n  [SOCKET]    Open TCP Port Scanner\n  [BLUE TEAM] ANJANEYA Mini Firewall\n  [SERVER]    FTP Server`,
  contact: `Contact Info:\n\n  Email:    purushottamcuj62045@gmail.com\n  Phone:    +91 7549308113\n  Location: Jammu, India\n  GitHub:   github.com/purushottamcuj62045-alt\n  LinkedIn: linkedin.com/in/purushottam-k-08a414383/\n\n  Available for remote work`,
  ctf: `CTF & Security Activities:\n\n  Platforms: CTFTime, HackTheBox, TryHackMe\n  Focus:     Web Exploitation, Cryptography,\n             Forensics, Reverse Engineering\n  Status:    Active competitor`
};

function focusTerminalInput() {
  document.getElementById('terminal-input').focus();
}

function handleTerminalCommand(e) {
  e.preventDefault();
  const inp = document.getElementById('terminal-input');
  const cmd = inp.value.trim().toLowerCase();
  if (!cmd) return;
  addLine(inp.value, 'input');
  inp.value = '';
  if (cmd === 'clear') {
    document.getElementById('terminal-body').innerHTML = '<div id="terminal-end"></div>';
    return;
  }
  if (CMDS[cmd]) addLine(CMDS[cmd], cmd === 'contact' ? 'success' : 'output');
  else addLine(`Command not found: '${cmd}'. Type 'help' for options.`, 'error');
}

function addLine(text, type) {
  const body = document.getElementById('terminal-body');
  const end  = document.getElementById('terminal-end');
  const div  = document.createElement('div');
  if (type === 'input') {
    div.className = 't-line';
    div.innerHTML = `<span class="t-prompt">❯</span><span class="t-cmd">${text.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`;
  } else {
    div.className = `t-line t-output${type==='success'?' t-success':type==='error'?' t-error':''}`;
    div.textContent = text;
  }
  body.insertBefore(div, end);
  end.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


// ══════════════════════════════════════════════════
//  SKILL BARS — animate when scrolled into view
// ══════════════════════════════════════════════════
document.querySelectorAll('.skill-fill').forEach(el => {
  el.style.setProperty('--skill-w', el.dataset.width);
});

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(f => f.classList.add('animated'));
    }
  });
}, { threshold: 0.4 }).observe(document.getElementById('skills'));


// ══════════════════════════════════════════════════
//  CONTACT FORM
// ══════════════════════════════════════════════════
function handleContactForm(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const ok  = document.getElementById('form-success');
  btn.innerHTML = '<span style="width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block"></span>';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message ➤';
    btn.disabled = false;
    ok.classList.remove('hidden');
    e.target.reset();
    setTimeout(() => ok.classList.add('hidden'), 5000);
  }, 1200);
}
