// --- State Management ---
function switchMode(mode) {
    document.querySelectorAll('.mode-layer').forEach(el => el.classList.add('hidden'));
    if (mode === 'magnetic') document.getElementById('grid-container').classList.remove('hidden');
    if (mode === 'liquid') document.getElementById('liquid-container').classList.remove('hidden');
    if (mode === 'particles') document.getElementById('particle-canvas').classList.remove('hidden');
}

// --- 1. Magnetic Grid Logic ---
const grid = document.getElementById('grid-container');
function initGrid() {
    grid.innerHTML = '';
    const count = Math.ceil((window.innerWidth * window.innerHeight) / (35 * 35));
    for (let i = 0; i < count; i++) {
        const d = document.createElement('div');
        d.className = 'dot';
        grid.appendChild(d);
    }
}

// --- 2. Particles Engine ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = { x: -1000, y: -1000, lastX: 0, lastY: 0, vX: 0, vY: 0 };

class Particle {
    constructor() {
        this.homeX = Math.random() * canvas.width;
        this.homeY = Math.random() * canvas.height;
        this.x = this.homeX; this.y = this.homeY;
        this.vX = 0; this.vY = 0;
    }
    update(speed) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
            let angle = Math.atan2(dy, dx);
            this.vX -= Math.cos(angle) * 5;
            this.vY -= Math.sin(angle) * 5;
        }
        this.vX += (this.homeX - this.x) * 0.05;
        this.vY += (this.homeY - this.y) * 0.05;
        this.vX *= 0.9; this.vY *= 0.9;
        this.x += this.vX; this.y += this.vY;
    }
}

for(let i=0; i<600; i++) particles.push(new Particle());

// --- Global Animation & Interaction ---
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Track velocity for color
    mouse.vX = mouse.x - mouse.lastX;
    mouse.vY = mouse.y - mouse.lastY;
    let speed = Math.sqrt(mouse.vX**2 + mouse.vY**2);
    let hue = Math.max(0, 200 - (speed * 10));

    particles.forEach(p => {
        p.update();
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
        ctx.fillRect(p.x, p.y, 2, 2);
    });

    mouse.lastX = mouse.x; mouse.lastY = mouse.y;
    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Magnetic rotation
    document.querySelectorAll('.dot').forEach(dot => {
        const rect = dot.getBoundingClientRect();
        const angle = Math.atan2(e.clientY - (rect.top + 7), e.clientX - (rect.left + 1));
        dot.style.transform = `rotate(${angle + (Math.PI/2)}rad)`;
    });

    // Liquid glass vars
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

initGrid();
animate();
