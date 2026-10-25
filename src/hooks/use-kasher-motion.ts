import { useEffect } from "react";
import { EASE_OUT } from "@/components/kasher/data";

/**
 * Page-level intro + scroll-reveal choreography, driven by data attributes:
 * data-line (headline wipe), data-hero-in, data-pop, data-map, data-dial, data-reveal.
 */
export function useKasherMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !document.body.animate) return;
    const q = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s));

    q("[data-line]").forEach((el, i) =>
      el.animate([{ transform: "translateY(112%)" }, { transform: "translateY(0)" }], { duration: 1100, delay: 120 + i * 150, easing: EASE_OUT, fill: "both" }),
    );
    q("[data-hero-in]").forEach((el) =>
      el.animate([{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "none" }], { duration: 1000, delay: 500 + (+el.dataset.heroIn! || 0), easing: EASE_OUT, fill: "backwards" }),
    );
    q("[data-pop]").forEach((el) => {
      const d = +el.dataset.pop! || 0;
      const an = el.animate([{ opacity: 0, transform: "translateY(34px) scale(.86)" }, { opacity: 1, transform: "none" }], { duration: 950, delay: d, easing: "cubic-bezier(.34,1.45,.64,1)", fill: "backwards" });
      an.onfinish = () =>
        el.animate([{ transform: "translateY(0)" }, { transform: "translateY(-9px)" }, { transform: "translateY(0)" }], { duration: 4600 + d * 1.4, iterations: Infinity, easing: "ease-in-out" });
    });
    q("[data-map]").forEach((el) =>
      el.animate([{ opacity: 0, transform: "scale(1.06)" }, { opacity: 1, transform: "none" }], { duration: 2400, delay: 200, easing: EASE_OUT, fill: "backwards" }),
    );
    q("[data-dial]").forEach((el) =>
      el.animate([{ transform: "scale(.82) rotate(40deg)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 1600, delay: 150, easing: EASE_OUT, fill: "backwards" }),
    );

    if (!("IntersectionObserver" in window)) return;
    const anims = new Map<Element, Animation>();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            anims.get(e.target)?.play();
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    q("[data-reveal]").forEach((el) => {
      const a = el.animate([{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 1000, delay: +el.dataset.reveal! || 0, easing: EASE_OUT, fill: "both" });
      a.pause();
      anims.set(el, a);
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}
