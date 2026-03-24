import { useEffect, useRef, useState, useMemo, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ─── Preload GLBs at module level ─────────────────────────────────────────────
useGLTF.preload('/models/iphone.glb');
useGLTF.preload('/models/macbook2.glb');

// ─── Projects Data ────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1, title: 'AI B2B Lead Engine', subtitle: 'LangGraph Multi-Agent', mockup: 'macbook',
    videoSrc: '/videos/portfolio/B2B Leads Agent.mp4',
    category: 'Multi-Agent AI', status: 'DELIVERED',
    tags: ['LangGraph', 'LangChain', 'GPT-4o', 'Twilio', 'Retell AI', 'Streamlit', 'Pydantic v2'],
    description: '6-agent hub-and-spoke StateGraph for end-to-end B2B sales automation. MEDDIC qualification scoring (0-60), omnichannel outreach via LinkedIn + email + AI voice calls. 7 embedded sales frameworks. Real-time Streamlit dashboard with human-in-the-loop review. 124 tests.',
    testimonial: null,
    upworkUrl: 'https://www.upwork.com/att/download/portfolio/persons/uid/1277724957784838144/profile/projects/files/823463c2-a499-4198-9c3f-838f52b1ff18',
  },
  {
    id: 2, title: 'Podit', subtitle: 'AI Voice Event Agent', mockup: 'iphone',
    videoSrc: '/videos/podit.mp4',
    category: 'AI Voice Agent', status: 'LIVE',
    tags: ['LangChain', 'LangGraph', 'OpenAI', 'Twilio', 'React Native', 'Supabase'],
    description: 'Hybrid voice/text AI agent for intelligent event planning & scheduling. Detects conflicts, integrates Google Calendar, respects user preferences (sleep/work hours) via dynamic guardrails.',
    testimonial: { quote: 'A dependable engineer who can be trusted with complex, high-stakes work', author: 'Ajay S., Founder' },
  },
  {
    id: 3, title: 'Hyper-real Avatar Pipeline', subtitle: 'Virtual Influencer System', mockup: 'macbook',
    videoSrc: '/videos/portfolio/AI Video generated pipeline.mp4',
    category: 'Generative AI', status: 'DELIVERED',
    tags: ['HeyGen', 'Flux Kontext', 'ElevenLabs', 'Stable Diffusion', 'AI Video'],
    description: 'End-to-end pipeline converting text scripts to hyper-real lip-synced avatar videos. Character consistency, outfit/background/pose variations, scalable branded content at scale for B2B marketing.',
    testimonial: { quote: 'Already produced strong ROI for the business', author: 'Aiden S., Founder & CEO' },
    upworkUrl: 'https://www.upwork.com/att/download/portfolio/persons/uid/1277724957784838144/profile/projects/files/2ea5a5dd-3468-41aa-95a3-1f6e87d836e1',
  },
  {
    id: 4, title: 'MoneyPulse', subtitle: 'Gen AI Financial Reels', mockup: 'iphone',
    videoSrc: '/videos/moneypulse.mp4',
    category: 'Generative AI', status: 'LIVE',
    tags: ['Gen AI', 'Video Pipeline', 'Web Scraping', 'Market Data', 'Automation'],
    description: 'Real-time financial news reels powered by a fully automated Gen AI video pipeline. Scrapes market data, generates AI video summaries in news-reel format — raw data to publishable video.',
    testimonial: null,
  },
  {
    id: 5, title: 'MetaHuman AI Avatar', subtitle: 'Real-Time Speech + LLM', mockup: 'macbook',
    videoSrc: '/videos/portfolio/Metahuman AI avatar.mp4',
    category: 'Real-time AI', status: 'DELIVERED',
    tags: ['Unreal Engine 5', 'MetaHuman', 'NVIDIA Audio2Face', 'GPT-4', 'Pixel Streaming', 'STT'],
    description: 'Interactive MetaHuman in UE5 with live STT → GPT-4 → AI voice + facial animation pipeline. Delivered via Pixel Streaming. Production-ready AI assistant for immersive web-based experiences.',
    testimonial: { quote: 'Saswat is an excellent resource. I would 100% recommend working with him.', author: 'Reeyan, SDK Integration' },
    upworkUrl: 'https://www.upwork.com/att/download/portfolio/persons/uid/1277724957784838144/profile/projects/files/faee5870-b17d-4874-a158-e386e3565d16',
  },
  {
    id: 6, title: 'AI Conversational NPC', subtitle: 'Ready Player Me + GPT', mockup: 'macbook',
    videoSrc: '/videos/portfolio/AI conveersational NPC.mp4',
    category: '3D / Gaming', status: 'DELIVERED',
    tags: ['Unreal Engine 5', 'Ready Player Me', 'ChatGPT', 'TTS', '3D Animation', 'Facial Sync'],
    description: 'AI NPC with full facial animation. Voice input → ChatGPT processing → TTS with real-time lip-sync. Built on Ready Player Me character with immersive gameplay interaction.',
    testimonial: null,
    upworkUrl: 'https://www.upwork.com/att/download/portfolio/persons/uid/1277724957784838144/profile/projects/files/6894ccd7-ec55-4578-8a26-1f263bb3cf7f',
  },
  {
    id: 7, title: 'Creatospace', subtitle: '3D Multiplayer Metaverse', mockup: 'macbook',
    videoSrc: '/videos/portfolio/Creatospace.mp4',
    category: '3D / Gaming', status: 'LAUNCHED',
    tags: ['Unreal Engine 5', 'AWS GameLift', 'Multiplayer', 'Spatial Audio', 'AjnaLens VR'],
    description: 'Cross-platform 3D multiplayer metaverse with spatial voice chat, screen sharing & in-game media. 1200+ users. Partnered with AjnaLens VR for immersive hardware integration.',
    testimonial: null,
  },
  {
    id: 8, title: 'Real-time Pose Tracking', subtitle: 'RGB Camera → Unreal Engine', mockup: 'macbook',
    videoSrc: '/videos/portfolio/Real-time Pose tracking.mp4',
    category: 'Computer Vision', status: 'DELIVERED',
    tags: ['Unreal Engine 5', 'OpenCV', 'YOLO', 'Deep Learning', 'Real-time', '2D→3D Transform'],
    description: 'Multiplayer 3D cricket stadium in UE5 with players animated in real-time from RGB camera feed using OpenCV + YOLO motion tracking and 2D-to-3D matrix transformation.',
    testimonial: null,
    upworkUrl: 'https://www.upwork.com/att/download/portfolio/persons/uid/1277724957784838144/profile/projects/files/ad94024a-f241-423c-8b5b-80b8617eece2',
  },
];

