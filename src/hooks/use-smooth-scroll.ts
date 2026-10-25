import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { scrollToTarget, setLenis } from "@/lib/scroll";

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
    setLenis(lenis);

    // Same-page anchors (href="#id"); router links are handled by ScrollManager.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id === "#main") return; // skip link: let focus move natively
      const target = id === "#" ? 0 : document.querySelector<HTMLElement>(id);
      if (target == null) return;
      e.preventDefault();
      scrollToTarget(target);
      history.replaceState(history.state, "", id);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);
}
