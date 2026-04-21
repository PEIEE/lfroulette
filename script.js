/* ========================================
   Last Flag – Ruleta de Personajes
   Roulette logic, audio, and confetti
   ======================================== */

// ── i18n Translations ───────────────────────────────
const TRANSLATIONS = {
    es: {
        subtitle: 'RULETA DE PERSONAJES',
        spin: 'GIRAR',
        spinning: 'GIRANDO...',
        goodLuck: '¡Buena suerte!',
        hintDefault: 'Pulsa para seleccionar un personaje aleatorio',
        hintMinChars: 'Selecciona al menos 2 personajes',
        toggleLabel: 'Personajes en la ruleta',
        resultSubtitle: '¡Es tu personaje!',
        spinAgain: 'GIRAR DE NUEVO',
        soundTitle: 'Activar/Desactivar sonido',
        langTitle: 'Cambiar idioma / Change language',
        history: 'HISTORIAL',
        viewProfile: 'VER PERFIL',
    },
    en: {
        subtitle: 'CHARACTER ROULETTE',
        spin: 'SPIN',
        spinning: 'SPINNING...',
        goodLuck: 'Good luck!',
        hintDefault: 'Press to select a random character',
        hintMinChars: 'Select at least 2 characters',
        toggleLabel: 'Characters in the roulette',
        resultSubtitle: "It's your character!",
        spinAgain: 'SPIN AGAIN',
        soundTitle: 'Toggle sound',
        langTitle: 'Change language / Cambiar idioma',
        history: 'HISTORY',
        viewProfile: 'VIEW PROFILE',
    },
};

let currentLang = 'es';

function t(key) {
    return TRANSLATIONS[currentLang][key] || TRANSLATIONS.es[key] || key;
}

// ── Character Data ──────────────────────────────────
const CHARACTERS = [
    { name: 'Lumberjack',    slug: 'lumberjack',     image: 'https://a.storyblok.com/f/339795/600x894/fea402bf3b/contestant-card-template-lumberjack.png/m/fit-in/600x800/filters:quality(85)', desc: 'Gigante finlandés de buen corazón. Un luchador incansable que protege a su equipo con su fuerza descomunal.' },
    { name: 'Knives',        slug: 'knives',          image: 'https://a.storyblok.com/f/339795/600x894/94a966dc69/contestant-card-template-knives.png/m/fit-in/600x800/filters:quality(85)', desc: 'Asesina sigilosa experta en el combate cuerpo a cuerpo. Su velocidad y letalidad la hacen invisible ante sus enemigos.' },
    { name: 'Arsenal',       slug: 'arsenal',         image: 'https://a.storyblok.com/f/339795/600x894/55516bc043/contestant-card-template-engineer.png/m/fit-in/600x800/filters:quality(85)', desc: 'Especialista en demoliciones y apoyo táctico. Nadie controla el terreno de batalla mejor que ella.' },
    { name: 'Bounty Hunter', slug: 'bounty-hunter',   image: 'https://a.storyblok.com/f/339795/600x894/92b4035086/contestant-card-template-julius.png/m/fit-in/600x800/filters:quality(85)', desc: 'Un cazador implacable que nunca pierde el rastro de su presa. Equilibrio perfecto entre puntería y estrategia.' },
    { name: 'Banshee',       slug: 'banshee',         image: 'https://a.storyblok.com/f/339795/600x894/eb98ce34ae/contestant-card-template-archer.png/m/fit-in/600x800/filters:quality(85)', desc: 'Arquera mística que utiliza el sonido y la energía para debilitar a sus oponentes desde la distancia.' },
    { name: 'Roadie',        slug: 'roadie',          image: 'https://a.storyblok.com/f/339795/600x894/06959107c2/contestant-card-template-roadie.png/m/fit-in/600x800/filters:quality(85)', desc: 'Un tanque imponente que absorbe todo el castigo. Siempre al frente de la carga, abriendo camino.' },
    { name: 'Scout',         slug: 'scout',           image: 'https://a.storyblok.com/f/339795/600x894/047930ca9a/contestant-card-template-scout.png/m/fit-in/600x800/filters:quality(85)', desc: 'La exploradora más rápida de Last Flag. Su capacidad de reconocimiento es vital para cualquier estrategia.' },
    { name: 'Tango',         slug: 'tango',           image: 'https://a.storyblok.com/f/339795/600x894/6f84307182/contestant-card-template-tango.png/m/fit-in/600x800/filters:quality(85)', desc: 'Maestro del control y el flanqueo. Sus gadgets tecnológicos confunden y atrapan a los rivales.' },
    { name: 'Skyfire',       slug: 'skyfire',          image: 'https://a.storyblok.com/f/339795/600x894/9260ac696a/contestant-card-template-skyfire.png/m/fit-in/600x800/filters:quality(85)', desc: 'Experto en ataques aéreos y movilidad vertical. Lluvia de fuego desde el cielo sobre sus enemigos.' },
];

