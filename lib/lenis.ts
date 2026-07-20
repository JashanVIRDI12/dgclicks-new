import type Lenis from "lenis";

// Module-level handle so nav/anchor code can reach the live Lenis instance
// without prop-drilling. Null when reduced motion disables smooth scroll.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}
