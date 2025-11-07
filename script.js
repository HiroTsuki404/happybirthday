// 🌸 Section navigation
const sections = document.querySelectorAll('section');
function showSection(id) {
  // Pastikan semua section disembunyikan dan status "active" di-reset
  sections.forEach(sec => {
    sec.classList.add('hidden');
    sec.classList.remove('active');
  });

  // Tampilkan section target dengan menambahkan kelas `active`
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }
  // Tampilkan/sempunyikan tombol kembali: hanya tampil jika bukan di opening
  const backBtn = document.getElementById('backButton');
  if (backBtn) {
    if (id === 'opening') backBtn.classList.add('hidden'); else backBtn.classList.remove('hidden');
  }
}

// 🌼 Navigation buttons
document.getElementById('startButton').onclick = () => showSection('gallery');
document.getElementById('toMessage').onclick = () => showSection('message');
document.getElementById('toSurprise').onclick = () => {
  showSection('surprise');
  burstConfetti();
  startHearts();
};

// 📸 Slideshow
const slides = [
  { src: 'images/1.jpg', cap: 'First meet 💕 — 15 Januari 2023' },
  { src: 'images/2.jpg', cap: 'Her cutest smile 😍' },
  { src: 'images/3.jpg', cap: 'Malam itu bintang kalah cantik ✨' },
  { src: 'images/4.jpg', cap: 'Our little adventure 🎈' }
];
let index = 0;

const galleryImage = document.getElementById('galleryImage');
const caption = document.getElementById('caption');
const dotsWrap = document.getElementById('dots');

function renderDots() {
  dotsWrap.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === index ? ' active' : '');
    dot.onclick = () => goTo(i);
    dotsWrap.appendChild(dot);
  });
}

function goTo(i) {
  index = (i + slides.length) % slides.length;
  galleryImage.src = slides[index].src;
  caption.textContent = slides[index].cap;
  renderDots();
}

document.getElementById('next').onclick = () => goTo(index + 1);
document.getElementById('prev').onclick = () => goTo(index - 1);

renderDots();
goTo(0);
// Auto-slide removed per request: slides advance only via user interaction

// Back button handler: go to previous section in document order
const backButton = document.getElementById('backButton');
if (backButton) {
  backButton.addEventListener('click', () => {
    const secList = Array.from(sections);
    const currentIndex = secList.findIndex(s => s.classList.contains('active'));
    if (currentIndex > 0) showSection(secList[currentIndex - 1].id);
  });
}

// 💌 Secret Message
const secretBox = document.getElementById('secretBox');
const revealed = document.getElementById('revealedMessage');
secretBox.onclick = () => {
  secretBox.classList.add('hidden');
  revealed.classList.remove('hidden');
};

// 🎉 Confetti
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function spawnConfetti(count = 200) {
  const colors = ['#ffb6c1', '#ffd700', '#fff4f8', '#ff69b4'];
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: -10,
      r: 2 + Math.random() * 4,
      s: 1 + Math.random() * 3,
      c: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach(p => {
    p.y += p.s;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  // Remove pieces that have fallen past the bottom
  confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 10);

  // Continue animating while there are pieces on screen. When no pieces remain,
  // stop the animation loop so the canvas is left clear (avoids frozen confetti).
  if (confettiPieces.length > 0) {
    requestAnimationFrame(drawConfetti);
  } else {
    confettiRunning = false;
    // final clear to ensure nothing left on canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function burstConfetti() {
  // Start confetti and let drawConfetti stop automatically when pieces exit
  if (!confettiRunning) {
    confettiRunning = true;
    spawnConfetti(250);
    drawConfetti();
  } else {
    // If already running, spawn additional pieces
    spawnConfetti(120);
  }
}

// 💕 Floating Hearts
const heartsWrap = document.getElementById('hearts');
let heartsTimer = null;

function createHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = '❤';
  h.style.left = Math.random() * 100 + 'vw';
  h.style.bottom = '-10vh';
  const duration = 3000 + Math.random() * 2000;
  h.style.animationDuration = duration + 'ms';
  h.style.fontSize = 14 + Math.random() * 16 + 'px';
  h.style.color = Math.random() > 0.5 ? '#ff69b4' : '#ffd700';
  heartsWrap.appendChild(h);
  setTimeout(() => h.remove(), duration);
}

function startHearts() {
  if (heartsTimer) clearInterval(heartsTimer);
  for (let i = 0; i < 12; i++) createHeart();
  heartsTimer = setInterval(createHeart, 300);
  setTimeout(() => clearInterval(heartsTimer), 6000);
}