// Add translations for descriptions in a real app, but for now I'll just use the desc property.
// Actually, let's add EN descriptions too to be thorough.
const DESCRIPTIONS_EN = {
    'lumberjack': 'Kind-hearted Finnish giant. A tireless fighter who protects his team with his sheer strength.',
    'knives': 'Stealth assassin expert in CQC. Her speed and lethality make her invisible to her enemies.',
    'arsenal': 'Demolitions specialist and tactical support. No one controls the battlefield better than her.',
    'bounty-hunter': 'A relentless hunter who never loses track of his prey. Perfect balance of aim and strategy.',
    'banshee': 'Mystic archer who uses sound and energy to weaken her opponents from a distance.',
    'roadie': 'An imposing tank that absorbs all punishment. Always at the front of the charge, leading the way.',
    'scout': 'The fastest scout in Last Flag. Her reconnaissance ability is vital for any strategy.',
    'tango': 'Master of control and flanking. His tech gadgets confuse and trap rivals.',
    'skyfire': 'Airstrike expert and vertical mobility. Rain of fire from the sky upon his enemies.'
};

function getImageUrl(slug) {
    const char = CHARACTERS.find(c => c.slug === slug);
    return char ? char.image : '';
}

// ── DOM Refs ────────────────────────────────────────
const strip           = document.getElementById('roulette-strip');
const viewport        = document.getElementById('roulette-viewport');
const spinBtn         = document.getElementById('spin-btn');
const spinBtnText     = document.getElementById('spin-btn-text');
const toggleGrid      = document.getElementById('toggle-grid');
const toggleCount     = document.getElementById('toggle-count');
const controlsHint    = document.getElementById('controls-hint');
const resultOverlay   = document.getElementById('result-overlay');
const resultBackdrop  = document.getElementById('result-backdrop');
const resultModal     = document.getElementById('result-modal');
const resultImg       = document.getElementById('result-img');
const resultName      = document.getElementById('result-name');
const resultDesc      = document.getElementById('result-desc');
const profileBtn      = document.getElementById('profile-btn');
const resultBtn       = document.getElementById('result-btn');
const soundToggleBtn  = document.getElementById('sound-toggle');
const soundIcon       = document.getElementById('sound-icon');
const confettiCanvas  = document.getElementById('confetti-canvas');
const langToggleBtn   = document.getElementById('lang-toggle');
const langFlag        = document.getElementById('lang-flag');
const langLabel       = document.getElementById('lang-label');
const subtitleEl      = document.querySelector('.logo-subtitle');
const toggleLabelEl   = document.querySelector('.toggle-label');
const resultSubtitleEl= document.querySelector('.result-subtitle');
const wheelIcon       = document.querySelector('.wheel-icon');
const historyLabel    = document.getElementById('history-label');
const historyList     = document.getElementById('history-list');

// ── State ───────────────────────────────────────────
let activeChars   = [...CHARACTERS];
let enabledSlugs  = new Set(CHARACTERS.map(c => c.slug));
let isSpinning    = false;
let soundEnabled  = true;
let audioCtx      = null;
let lastTickIdx   = -1;
let pinHistory    = [];
const MAX_HISTORY = 8;

