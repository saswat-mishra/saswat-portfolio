// True only in a browser. Use for module-level / render-time guards around code
// that touches the DOM or WebGL, so it never runs in the Node prerender pass.
export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';
