import { useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CursorTrail from '../Cursor/CursorTrail.jsx';
import StarField from '../Background/StarField.jsx';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import { C } from '../../theme.js';

// All shared chrome lives here. CRITICAL: nothing imported by Layout may pull in
// three / @react-three — that keeps the 3D bundle out of every non-Home route.
// CursorTrail + StarField are 2D <canvas> overlays (no three), safe to share.

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Note: the site-wide click-sound autoplay was removed (WCAG 1.4.2 — no audio
// that plays automatically without a visible control). The only audio is the
// hero music player, which is off by default with a visible play/volume control.

export default function Layout() {
  return (
    <>
      <CursorTrail />
      <StarField />
      <ScrollToTop />
      <Header />
      {/* Footer lives INSIDE the route Suspense boundary so that, if a lazy
          route briefly suspends during hydration, the footer is absent rather
          than shifted — it only ever paints at its final position (no CLS). */}
      <Suspense
        fallback={
          <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.mono, color: 'rgba(0,255,65,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            loading…
          </div>
        }
      >
        <main style={{ minHeight: '70vh', color: C.text }}>
          <Outlet />
        </main>
        <SiteFooter />
      </Suspense>
    </>
  );
}