// ── Constants ───────────────────────────────────────
const REPETITIONS     = 8;
const TARGET_REP      = 5;   // which repetition the winner lands in
const SPIN_DURATION   = 5;   // seconds (base)

// ── Audio System ────────────────────────────────────
function ensureAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTick() {
    if (!soundEnabled || !audioCtx) return;
    try {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.value = 1000 + Math.random() * 400;
        const t = audioCtx.currentTime;
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
        osc.start(t);
        osc.stop(t + 0.035);
    } catch (_) {}
}

function playWinSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
        const notes = [523, 659, 784, 1047]; // C5→C6 arpeggio
        notes.forEach((freq, i) => {
            const osc  = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            const t = audioCtx.currentTime + i * 0.12;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.14, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
            osc.start(t);
            osc.stop(t + 0.45);
        });
    } catch (_) {}
}

// ── Card Dimensions (read from CSS vars) ────────────
function getCardMetrics() {
    const style = getComputedStyle(document.documentElement);
    const w = parseFloat(style.getPropertyValue('--card-w'));
    const g = parseFloat(style.getPropertyValue('--card-gap'));
    return { cardW: w, gap: g, step: w + g };
}

// ── Build Roulette Strip ────────────────────────────
function buildStrip() {
    strip.style.transition = 'none';
    strip.style.transform = 'translateX(0)';
    strip.innerHTML = '';

    if (activeChars.length === 0) return;

    for (let rep = 0; rep < REPETITIONS; rep++) {
        activeChars.forEach(char => {
            const card   = document.createElement('div');
            card.className = 'roulette-card';
            card.dataset.slug = char.slug;

            const img    = document.createElement('img');
            img.src      = getImageUrl(char.slug);
            img.alt      = char.name;
            img.loading  = 'lazy';
            img.draggable = false;

            const name   = document.createElement('span');
            name.className = 'card-name';
            name.textContent = char.name;

            card.appendChild(img);
            card.appendChild(name);
            strip.appendChild(card);
        });
    }
}

// ── Build Toggle Grid ───────────────────────────────
function buildToggleGrid() {
    toggleGrid.innerHTML = '';
    CHARACTERS.forEach(char => {
        const item = document.createElement('div');
        item.className = 'toggle-item';
        if (!enabledSlugs.has(char.slug)) item.classList.add('disabled');
        item.dataset.slug = char.slug;

        const avatar = document.createElement('div');
        avatar.className = 'toggle-avatar';
        const img  = document.createElement('img');
        img.src    = getImageUrl(char.slug);
        img.alt    = char.name;
        img.draggable = false;
        avatar.appendChild(img);

        const label = document.createElement('span');
        label.className = 'toggle-item-name';
        label.textContent = char.name;

        item.appendChild(avatar);
        item.appendChild(label);
        toggleGrid.appendChild(item);

        item.addEventListener('click', () => {
            if (isSpinning) return;
            toggleCharacter(char.slug, item);
        });
    });
    updateToggleCount();
}

function toggleCharacter(slug, el) {
    if (enabledSlugs.has(slug)) {
        if (enabledSlugs.size <= 2) return; // need at least 2
        enabledSlugs.delete(slug);
        el.classList.add('disabled');
    } else {
        enabledSlugs.add(slug);
        el.classList.remove('disabled');
    }
    activeChars = CHARACTERS.filter(c => enabledSlugs.has(c.slug));
    updateToggleCount();
    buildStrip();
}

function updateToggleCount() {
    toggleCount.textContent = `(${enabledSlugs.size}/${CHARACTERS.length})`;
    const canSpin = enabledSlugs.size >= 2;
    spinBtn.disabled = !canSpin;
    controlsHint.textContent = canSpin
        ? t('hintDefault')
        : t('hintMinChars');
}