// ─── Status Colors ────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  LIVE:        { bg: 'rgba(0,255,65,0.15)',   border: '#00ff41', text: '#00ff41' },
  DELIVERED:   { bg: 'rgba(0,212,255,0.15)',  border: '#00d4ff', text: '#00d4ff' },
  LAUNCHED:    { bg: 'rgba(255,165,0,0.15)',  border: '#ffaa00', text: '#ffaa00' },
  IN_PROGRESS: { bg: 'rgba(100,149,237,0.15)', border: '#6495ed', text: '#6495ed' },
};

// ─── Terminal canvas draw ──────────────────────────────────────────────────────
function drawTerminal(canvas, frame, title, tags, deviceType, status, description) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const isPhone = deviceType === 'iphone';
  const fs = isPhone ? 28 : 32;
  const pad = isPhone ? 28 : 48;
  const lineH = isPhone ? 40 : 50;

  ctx.fillStyle = '#0a1f10';
  ctx.fillRect(0, 0, w, h);

  for (let y = 0; y < h; y += 6) {
    ctx.fillStyle = 'rgba(0,255,65,0.018)';
    ctx.fillRect(0, y, w, 1);
  }

  ctx.strokeStyle = 'rgba(0,255,65,0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  const headerH = lineH + 24;
  ctx.fillStyle = 'rgba(0,255,65,0.12)';
  ctx.fillRect(6, 6, w - 12, headerH);

  const dotY = 6 + headerH / 2;
  const dotR = isPhone ? 9 : 10;
  const dotSpacing = isPhone ? 34 : 38;
  [['#ff5f57', dotSpacing], ['#febc2e', dotSpacing * 2], ['#28c840', dotSpacing * 3]].forEach(([color, x]) => {
    ctx.beginPath();
    ctx.arc(x, dotY, dotR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  ctx.font = `bold ${fs + 2}px monospace`;
  ctx.fillStyle = '#00ff41';
  ctx.globalAlpha = 1;
  const maxChars = isPhone ? 16 : 26;
  const shortTitle = title.length > maxChars ? title.slice(0, maxChars - 1) + '\u2026' : title;
  ctx.fillText(`\u25b6 ${shortTitle}`, pad + (isPhone ? 0 : 100), 6 + headerH / 2 + (fs + 2) / 3);

  const statusLabel = status || 'DELIVERED';
  const statusColor = statusLabel === 'LIVE' ? '#00ff41' : statusLabel === 'LAUNCHED' ? '#ffaa00' : '#00d4ff';

  ctx.font = `bold ${fs - 6}px monospace`;
  ctx.fillStyle = statusColor;
  ctx.globalAlpha = 0.9;
  const badgeText = `\u25cf ${statusLabel}`;
  const badgeX = w - pad - ctx.measureText(badgeText).width;
  ctx.fillText(badgeText, badgeX, 6 + headerH / 2 + (fs - 6) / 3);
  ctx.globalAlpha = 1;

  const stackTags = (tags || []).slice(0, 4).join('  \u00b7  ');

  const bullets = [];
  if (description) {
    const sentences = description.split(/\.\s+/);
    const maxLen = isPhone ? 32 : 50;
    sentences.forEach(s => {
      const trimmed = s.trim().replace(/\.$/, '');
      if (trimmed.length > 10) {
        bullets.push(trimmed.length > maxLen ? trimmed.slice(0, maxLen - 1) + '\u2026' : trimmed);
      }
    });
  }

  const contentLines = [
    { t: `$ run --project "${(tags || [])[0] || 'AI'}"`, c: '#5b7069' },
    { t: `> INITIALIZING...`, c: '#00d4ff' },
    { t: ``, c: '' },
    { t: isPhone ? `STACK:` : `TECH STACK:`, c: '#8892a4' },
    { t: `  ${stackTags}`, c: '#00d4ff' },
    { t: ``, c: '' },
    { t: isPhone ? `FEATURES:` : `KEY FEATURES:`, c: '#8892a4' },
    ...bullets.slice(0, isPhone ? 3 : 4).map(b => ({ t: `  \u203a ${b}`, c: '#a8b8a8' })),
    { t: ``, c: '' },
    { t: isPhone ? `[ PLAY DEMO ]` : `[ \u25b6  PLAY DEMO FOR FULL VIDEO ]`, c: '#ffaa00' },
  ];

  const bodyStartY = 6 + headerH + pad;
  contentLines.forEach(({ t, c }, i) => {
    if (!t) return;
    if (frame < i * 12) return;
    ctx.font = `${fs}px monospace`;
    ctx.fillStyle = c;
    ctx.globalAlpha = i === contentLines.length - 1
      ? 0.6 + 0.4 * Math.sin(frame * 0.06)
      : 0.85 + 0.15 * Math.sin(frame * 0.04 + i * 0.8);
    ctx.fillText(t, pad, bodyStartY + i * lineH);
  });

  const lastVisible = Math.min(Math.floor(frame / 12), contentLines.length - 1);
  if (Math.floor(frame / 28) % 2 === 0) {
    ctx.fillStyle = '#00ff41';
    ctx.globalAlpha = 1;
    ctx.fillRect(pad, bodyStartY + lastVisible * lineH + 6, 14, fs - 4);
  }
  ctx.globalAlpha = 1;
}

// ─── DeviceModelWithScreen (inside Canvas) ────────────────────────────────────
function DeviceModelWithScreen({ gltfPath, videoSrc, visible, deviceType, projectTitle, projectTags, projectStatus, projectDescription, dragRef, swayDir }) {
  const { scene } = useGLTF(gltfPath);
  const { gl } = useThree();
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef();
  const termFrame = useRef(0);

  // Drag inertia state (local to this component)
  const dragOffset = useRef({ y: 0, x: 0 });
  const dragVel = useRef({ y: 0, x: 0 });

  // Video element — created without src for lazy loading.
  // Src is set in a separate effect when the card becomes visible.
  const videoRef = useRef(null);
  const videoReady = useRef(false);

  useEffect(() => {
    if (!videoSrc) return;
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.preload = 'none'; // lazy: don't load until visible
    v.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
    document.body.appendChild(v);
    videoRef.current = v;
    videoReady.current = false;
    return () => {
      v.pause();
      v.src = '';
      if (document.body.contains(v)) document.body.removeChild(v);
      videoRef.current = null;
      videoReady.current = false;
    };
  }, [videoSrc]);

  // Start loading and playing only when card becomes visible
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoSrc || !visible) return;
    if (!v.src) {
      v.src = videoSrc;
    }
    v.play().catch(() => {});
  }, [visible, videoSrc]);

  // High-resolution canvas + CanvasTexture
  // generateMipmaps=false + LinearFilter + max anisotropy = maximum sharpness
  const { drawCanvas, canvasTexture } = useMemo(() => {
    // iPhone: 9:16 (720×1280) matches standard portrait video + phone screen UV
    // MacBook: 16:9 (1440×900) matches widescreen screen mesh UV
    const w = deviceType === 'iphone' ? 720 : 1440;
    const h = deviceType === 'iphone' ? 1280 : 900;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    // Disable mipmaps — dynamic canvas textures become blurry with mipmapping
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    // Anisotropic filtering: critical for sharp rendering at oblique viewing angles
    t.anisotropy = gl.capabilities.getMaxAnisotropy();
    // MacBook GLB screen UV is horizontally flipped; this texture flip corrects terminal text.
    // Video content is separately corrected via canvas ctx flip in useFrame.
    if (deviceType === 'macbook') {
      t.repeat.set(-1, 1);
      t.offset.set(1, 0);
    }
    return { drawCanvas: canvas, canvasTexture: t };
  }, [deviceType, gl]);

  // Auto-scale using bounding box
  const { scale, center } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? 1.8 / maxDim : 1;
    const c = box.getCenter(new THREE.Vector3());
    return { scale: s, center: [-c.x * s, -c.y * s, -c.z * s] };
  }, [clonedScene]);

  // Apply canvas texture to screen mesh
  useEffect(() => {
    const screenName = deviceType === 'iphone' ? 'LLCOsMNMwTSiaFM_0' : 'SadnAkehSlxIwKv';
    clonedScene.traverse((node) => {
      if (node.isMesh && node.name === screenName) {
        node.material = new THREE.MeshStandardMaterial({
          map: canvasTexture,
          emissiveMap: canvasTexture,
          emissive: new THREE.Color(1, 1, 1),
          // ACESFilmic tone mapping crushes detail above ~1.5 emissiveIntensity.
          // MacBook: 1.2 (dim dashboard/recording content needs modest boost)
          // iPhone: 1.5 (portrait screens benefit from slightly more brightness)
          emissiveIntensity: deviceType === 'macbook' ? 1.2 : 1.5,
          side: THREE.DoubleSide,
          toneMapped: false,
          roughness: 0.05,
          metalness: 0,
        });
        node.material.needsUpdate = true;
      }
    });
  }, [clonedScene, canvasTexture, deviceType]);

  // Rotation targets (empirically confirmed):
  // MacBook: Y=0  → screen faces camera. Entrance rotates from PI (swayDir=1) or -PI (swayDir=-1).
  // iPhone:  Y=PI → front screen faces camera. Entrance from 0 (swayDir=1) or 2*PI (swayDir=-1).
  // swayDir=1 → entrance from right-back; swayDir=-1 → entrance from left-back.
  const targetY = deviceType === 'macbook' ? 0 : Math.PI;
  const targetX = deviceType === 'macbook' ? -0.15 : 0;
  const dir = swayDir ?? 1;
  const startY = deviceType === 'macbook'
    ? Math.PI * dir                       // ±PI → lerps clockwise or counterclockwise to 0
    : (dir === 1 ? 0 : 2 * Math.PI);     // 0 or 2PI → lerps to PI in opposite directions

  const rotY = useRef(startY);
  const rotX = useRef(0);
  const idleT = useRef(0);

  useEffect(() => {
    if (!visible) {
      rotX.current = 0;
      idleT.current = 0;
      termFrame.current = 0;
    }
  }, [visible]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Process drag input and apply inertia
    const drag = dragRef.current;
    if (drag.deltaY !== 0 || drag.deltaX !== 0) {
      dragVel.current.y = drag.deltaY;
      dragVel.current.x = drag.deltaX;
      dragOffset.current.y += drag.deltaY;
      dragOffset.current.x += drag.deltaX;
      drag.deltaY = 0;
      drag.deltaX = 0;
    } else if (!drag.active) {
      dragVel.current.y *= 0.92;
      dragVel.current.x *= 0.92;
      dragOffset.current.y += dragVel.current.y;
      dragOffset.current.x += dragVel.current.x;
    }
    // Clamp X drag to prevent upside-down flipping
    dragOffset.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, dragOffset.current.x));

    if (visible) {
      // Draw video (cover fit, mirror-corrected) or terminal animation to canvas
      {
        const cw = drawCanvas.width;
        const ch = drawCanvas.height;
        const videoEl = videoRef.current;
        const canDrawVideo = videoEl && (videoReady.current || (videoEl.readyState >= 2 && videoEl.videoWidth > 0));
        if (canDrawVideo) {
          const ctx = drawCanvas.getContext('2d');
          const vw = videoEl.videoWidth;
          const vh = videoEl.videoHeight;
          // iPhone: contain-fit (no horizontal overflow, respects phone screen bounds)
          // MacBook: cover-fit (fills widescreen area, crops vertically if needed)
          const sc = deviceType === 'iphone'
            ? Math.min(cw / vw, ch / vh)
            : Math.max(cw / vw, ch / vh);
          const sw = vw * sc;
          const sh = vh * sc;
          const dx = (cw - sw) / 2;
          const dy = (ch - sh) / 2;
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, cw, ch);
          // Mirror-correct the video: GLB screen mesh UVs are horizontally flipped.
          // For MacBook: canvas flip + UV texture flip = correct display.
          // For iPhone: canvas flip corrects the mirror without UV flip.
          ctx.save();
          ctx.translate(cw, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoEl, dx, dy, sw, sh);
          ctx.restore();
          videoReady.current = true;
        } else {
          drawTerminal(drawCanvas, termFrame.current, projectTitle || '', projectTags || [], deviceType, projectStatus, projectDescription || '');
          termFrame.current += 1;
        }
        canvasTexture.needsUpdate = true;
      }

      // Base animation: lerp from start to target
      rotY.current += (targetY - rotY.current) * Math.min(delta * 2.5, 0.12);
      rotX.current += (targetX - rotX.current) * Math.min(delta * 2.5, 0.12);
      const settled = Math.abs(rotY.current - targetY) < 0.03;
      let baseY, baseX;
      if (settled) {
        idleT.current += delta;
        // Alternate idle sway direction so adjacent projects rock opposite ways
        baseY = targetY + Math.sin(idleT.current * 0.5) * 0.04 * dir;
        baseX = rotX.current;
      } else {
        baseY = rotY.current;
        baseX = rotX.current;
      }
      groupRef.current.rotation.y = baseY + dragOffset.current.y;
      groupRef.current.rotation.x = baseX + dragOffset.current.x;
    } else {
      rotY.current += (startY - rotY.current) * Math.min(delta * 4, 0.3);
      groupRef.current.rotation.y = rotY.current + dragOffset.current.y;
      groupRef.current.rotation.x = dragOffset.current.x;
    }
  });

  return (
    <group ref={groupRef} position={center}>
      <primitive object={clonedScene} scale={scale} dispose={null} />
    </group>
  );
}

