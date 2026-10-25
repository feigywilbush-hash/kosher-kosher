import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { COUNTRIES, EASE_IO, ISRAEL_POS, MAP_POS, PLACE_IMG, asset } from "./data";

const MAP_MASK = `url(${asset("images/world-dots.svg")})`;

export function World() {
  const reduced = useReducedMotion();
  const [sel, setSel] = useState(0);
  const selRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const panRef = useRef<[number, number] | null>(null);
  const movedRef = useRef(false);

  const placeTip = useCallback(() => {
    const t = tipRef.current, p = panelRef.current, b = boxRef.current, pan = panRef.current;
    if (!t || !p || !b || !pan) return;
    const [px, py] = MAP_POS[COUNTRIES[selRef.current].code];
    const sx = (px / 100) * b.offsetWidth + pan[0];
    const sy = (py / 100) * b.offsetHeight + pan[1];
    const cw = t.offsetWidth || 190, ch = t.offsetHeight || 200, w = p.clientWidth;
    const below = sy - ch - 22 < 0;
    const shift = Math.max(cw / 2 + 10 - sx, Math.min(0, w - cw / 2 - 10 - sx));
    t.style.transition = `left .8s ${EASE_IO}, top .8s ${EASE_IO}, transform .5s ${EASE_IO}`;
    t.style.transform = below ? `translate(calc(-50% + ${shift}px), 16px)` : `translate(calc(-50% + ${shift}px), calc(-100% - 16px))`;
    const a = arrowRef.current;
    if (a) {
      a.style.left = `calc(50% - ${shift}px)`;
      a.style.top = below ? "-7px" : "auto";
      a.style.bottom = below ? "auto" : "-7px";
    }
    if (cardRef.current) cardRef.current.style.transformOrigin = below ? "50% 0" : "50% 100%";
  }, []);

  const setPan = useCallback(
    (x: number, y: number, anim: boolean) => {
      const p = panelRef.current, b = boxRef.current;
      if (!p || !b) return;
      x = Math.min(0, Math.max(p.clientWidth - b.offsetWidth, x));
      y = Math.min(0, Math.max(p.clientHeight - b.offsetHeight, y));
      panRef.current = [x, y];
      b.style.transition = anim ? `transform .9s ${EASE_IO}` : "none";
      b.style.transform = `translate(${x}px,${y}px)`;
      requestAnimationFrame(placeTip);
    },
    [placeTip],
  );

  const panTo = useCallback(
    (i: number, anim: boolean) => {
      const p = panelRef.current, b = boxRef.current;
      if (!p || !b) return;
      const [px, py] = MAP_POS[COUNTRIES[i].code];
      const mx = (px + ISRAEL_POS[0]) / 2;
      setPan(p.clientWidth / 2 - (mx / 100) * b.offsetWidth, p.clientHeight * 0.62 - (py / 100) * b.offsetHeight, anim);
    },
    [setPan],
  );

  useEffect(() => {
    requestAnimationFrame(() => panTo(selRef.current, false));
    const onResize = () => requestAnimationFrame(() => panTo(selRef.current, false));
    window.addEventListener("resize", onResize);
    // Swallow the click that ends a drag so pins don't fire.
    const p = panelRef.current;
    const onClick = (e: MouseEvent) => {
      if (movedRef.current) {
        e.stopPropagation();
        e.preventDefault();
        movedRef.current = false;
      }
    };
    p?.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("resize", onResize);
      p?.removeEventListener("click", onClick, true);
    };
  }, [panTo]);

  useEffect(() => {
    if (reduced) return;
    const a = pulseRef.current?.animate([{ boxShadow: "0 0 0 0 rgba(208,65,40,.6)" }, { boxShadow: "0 0 0 22px rgba(208,65,40,0)" }], { duration: 1800, iterations: Infinity });
    return () => a?.cancel();
  }, [reduced]);

  const select = (i: number) => {
    if (i === selRef.current) return;
    selRef.current = i;
    setSel(i);
    panTo(i, true);
    if (!reduced)
      cardRef.current?.animate(
        [{ transform: "scale(.6) translateY(10px)", opacity: 0 }, { transform: "scale(1.04)", opacity: 1, offset: 0.7 }, { transform: "scale(1)", opacity: 1 }],
        { duration: 520, delay: 650, easing: "cubic-bezier(.34,1.4,.64,1)", fill: "backwards" },
      );
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return;
    const sx = e.clientX, sy = e.clientY;
    const [ox, oy] = panRef.current || [0, 0];
    movedRef.current = false;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!movedRef.current && Math.hypot(dx, dy) < 5) return;
      if (!movedRef.current && ev.pointerType === "touch" && Math.abs(dy) > Math.abs(dx)) return up();
      movedRef.current = true;
      if (panelRef.current) panelRef.current.style.cursor = "grabbing";
      setPan(ox + dx, oy + dy, false);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (panelRef.current) panelRef.current.style.cursor = "grab";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const cur = COUNTRIES[sel];
  const [sx, sy] = MAP_POS[cur.code];
  const follow = { left: `${sx}%`, top: `${sy}%`, transition: `left .8s ${EASE_IO}, top .8s ${EASE_IO}` };

  return (
    <section
      id="world"
      data-screen-label="World"
      className="relative mx-[2.5vw] mt-6 scroll-mt-[90px] overflow-hidden rounded-[32px] bg-ink px-[clamp(20px,4.6vw,80px)] py-[clamp(36px,5.4vw,88px)] text-paper"
    >
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div data-reveal="0">
          <h2 className="mb-0 mt-[18px] font-display text-[clamp(52px,7.4vw,128px)] font-normal leading-[.92]">
            כשרות <span className="text-sky">בעולם</span>
          </h2>
          <p className="mb-0 mt-5 max-w-[520px] text-lg leading-[1.6] text-mist [text-wrap:pretty]">
            נוסעים? בכל יעד בלוח יש מסעדות ומוסדות בהשגחה, ורב אחראי שאפשר לפנות אליו לפני הטיסה ובמהלכה.
          </p>
        </div>
        <div data-reveal="150" className="flex flex-col items-end gap-[18px]">
          <a
            href="#world"
            className="inline-flex h-[52px] items-center gap-2.5 rounded-full border-[1.5px] border-paper/40 px-[26px] font-normal text-paper transition-[background,color] duration-[250ms] hover:bg-paper hover:text-ink"
          >
            כל המדינות <span aria-hidden="true">←</span>
          </a>
        </div>
      </div>

      <div
        id="board"
        data-reveal="200"
        className="mt-[clamp(36px,4vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-stretch gap-[clamp(28px,3.4vw,56px)]"
      >
        {/* Draggable map */}
        <div className="relative flex min-w-0 flex-col gap-3.5">
          <div
            ref={panelRef}
            onPointerDown={onPointerDown}
            className="relative min-h-[clamp(300px,30vw,420px)] flex-1 cursor-grab touch-pan-y select-none overflow-hidden rounded-3xl border border-sky/[.14] bg-blue/10 [container-type:size]"
          >
            <div ref={boxRef} className="absolute left-0 top-0 will-change-transform" style={{ width: "max(130cqw, 340cqh)", aspectRatio: "1800 / 690" }}>
              <div aria-hidden="true" className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-sky opacity-60"
                  style={{ WebkitMaskImage: MAP_MASK, maskImage: MAP_MASK, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}
                />
              </div>
              <svg viewBox="0 0 1800 690" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                <g stroke="rgba(142,166,255,.12)" strokeWidth="1.5" fill="none">
                  <path d="M 0 -900 V 1600 M 300 -900 V 1600 M 600 -900 V 1600 M 900 -900 V 1600 M 1200 -900 V 1600 M 1500 -900 V 1600 M 1800 -900 V 1600" />
                  <path d="M -200 50 H 2000 M -200 200 H 2000 M -200 350 H 2000 M -200 500 H 2000 M -200 650 H 2000 M -200 -100 H 2000 M -200 -250 H 2000 M -200 800 H 2000 M -200 950 H 2000" />
                </g>
                <path d="M -200 200 H 2000" stroke="rgba(142,166,255,.22)" strokeWidth="1.5" strokeDasharray="4 8" />
              </svg>
              <span
                aria-label="ישראל"
                className="absolute z-[4] -ml-[3.5px] -mt-[3.5px] h-[7px] w-[7px] rounded-full bg-paper shadow-[0_0_0_3px_rgba(238,242,251,.2)]"
                style={{ left: `${ISRAEL_POS[0]}%`, top: `${ISRAEL_POS[1]}%` }}
              />
              <span ref={pulseRef} aria-hidden="true" className="pointer-events-none absolute -ml-2 -mt-2 h-4 w-4 rounded-full" style={follow} />
              {COUNTRIES.map((c, i) => {
                const on = i === sel;
                const [x, y] = MAP_POS[c.code];
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => select(i)}
                    aria-label={c.name}
                    aria-pressed={on}
                    className={cn("absolute -ml-3 -mt-3 grid h-6 w-6 cursor-pointer place-items-center border-none bg-transparent p-0 hover:scale-125", on ? "z-[5]" : "z-[3]")}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span
                      className={cn("rounded-full shadow-[0_0_0_3px_rgba(12,23,51,.9)] transition-[width,height,background] duration-[400ms]", on ? "h-[13px] w-[13px] bg-accent" : "h-[9px] w-[9px] bg-sky")}
                    />
                  </button>
                );
              })}
              <span ref={tipRef} aria-hidden="true" className="pointer-events-none absolute z-[6]" style={follow}>
                <span ref={cardRef} className="block w-[clamp(150px,12vw,184px)] origin-bottom rounded-2xl bg-white p-1.5 shadow-[0_24px_44px_-16px_rgba(0,0,0,.6)]">
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-[11px] bg-deep">
                    {COUNTRIES.map((c, i) => (
                      <span
                        key={c.code}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${PLACE_IMG[c.code]})`,
                          opacity: i === sel ? 1 : 0,
                          transform: i === sel ? "scale(1)" : "scale(1.12)",
                          transition: "opacity .6s ease, transform 1.2s cubic-bezier(.16,1,.3,1)",
                        }}
                      />
                    ))}
                  </span>
                  <span className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-2">
                    <span className="font-display text-xl leading-none text-ink">{cur.name}</span>
                    <span className="h-2 w-2 flex-none rounded-full bg-accent" />
                  </span>
                </span>
                <span ref={arrowRef} className="absolute bottom-[-7px] left-1/2 -ml-[7px] h-3.5 w-3.5 rotate-45 rounded-sm bg-white" />
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-sky/20 bg-blue/[.18] px-5 py-4">
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-display text-[clamp(24px,2.2vw,32px)] leading-none">{cur.name}</span>
              <span className="text-sm text-mist">{cur.cities}</span>
            </span>
            <span className="flex flex-wrap gap-2.5">
              <a
                href="#world"
                className="inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full border-[1.5px] border-paper/45 px-5 text-[15px] font-normal text-paper transition-[background,color] duration-[250ms] hover:bg-paper hover:text-ink"
              >
                <span>מוצרים</span> <span aria-hidden="true">←</span>
              </a>
              <a
                href="#world"
                className="inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full bg-accent px-5 text-[15px] font-bold text-white hover:bg-accent-hover hover:text-white"
              >
                <span className="font-normal">מסעדות</span> <span aria-hidden="true">←</span>
              </a>
            </span>
          </div>
        </div>

        {/* Destination board */}
        <div className="min-w-0 border-t border-paper/[.18]">
          {COUNTRIES.map((c, i) => {
            const on = i === sel;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => select(i)}
                aria-label={`${c.name}: ${c.cities}`}
                aria-pressed={on}
                className={cn(
                  "grid w-full cursor-pointer grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-[clamp(12px,1.4vw,20px)] rounded-xl border-b border-paper/10 px-3 py-3.5 text-right font-body text-paper transition-[background] duration-300",
                  on ? "bg-blue/30" : "bg-transparent hover:bg-blue/[.22]",
                )}
              >
                <span className={cn("font-mono text-[13px] font-bold tracking-[.14em]", on ? "text-[#FF7A5C]" : "text-sky")}>{c.code}</span>
                <span className="flex min-w-0 flex-col gap-2">
                  <span className="font-display text-[clamp(28px,2.6vw,40px)] leading-none text-white">{c.name}</span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-mist">{c.cities}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn("grid h-10 w-10 place-items-center justify-self-end rounded-full border text-base transition-[background] duration-300", on ? "border-accent bg-accent" : "border-paper/[.28] bg-transparent")}
                >
                  ←
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
