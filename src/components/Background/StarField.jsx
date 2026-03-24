import { useEffect, useRef } from 'react';

const STAR_COUNT = 220;
const SHOOTING_STAR_INTERVAL_MIN = 2500; // ms
const SHOOTING_STAR_INTERVAL_MAX = 6000;
const GRID_COLS = 24;
const GRID_ROWS = 16;

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function initStars(width, height) {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: randomRange(0.4, 2.0),
    alpha: randomRange(0.3, 1.0),
    alphaDir: Math.random() < 0.5 ? 1 : -1,
    alphaSpeed: randomRange(0.002, 0.008),
    drift: randomRange(-0.05, 0.05),
  }));
}

function initShootingStar(width, height) {
  const angle = randomRange(-0.3, -0.15); // slight downward angle
  const speed = randomRange(8, 18);
  return {
    x: randomRange(width * 0.1, width * 0.9),
    y: randomRange(0, height * 0.4),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed + randomRange(2, 5),
    length: randomRange(120, 260),
    alpha: 1,
    done: false,
  };
}

function initParticles(width, height) {
  return Array.from({ length: 35 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: randomRange(1, 3),
    alpha: randomRange(0.2, 0.6),
    vx: randomRange(-0.15, 0.15),
    vy: randomRange(-0.2, -0.05),
    color: Math.random() < 0.5 ? '0,255,65' : '0,212,255',
  }));
}

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let stars = initStars(width, height);
    let particles = initParticles(width, height);
    let shootingStars = [];
    let nextShootingStarTime = Date.now() + randomRange(1500, 3500);
    let animId;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars = initStars(width, height);
      particles = initParticles(width, height);
    };
    window.addEventListener('resize', resize);

    // ---- Grid drawing helper ----
    const drawGrid = () => {
      const cellW = width / GRID_COLS;
      const cellH = height / GRID_ROWS;
      ctx.strokeStyle = 'rgba(0,255,65,0.028)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);

      for (let c = 0; c <= GRID_COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellW, 0);
        ctx.lineTo(c * cellW, height);
        ctx.stroke();
      }
      for (let r = 0; r <= GRID_ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellH);
        ctx.lineTo(width, r * cellH);
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle grid
      drawGrid();

      // 2. Stars
      stars.forEach((s) => {
        // Twinkle
        s.alpha += s.alphaDir * s.alphaSpeed;
        if (s.alpha >= 1) { s.alpha = 1; s.alphaDir = -1; }
        if (s.alpha <= 0.15) { s.alpha = 0.15; s.alphaDir = 1; }
        // Slow drift
        s.x += s.drift;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();

        // Tiny glow for larger stars
        if (s.radius > 1.4) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,220,255,${s.alpha * 0.08})`;
          ctx.fill();
        }
      });

      // 3. Shooting stars
      const now = Date.now();
      if (now >= nextShootingStarTime && shootingStars.length < 3) {
        shootingStars.push(initShootingStar(width, height));
        nextShootingStarTime = now + randomRange(SHOOTING_STAR_INTERVAL_MIN, SHOOTING_STAR_INTERVAL_MAX);
      }

      shootingStars = shootingStars.filter((ss) => !ss.done);
      shootingStars.forEach((ss) => {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.alpha -= 0.013;
        if (ss.alpha <= 0 || ss.x > width + 50 || ss.y > height + 50) {
          ss.done = true;
          return;
        }

        const tailX = ss.x - (ss.vx / Math.hypot(ss.vx, ss.vy)) * ss.length;
        const tailY = ss.y - (ss.vy / Math.hypot(ss.vx, ss.vy)) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.7, `rgba(200,240,255,${ss.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(255,255,255,${ss.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(180,230,255,0.8)';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Bright head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${ss.alpha})`;
        ctx.fill();
      });

      // 4. Floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Gentle pulse
        p.alpha += Math.sin(Date.now() * 0.001 + p.x) * 0.003;
        p.alpha = Math.max(0.1, Math.min(0.65, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${p.color},0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