// ─── DeviceCanvas ─────────────────────────────────────────────────────────────
function DeviceCanvas({ project, visible, swayDir }) {
  const isIphone = project.mockup === 'iphone';
  const modelPath = isIphone ? '/models/iphone.glb' : '/models/macbook2.glb';
  const videoSrc = project.videoSrc || null;

  // Canvas display sizes — larger MacBook for better visual impact; iPhone at 9:16 (−10%)
  const canvasW = isIphone ? 234 : 560;
  const canvasH = isIphone ? 416 : 350;

  // Shared drag state between the wrapper div (pointer events) and the inner R3F component
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0, deltaY: 0, deltaX: 0 });

  const handlePointerDown = useCallback((e) => {
    dragRef.current.active = true;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    dragRef.current.deltaY = 0;
    dragRef.current.deltaX = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.deltaY += dx * 0.009;
    dragRef.current.deltaX += dy * 0.009;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: 'grab', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <Canvas
        camera={{ position: isIphone ? [0, 0, 3.5] : [0, 0.3, 3.2], fov: isIphone ? 40 : 38 }}
        dpr={Math.min(window.devicePixelRatio || 1, 2.5)}
        style={{
          width: `${canvasW}px`,
          height: `${canvasH}px`,
          maxWidth: '100%',
          display: 'block',
          flexShrink: 0,
        }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.85,
          powerPreference: 'high-performance',
        }}
      >
        <ambientLight intensity={0.8} color="#0a2210" />
        <directionalLight position={[2, 4, 3]} intensity={1.8} color="#00ff41" />
        <directionalLight position={[-2, 1, 2]} intensity={1.0} color="#00d4ff" />
        <pointLight position={[0, 0, 3]} intensity={2.0} color="#ffffff" distance={8} decay={2} />
        <pointLight position={[1, 2, 1]} intensity={1.2} color="#00ff41" distance={6} decay={2} />
        <Suspense fallback={null}>
          <DeviceModelWithScreen
            gltfPath={modelPath}
            videoSrc={videoSrc}
            visible={visible}
            deviceType={project.mockup}
            projectTitle={project.title}
            projectTags={project.tags}
            projectStatus={project.status}
            projectDescription={project.description}
            dragRef={dragRef}
            swayDir={swayDir}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ─── VideoModal ───────────────────────────────────────────────────────────────
function VideoModal({ project, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const videoSrc = project.videoSrc || null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(3,7,18,0.96)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        maxWidth: '900px', width: '100%',
        border: '1px solid rgba(0,255,65,0.3)',
        borderRadius: '16px',
        background: 'rgba(8,14,26,0.98)',
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(0,255,65,0.15), 0 0 120px rgba(0,255,65,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(0,255,65,0.12)', gap: '12px' }}>
          <span style={{ color: '#00ff41', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>▶ {project.title}</span>
          <span style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono', fontSize: '11px', opacity: 0.7 }}>— {project.subtitle}</span>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{ background: 'none', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '6px', color: '#ff6b6b', cursor: 'pointer', padding: '4px 12px', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
          >
            ✕ ESC
          </button>
        </div>
        <div style={{ position: 'relative', background: '#000', aspectRatio: project.mockup === 'iphone' ? '9/16' : '16/9', maxHeight: '70vh', overflow: 'hidden' }}>
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              loop
              playsInline
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#00ff41', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
              {'> VIDEO_NOT_AVAILABLE'}
            </div>
          )}
        </div>
        <div style={{ padding: '12px 20px', display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid rgba(0,255,65,0.08)' }}>
          {project.tags.map(t => (
            <span key={t} style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#00ff41', background: 'rgba(0,255,65,0.07)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '3px', padding: '2px 8px' }}>{t}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}

// ─── ProjectCard ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index, onPlay }) {
  const cardRef = useRef(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const statusColor = STATUS_COLORS[project.status] || STATUS_COLORS.DELIVERED;
  const isIphone = project.mockup === 'iphone';
  const hasDemo = !!project.videoSrc;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardVisible(true);
          setModelVisible(true);
        } else {
          setModelVisible(false);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        // Alternate: even index → model left, odd index → model right
        flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
        gap: '32px',
        background: 'linear-gradient(135deg, rgba(10,15,26,0.98) 0%, rgba(5,10,18,1) 100%)',
        border: `1px solid ${hovered ? 'rgba(0,255,65,0.5)' : 'rgba(0,255,65,0.18)'}`,
        borderRadius: '16px',
        padding: '32px',
        position: 'relative',
        cursor: 'default',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        opacity: cardVisible ? 1 : 0,
        transform: cardVisible
          ? hovered ? 'translateY(-4px)' : 'translateY(0)'
          : 'translateY(40px)',
        transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.35s ease, opacity 0.7s ease, border-color 0.2s ease',
        boxShadow: hovered
          ? '0 0 40px rgba(0,255,65,0.25), 0 0 80px rgba(0,255,65,0.08), inset 0 0 40px rgba(0,255,65,0.03)'
          : '0 0 20px rgba(0,255,65,0.08), inset 0 0 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Card index marker */}
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <span style={{ color: '#00ff41', opacity: 0.4, fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
          [{String(index + 1).padStart(2, '0')}]
        </span>
      </div>

      {/* 3D Model side — alternates LEFT/RIGHT based on index */}
      <div className="project-model-col" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: isIphone ? '252px' : '580px',
        maxWidth: '100%',
        overflow: 'hidden',
      }}>
        <DeviceCanvas project={project} visible={modelVisible} swayDir={index % 2 === 0 ? 1 : -1} />
      </div>

      {/* Info side — RIGHT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: '4px', padding: '3px 10px' }}>
            <span style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.1em' }}>
              {project.category.toUpperCase()}
            </span>
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            fontWeight: '600',
            letterSpacing: '0.12em',
            padding: '3px 10px',
            borderRadius: '4px',
            background: statusColor.bg,
            border: `1px solid ${statusColor.border}`,
            color: statusColor.text,
            boxShadow: `0 0 10px ${statusColor.border}40`,
          }}>
            <span style={{ fontSize: '8px', marginRight: '4px' }}>●</span>
            {project.status}
          </div>
        </div>

        {/* Title block */}
        <div style={{ marginBottom: '2px' }}>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', fontWeight: '700', color: '#e2e8f0', margin: 0, textShadow: '0 0 20px rgba(255,255,255,0.1)', letterSpacing: '0.05em' }}>
            {project.title}
          </h3>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#00d4ff', margin: '4px 0 0 0', opacity: 0.8 }}>
            — {project.subtitle}
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00ff41', background: 'rgba(0,255,65,0.07)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '3px', padding: '2px 8px', letterSpacing: '0.05em' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
          <span style={{ color: '#00ff41', marginRight: '6px', fontFamily: 'JetBrains Mono' }}>{'>'}</span>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#94a3b8', lineHeight: '1.7', margin: 0 }}>
            {project.description}
          </p>
        </div>

        {/* Testimonial */}
        {project.testimonial && (
          <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)', borderLeft: '3px solid rgba(0,212,255,0.5)', borderRadius: '0 6px 6px 0', padding: '10px 14px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span style={{ color: '#00d4ff', fontSize: '18px', lineHeight: 1, fontFamily: 'Georgia, serif' }}>"</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic', lineHeight: '1.6', flex: 1 }}>
                {project.testimonial.quote}
              </span>
              <span style={{ color: '#00d4ff', fontSize: '18px', lineHeight: 1, fontFamily: 'Georgia, serif' }}>"</span>
            </div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#00d4ff', margin: 0, textAlign: 'right', opacity: 0.8 }}>
              — {project.testimonial.author}
            </p>
          </div>
        )}

        {/* Terminal line + play button row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(0,255,65,0.08)', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{ color: '#00ff41', opacity: 0.5, fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
              $ status --project &quot;{project.title.toLowerCase().replace(/\s/g, '-')}&quot;
            </span>
            <span style={{ color: statusColor.text, fontFamily: 'JetBrains Mono', fontSize: '11px', marginLeft: '8px' }}>
              [{project.status}]
            </span>
          </div>
          {hasDemo && (
            <button
              onClick={() => onPlay(project)}
              style={{
                background: 'rgba(0,255,65,0.08)',
                border: '1px solid rgba(0,255,65,0.4)',
                borderRadius: '6px',
                color: '#00ff41',
                cursor: 'pointer',
                padding: '6px 16px',
                fontFamily: 'JetBrains Mono',
                fontSize: '11px',
                letterSpacing: '0.08em',
                transition: 'background 0.2s ease, box-shadow 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,255,65,0.18)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,65,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(0,255,65,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ▶ PLAY DEMO
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ProjectsSection (default export) ────────────────────────────────────────
export default function ProjectsSection() {
  const sectionRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    setTimeout(() => setHeaderVisible(true), 500);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} style={{ padding: '100px 0 80px', position: 'relative' }}>
      {/* Section header */}
      <div className="projects-header" style={{ padding: '0 60px', marginBottom: '48px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0px', marginBottom: '10px',
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', color: '#6b7280' }}>root@saswat:~$</span>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: '700', color: '#00ff41', textShadow: '0 0 20px rgba(0,255,65,0.6), 0 0 40px rgba(0,255,65,0.2)', letterSpacing: '0.05em' }}> projects.exe --list</span>
          <span style={{ color: '#00ff41', fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', animation: 'blink 1s infinite', marginLeft: '4px' }}>█</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', opacity: headerVisible ? 1 : 0, transition: 'all 0.8s ease 0.3s' }}>
          <span style={{ color: '#00d4ff', marginRight: '8px' }}>//</span>
          <span style={{ color: '#6b7280', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
            {PROJECTS.length} projects loaded — scroll to explore
          </span>
        </div>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(0,255,65,0.5) 0%, rgba(0,255,65,0.1) 40%, transparent 100%)', maxWidth: '600px' }} />
      </div>

      {/* Vertical list of project cards */}
      <div className="projects-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 40px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onPlay={setActiveProject}
          />
        ))}
      </div>

      {/* Video modal */}
      {activeProject && (
        <VideoModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        /* Mobile: stack project cards vertically */
        @media (max-width: 900px) {
          .project-card {
            flex-direction: column !important;
            padding: 20px !important;
            gap: 20px !important;
          }
          .project-model-col {
            width: 100% !important;
            justify-content: center !important;
          }
          .project-model-col canvas {
            max-width: 100% !important;
          }
          .projects-list {
            padding: 0 16px !important;
          }
          .projects-header {
            padding: 0 16px !important;
          }
        }
        @media (max-width: 600px) {
          .projects-header {
            padding: 0 12px !important;
          }
          .projects-list {
            padding: 0 8px !important;
          }
          .project-card {
            padding: 16px 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
