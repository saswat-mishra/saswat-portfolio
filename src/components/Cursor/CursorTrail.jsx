import { useEffect, useRef, useCallback } from 'react';

// Each ripple: { x, y, radius, maxRadius, alpha, speed }
const RIPPLE_MAX_RADIUS = 60;
const RIPPLE_SPEED = 1.8;
const RIPPLE_SPAWN_INTERVAL = 60; // ms between ripples on move
const CURSOR_DOT_RADIUS = 4;
const CURSOR_RING_RADIUS = 14;
const NEON_GREEN = '#00ff41';
const NEON_GREEN_RGB = '0, 255, 65';

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const targetMouse = useRef({ x: -200, y: -200 });
  const ripples = useRef([]);
  const lastRippleTime = useRef(0);
  const animFrameId = useRef(null);
  const isHoveringInteractive = useRef(false);
  const cursorRingScale = useRef(1);

  const spawnRipple = useCallback((x, y) => {
    ripples.current.push({
      x,
      y,
      radius: 2,
      maxRadius: RIPPLE_MAX_RADIUS + Math.random() * 20,
      alpha: 0.7,
      speed: RIPPLE_SPEED + Math.random() * 0.8,
      lineWidth: 1.5 + Math.random() * 0.5,
    });
    // Cap array to avoid memory build-up
    if (ripples.current.length > 40) {
      ripples.current.splice(0, ripples.current.length - 40);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking
    const onMouseMove = (e) => {
      targetMouse.current = { x: e.clientX, y: e.clientY };
      const now = Date.now();
      if (now - lastRippleTime.current > RIPPLE_SPAWN_INTERVAL) {
        spawnRipple(e.clientX, e.clientY);
        lastRippleTime.current = now;
      }
    };

    // Detect interactive element hover
    const onMouseOver = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInteractive =
        tag === 'a' ||
        tag === 'button' ||
        e.target.getAttribute('role') === 'button' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.style.cursor === 'pointer' ||
        window.getComputedStyle(e.target).cursor === 'pointer';
      isHoveringInteractive.current = !!isInteractive;
    };

    // Spawn burst of ripples on click
    const onClick = (e) => {
      for (let i = 0; i < 4; i++) {
        ripples.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 2,
          maxRadius: 80 + i * 20,
          alpha: 0.9 - i * 0.15,
          speed: 2 + i * 0.5,
          lineWidth: 2 - i * 0.3,
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('click', onClick);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth cursor dot lerp
      mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.18;
      mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.18;

      const cx = mouse.current.x;
      const cy = mouse.current.y;

      // -- Draw ripples --
      ripples.current = ripples.current.filter((r) => r.alpha > 0.01);
      ripples.current.forEach((r) => {
        r.radius += r.speed;
        r.alpha = Math.max(0, r.alpha - 0.012);

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${NEON_GREEN_RGB}, ${r.alpha})`;
        ctx.lineWidth = r.lineWidth * r.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = NEON_GREEN;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // -- Draw cursor --
      const hovering = isHoveringInteractive.current;

      // Target ring scale
      const targetScale = hovering ? 2.2 : 1;
      cursorRingScale.current += (targetScale - cursorRingScale.current) * 0.12;
      const ringR = CURSOR_RING_RADIUS * cursorRingScale.current;

      if (hovering) {
        // Crosshair style
        const crossSize = ringR + 8;
        ctx.strokeStyle = NEON_GREEN;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = NEON_GREEN;

        // Crosshair lines
        const gap = 5;
        ctx.beginPath();
        ctx.moveTo(cx - crossSize, cy);
        ctx.lineTo(cx - gap, cy);
        ctx.moveTo(cx + gap, cy);
        ctx.lineTo(cx + crossSize, cy);
        ctx.moveTo(cx, cy - crossSize);
        ctx.lineTo(cx, cy - gap);
        ctx.moveTo(cx, cy + gap);
        ctx.lineTo(cx, cy + crossSize);
        ctx.stroke();

        // Outer ring
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${NEON_GREEN_RGB}, 0.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Small center dot
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fillStyle = NEON_GREEN;
        ctx.fill();
      } else {
        // Normal: inner dot + outer ring
        // Outer ring
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${NEON_GREEN_RGB}, 0.6)`;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = NEON_GREEN;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner dot
        ctx.beginPath();
        ctx.arc(cx, cy, CURSOR_DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = NEON_GREEN;
        ctx.shadowBlur = 14;
        ctx.shadowColor = NEON_GREEN;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animFrameId.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('click', onClick);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [spawnRipple]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  );
}
