<template>
  <div class="fixed inset-0 -z-10 opacity-50" aria-hidden="true">
    <div class="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-950"></div>
    <div class="absolute inset-0">
      <canvas ref="canvas" class="h-full w-full"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvas = ref(null);
let animationFrameId = null;
let ctx = null;
let particles = [];

const PARAMS = {
  particleCount: 100,
  particleSize: 2,
  speed: 0.5,
  lineDistance: 150,
  lineWidth: 0.5
};

function initParticles() {
  particles = [];
  const canvasEl = canvas.value;
  const width = canvasEl.width;
  const height = canvasEl.height;

  for (let i = 0; i < PARAMS.particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * PARAMS.speed,
      vy: (Math.random() - 0.5) * PARAMS.speed,
      size: Math.random() * PARAMS.particleSize + 1
    });
  }
}

function resizeCanvas() {
  const canvasEl = canvas.value;
  const dpr = window.devicePixelRatio || 1;
  
  // Set canvas dimensions
  canvasEl.width = window.innerWidth * dpr;
  canvasEl.height = window.innerHeight * dpr;
  
  // Scale context for high DPI displays
  ctx.scale(dpr, dpr);
  
  // Reinitialize particles
  initParticles();
}

function draw() {
  if (!canvas.value) return;
  
  const canvasEl = canvas.value;
  const width = canvasEl.width;
  const height = canvasEl.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw particles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Handle edge cases
    if (p.x < 0) p.x = width;
    if (p.y < 0) p.y = height;
    if (p.x > width) p.x = 0;
    if (p.y > height) p.y = 0;
    
    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Connect particles with lines
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < PARAMS.lineDistance) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / PARAMS.lineDistance})`;
        ctx.lineWidth = PARAMS.lineWidth;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
  
  animationFrameId = requestAnimationFrame(draw);
}

onMounted(() => {
  ctx = canvas.value.getContext('2d');
  resizeCanvas();
  
  window.addEventListener('resize', resizeCanvas);
  animationFrameId = requestAnimationFrame(draw);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>