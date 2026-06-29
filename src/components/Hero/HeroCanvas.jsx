import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { isBrowser } from '../util/env.js';

// The entire Three.js dependency lives in THIS module so it ends up in its own
// chunk, dynamically imported only by HeroSection — and only on desktop, with
// motion allowed, after the load event / on-view (the 3D performance contract,
// Dossier §3). The static poster image is the LCP element; this never blocks it.

function AvatarModel() {
  const group = useRef();
  const { scene, animations } = useGLTF(`${import.meta.env.BASE_URL}models/model.glb`);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (names.length > 0) {
      const firstAction = actions[names[0]];
      if (firstAction) firstAction.reset().fadeIn(0.5).play();
    }
  }, [actions, names]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={1.3} position={[0, -1.1, 0]} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 10, 25]} />
      <ambientLight intensity={1.2} color="#1a4a2a" />
      <pointLight position={[0, 1.8, 4]} intensity={8} color="#c8ffd4" distance={12} decay={1.5} />
      <pointLight position={[-1.5, 1, 3]} intensity={5} color="#00ff41" distance={10} decay={1.5} />
      <pointLight position={[1.5, 0.5, 3]} intensity={4} color="#00d4ff" distance={10} decay={1.5} />
      <directionalLight position={[0, 6, 3]} intensity={2.5} color="#00ff88" />
      <directionalLight position={[4, 3, 1]} intensity={1.5} color="#00ff41" />
      <pointLight position={[0, -0.5, 2]} intensity={2.5} color="#00ff41" distance={6} decay={1.5} />
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} autoRotate={false} />
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.4}>
        <Suspense fallback={null}>
          <AvatarModel />
        </Suspense>
      </Float>
    </>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.5], fov: 52 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4,
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x030712, 1);
        scene.background = new THREE.Color('#030712');
      }}
    >
      <Scene />
    </Canvas>
  );
}

// Preload the GLB when this chunk loads (i.e. only when 3D is actually going to
// render). Guarded so it never runs in the Node prerender pass.
if (isBrowser) {
  useGLTF.preload(`${import.meta.env.BASE_URL}models/model.glb`);
}
