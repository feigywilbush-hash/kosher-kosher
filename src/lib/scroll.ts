import type Lenis from "lenis";

/** Header height to clear when landing on a section. */
export const HEADER_OFFSET = -84;

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenis = l);
export const getLenis = () => lenis;

/** Scroll to an element (below the fixed header) or to a y position, through Lenis when it is running. */
export function scrollToTarget(target: HTMLElement | number, immediate = false) {
  const offset = typeof target === "number" ? 0 : HEADER_OFFSET;
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
}
