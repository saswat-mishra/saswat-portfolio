import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/**
 * Renders children only on the client (after hydration).
 *
 * useSyncExternalStore returns the server snapshot (false) during the prerender
 * pass AND during hydration's first render, so the server HTML and the initial
 * client output match exactly (no hydration mismatch). After hydration it
 * returns the client snapshot (true) and swaps in `children`.
 *
 * Wrap anything that touches the browser at *render* time — WebGL/Three.js
 * <Canvas>, window/document access, CanvasTexture, etc. — so it never executes
 * in Node. This is also how we honor the design law "3D lazy-loads after first
 * paint and is disabled on mobile + prefers-reduced-motion".
 *
 * Note: JSX prop expressions still evaluate when the child element is created,
 * even inside <ClientOnly>. Guard browser reads in props too, e.g.
 *   dpr={isBrowser ? window.devicePixelRatio : 1}
 */
export default function ClientOnly({ children, fallback = null }) {
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
  return isClient ? children : fallback;
}