// ── Spin Logic ──────────────────────────────────────
function spin() {
    if (isSpinning || activeChars.length < 2) return;
    isSpinning = true;
    ensureAudioCtx();

    // Close result overlay if open
    hideResult();

    // Reset strip position
    strip.style.transition = 'none';
    strip.style.transform  = 'translateX(0)';

    // Remove any previous winner highlights
    strip.querySelectorAll('.winner').forEach(el => el.classList.remove('winner'));

    // UI state
    spinBtn.disabled = true;
    spinBtn.classList.remove('idle');
    spinBtnText.textContent = t('spinning');
    controlsHint.textContent = t('goodLuck');

    // Pick random winner
    const winnerIdx  = Math.floor(Math.random() * activeChars.length);
    const winner     = activeChars[winnerIdx];

    // Logo internal wheel animation
    wheelIcon.classList.remove('wheel-spinning');
    void wheelIcon.offsetWidth; // trigger reflow
    wheelIcon.classList.add('wheel-spinning');

    // Calculate target position
    const { step }   = getCardMetrics();
    const vpWidth    = viewport.offsetWidth;
    const centerOff  = vpWidth / 2 - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-w')) / 2;
    const targetCard = (TARGET_REP * activeChars.length) + winnerIdx;
    const randomOff  = (Math.random() - 0.5) * (step * 0.3); // slight offset for realism
    const targetX    = -(targetCard * step) + centerOff + randomOff;

    // Duration with slight randomization
    const duration = SPIN_DURATION + (Math.random() - 0.5) * 1;

    // Force a reflow, then start animation
    void strip.offsetHeight;
    requestAnimationFrame(() => {
        strip.style.transition = `transform ${duration}s cubic-bezier(0.12, 0.82, 0.15, 1.0)`;
        strip.style.transform  = `translateX(${targetX}px)`;
        lastTickIdx = -1;
        trackTicks();
    });

    // On animation end
    const onEnd = () => {
        strip.removeEventListener('transitionend', onEnd);
        onSpinComplete(winner, targetCard);
    };
    strip.addEventListener('transitionend', onEnd);
}

// ── Tick Tracking ───────────────────────────────────
function trackTicks() {
    if (!isSpinning) return;

    const style     = getComputedStyle(strip);
    const matrix    = new DOMMatrix(style.transform);
    const currentX  = matrix.m41;
    const { step }  = getCardMetrics();
    const cardW     = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-w'));
    const cardIdx   = Math.floor((-currentX + cardW / 2) / step);

    if (cardIdx !== lastTickIdx && cardIdx > lastTickIdx) {
        lastTickIdx = cardIdx;
        playTick();
    }

    requestAnimationFrame(trackTicks);
}

// ── Spin Complete ───────────────────────────────────
function onSpinComplete(winner, targetCardIdx) {
    isSpinning = false;

    // Highlight winning card
    const cards = strip.querySelectorAll('.roulette-card');
    if (cards[targetCardIdx]) {
        cards[targetCardIdx].classList.add('winner');
    }

    // Play win sound
    playWinSound();

    // Show result after a brief pause
    setTimeout(() => {
        showResult(winner);
        addToHistory(winner);
    }, 450);

    // Stop logo animation gracefully
    // (In CSS we use 'forwards', so it stays at final position)

    // Re-enable button
    spinBtn.disabled = false;
    spinBtnText.textContent = t('spin');
    spinBtn.classList.add('idle');
    controlsHint.textContent = '';
}

// ── Result Overlay ──────────────────────────────────
function showResult(char) {
    resultImg.src = char.image;
    resultImg.alt = char.name;
    resultName.textContent = char.name.toUpperCase();
    
    // Description and profile link
    resultDesc.textContent = currentLang === 'es' ? char.desc : DESCRIPTIONS_EN[char.slug];
    profileBtn.href = `https://lastflag.com/contestants/${char.slug}`;

    resultOverlay.classList.remove('hidden');

    // Re-trigger modal animation
    resultModal.style.animation = 'none';
    void resultModal.offsetHeight;
    resultModal.style.animation = '';

    // Confetti burst
    launchConfetti();
}

function hideResult() {
    resultOverlay.classList.add('hidden');
}

// ── History System ──────────────────────────────────
function addToHistory(char) {
    pinHistory.unshift(char);
    if (pinHistory.length > MAX_HISTORY) pinHistory.pop();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    pinHistory.forEach(char => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.title = char.name;

        const img = document.createElement('img');
        img.src = char.image;
        img.alt = char.name;

        item.appendChild(img);
        historyList.appendChild(item);
    });
}

