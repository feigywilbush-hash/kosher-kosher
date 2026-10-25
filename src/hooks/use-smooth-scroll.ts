import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** Header height to clear when jumping to an anchor. */
const ANCHOR_OFFSET = -84;

/**
 * Site-wide smooth wheel scrolling (Lenis, same defaults as the WP
 * "Mousewheel Smooth Scroll" plugin). Touch keeps native scrolling.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      duration: 1.2,
      wheelMultiplier: 1,
      easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
    });

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id === "#main") return; // skip link: let focus move natively
      const target = id === "#" ? 0 : document.querySelector<HTMLElement>(id);
      if (target == null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: ANCHOR_OFFSET });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);
}
