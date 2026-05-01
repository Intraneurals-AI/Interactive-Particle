const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, vX: 0, vY: 0, lastX: 0, lastY: 0 };
const particleCount = 800; // Adjust for density
const repulsionRadius = 100;
const returnForce = 0.05; // How fast they return home
const friction = 0.95;    // How much they "slide"

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.homeX = Math.random() * canvas.width;
    this.homeY = Math.random() * canvas.height;
    this.x = this.homeX;
    this.y = this.homeY;
    this.vX = 0;
    this.vY = 0;
    this.size = Math.random() * 2 + 1;
  }

  update(mouseSpeed) {
    // 1. Calculate distance from mouse
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // 2. Repulsion Logic
    if (distance < repulsionRadius) {
      let force = (repulsionRadius - distance) / repulsionRadius;
      let angle = Math.atan2(dy, dx);
      this.vX -= Math.cos(angle) * force * 10;
      this.vY -= Math.sin(angle) * force * 10;
    }

    // 3. Return to Home Force
    this.vX += (this.homeX - this.x) * returnForce;
    this.vY += (this.homeY - this.y) * returnForce;

    // 4. Apply Friction & Movement
    this.vX *= friction;
    this.vY *= friction;
    this.x += this.vX;
    this.y += this.vY;
  }

  draw(color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate mouse speed for color shifting
  let speed = Math.sqrt(mouse.vX ** 2 + mouse.vY ** 2);
  
  // Interpolate color: Blue (slow) to Red/Orange (fast)
  // Hue 220 is Blue, Hue 0 is Red.
  let hue = Math.max(0, 220 - (speed * 15));
  let color = `hsla(${hue}, 100%, 70%, 0.8)`;

  particles.forEach(p => {
    p.update(speed);
    p.draw(color);
  });

  // Calculate velocity for next frame
  mouse.vX = mouse.x - mouse.lastX;
  mouse.vY = mouse.y - mouse.lastY;
  mouse.lastX = mouse.x;
  mouse.lastY = mouse.y;

  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

init();
animate();
