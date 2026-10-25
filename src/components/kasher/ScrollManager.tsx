import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTarget } from "@/lib/scroll";

/** Scrolls to the URL hash (or the top) on every router navigation. */
export function ScrollManager() {
  const loc = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const samePage = prevPath.current === loc.pathname;
    prevPath.current = loc.pathname;
    const id = decodeURIComponent(loc.hash.slice(1));
    if (!id) {
      scrollToTarget(0, !samePage);
      return;
    }
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) scrollToTarget(el, !samePage);
    });
    return () => cancelAnimationFrame(raf);
  }, [loc.key]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