// ── Confetti System ─────────────────────────────────
const confettiParticles = [];
let confettiRunning = false;

function launchConfetti() {
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const cx = confettiCanvas.width / 2;
    const cy = confettiCanvas.height * 0.38;
    const count = 180;
    const colors = ['#f5a623', '#ffd700', '#ff6347', '#e74c3c', '#ffffff', '#fbbf24', '#22d3ee'];

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 9;
        confettiParticles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed * (0.6 + Math.random()),
            vy: Math.sin(angle) * speed - 3,
            size: 3 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            life: 1,
            decay: 0.006 + Math.random() * 0.009,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
        });
    }

    if (!confettiRunning) {
        confettiRunning = true;
        animateConfetti();
    }
}

function animateConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const p = confettiParticles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.16;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;

        if (p.life <= 0) {
            confettiParticles.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    if (confettiParticles.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        confettiRunning = false;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

// ── Event Listeners ─────────────────────────────────
spinBtn.addEventListener('click', spin);

resultBtn.addEventListener('click', () => {
    hideResult();
    setTimeout(spin, 350);
});

resultBackdrop.addEventListener('click', hideResult);

soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    localStorage.setItem('lf-roulette-sound', soundEnabled ? '1' : '0');
});

langToggleBtn.addEventListener('click', () => {
    if (isSpinning) return;
    currentLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('lf-roulette-lang', currentLang);
    updateLanguage();
});

function updateLanguage() {
    // Toggle button display
    const nextLang = currentLang === 'es' ? 'en' : 'es';
    langFlag.textContent = nextLang === 'en' ? '🇬🇧' : '🇪🇸';
    langLabel.textContent = nextLang.toUpperCase();
    langToggleBtn.title = t('langTitle');
    soundToggleBtn.title = t('soundTitle');

    // Header
    subtitleEl.textContent = t('subtitle');

    // Spin button
    if (!isSpinning) {
        spinBtnText.textContent = t('spin');
    }

    // Controls hint
    const canSpin = enabledSlugs.size >= 2;
    if (!isSpinning) {
        controlsHint.textContent = canSpin ? t('hintDefault') : t('hintMinChars');
    }

    // Toggle section
    toggleLabelEl.innerHTML = `${t('toggleLabel')} <span class="toggle-count" id="toggle-count">(${enabledSlugs.size}/${CHARACTERS.length})</span>`;

    // Result overlay
    resultSubtitleEl.textContent = t('resultSubtitle');
    resultBtn.textContent = t('spinAgain');

    // History label
    historyLabel.textContent = t('history');

    // Profile button
    profileBtn.textContent = t('viewProfile');

    // Update result description if visible
    if (!resultOverlay.classList.contains('hidden')) {
        const currentName = resultName.textContent.toLowerCase();
        const char = CHARACTERS.find(c => c.name.toLowerCase() === currentName);
        if (char) {
            resultDesc.textContent = currentLang === 'es' ? char.desc : DESCRIPTIONS_EN[char.slug];
        }
    }

    // HTML lang attribute
    document.documentElement.lang = currentLang;
}

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (resultOverlay.classList.contains('hidden')) {
            spin();
        } else {
            hideResult();
            setTimeout(spin, 350);
        }
    }
    if (e.code === 'Escape') hideResult();
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (!isSpinning) buildStrip();
        confettiCanvas.width  = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }, 200);
});

// ── Init ────────────────────────────────────────────
function init() {
    // Restore sound preference
    const savedSound = localStorage.getItem('lf-roulette-sound');
    if (savedSound === '0') {
        soundEnabled = false;
        soundIcon.textContent = '🔇';
    }

    // Restore language preference
    const savedLang = localStorage.getItem('lf-roulette-lang');
    if (savedLang && TRANSLATIONS[savedLang]) {
        currentLang = savedLang;
    }

    buildToggleGrid();
    buildStrip();
    spinBtn.classList.add('idle');
    updateLanguage();

    // Preload images
    CHARACTERS.forEach(c => {
        const img = new Image();
        img.src = c.image;
    });
}

init();
