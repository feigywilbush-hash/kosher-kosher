import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { COUNTRIES, DISHES, EASE_IO, TYPE_C, TYPE_DOT, asset } from "./data";
import { SiteLink } from "./SiteLink";

const MODES = [
  { id: "product", label: "בדיקת מוצר" },
  { id: "restaurant", label: "חיפוש מסעדה" },
] as const;

const LINKS = [
  { t: "מוצרים כשרים", d: "בדיקה בסריקת ברקוד", href: "#scan" },
  { t: "מסעדות כשרות", d: "לפי עיר וסוג", href: "/restaurants" },
  { t: "כשרות בעולם", d: "יעדים ורבנים בחו״ל", href: "#world" },
  { t: "שאלות ותשובות", d: "שאלו את הרב", href: "#qa" },
];

const N = COUNTRIES.length;

/** Ring tick masks for the rotating dial (container-query units keep them proportional). */
const ringMask = (w: string): CSSProperties => {
  const m = `radial-gradient(circle, transparent 0 calc(50% - ${w}), #000 calc(50% - ${w}) 50%, transparent 50%)`;
  return { WebkitMaskImage: m, maskImage: m };
};

function StripIcon({ k }: { k: number }) {
  const c = "bg-sky";
  return (
    <span aria-hidden="true" className="relative grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-xl bg-sky/[.12]">
      {k === 0 && (
        <span className="relative flex h-4 w-[22px] items-stretch gap-0.5 [direction:ltr]">
          {[2, 1, 3, 1, 2, 3, 1, 2].map((w, i) => (
            <span key={i} className={c} style={{ width: w }} />
          ))}
          <span className="kk-scan absolute -left-1 -right-1 top-0 h-[1.5px] rounded-sm bg-[#FF6B4E] shadow-[0_0_6px_1px_rgba(255,107,78,.8)]" />
        </span>
      )}
      {k === 1 && (
        <span className="relative h-5 w-6">
          {[7, 12, 17].map((l, i) => (
            <span key={l} className={cn("kk-steam absolute top-0 h-1.5 w-0.5 rounded-sm", c)} style={{ left: l, animationDelay: `${i * 300}ms` }} />
          ))}
          <span className="absolute bottom-[3px] left-[3px] right-px h-[9px] rounded-t-xl border-[1.6px] border-b-0 border-sky" />
          <span className={cn("absolute bottom-px left-0 right-[-2px] h-[1.6px] rounded-sm", c)} />
        </span>
      )}
      {k === 2 && (
        <span className="relative h-[22px] w-[22px] overflow-hidden rounded-full border-[1.6px] border-sky">
          <span className={cn("absolute -left-0.5 -right-0.5 top-1/2 -mt-[.6px] h-[1.2px]", c)} />
          <span className="kk-spin absolute -bottom-0.5 -top-0.5 left-1/2 -ml-[5px] w-2.5 rounded-full border-[1.2px] border-sky" />
        </span>
      )}
      {k === 3 && (
        <span className="relative flex h-[18px] w-6 items-center justify-center gap-[2.5px] rounded-[8px_8px_8px_2px] border-[1.6px] border-sky">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn("kk-dot h-[3px] w-[3px] rounded-full", c)} style={{ animationDelay: `${i * 160}ms` }} />
          ))}
        </span>
      )}
    </span>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("product");
  const [wIdx, setWIdx] = useState(0);
  const [wRot, setWRot] = useState(0);

  const idxRef = useRef(0);
  const rotRef = useRef(0);
  const hoverRef = useRef(false);
  const visRef = useRef(true);
  const sectionRef = useRef<HTMLElement>(null);

  const goWorld = useCallback(
    (j: number) => {
      let delta = (((j - idxRef.current) % N) + N) % N;
      if (delta > N / 2) delta -= N;
      if (!delta) return;
      idxRef.current = j;
      rotRef.current -= delta * (360 / N);
      setWIdx(j);
      setWRot(rotRef.current);
    },
    [],
  );

  useEffect(() => {
    if (reduced) return;
    const io = new IntersectionObserver((es) => (visRef.current = es[0].isIntersecting));
    if (sectionRef.current) io.observe(sectionRef.current);
    const t = setInterval(() => {
      if (!visRef.current || hoverRef.current) return;
      goWorld((idxRef.current + 1) % N);
    }, 4200);
    return () => {
      io.disconnect();
      clearInterval(t);
    };
  }, [reduced, goWorld]);

  const cur = COUNTRIES[wIdx];
  const dish = DISHES[cur.code];
  const dialEase = `1.2s ${EASE_IO}`;

  return (
    <section id="top" ref={sectionRef} data-screen-label="Hero" className="relative px-[2.5vw] pt-24">
      <div className="relative isolate flex min-h-[calc(100dvh-112px)] flex-col overflow-hidden rounded-[32px] bg-white px-[clamp(22px,4vw,64px)] pb-[clamp(100px,9vw,136px)] pt-[clamp(30px,3.6vw,56px)]">
        <div
          aria-hidden="true"
          className="absolute -z-10 aspect-square w-[78%] rounded-full"
          style={{ left: "-18%", top: "-26%", background: "radial-gradient(circle, rgba(35,70,211,.12), rgba(35,70,211,0) 62%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 grid overflow-hidden pt-[clamp(40px,5vw,90px)] [place-items:start_center]"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, #000 40%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, #000 40%, transparent 100%)",
          }}
        >
          <div data-map="1" className="relative flex-none" style={{ width: "max(118%, 1100px)", aspectRatio: "1800 / 690" }}>
            <img src={asset("images/world-dots.svg")} alt="" className="absolute inset-0 h-full w-full opacity-[.13]" />
          </div>
        </div>

        <div className="relative grid flex-1 grid-cols-[repeat(auto-fit,minmax(min(100%,500px),1fr))] items-center gap-[clamp(40px,4.4vw,72px)] max-[1210px]:gap-y-6">
          {/* Copy */}
          <div className="relative z-[2] min-w-0 max-[1210px]:contents">
            <h1 className="max-[1210px]:order-1 mb-0 mt-[clamp(20px,2.2vw,30px)] font-display font-normal text-ink">
              <span className="block overflow-hidden pb-[.06em] pt-[.08em] text-[clamp(72px,20vw,80px)] cmp:text-[clamp(63px,6.95vw,125px)] leading-[.9] tracking-[-.01em]">
                <span data-line="0" className="inline-block">
                  כשר <span className="text-blue">כשר.</span>
                </span>
              </span>
              <span className="block overflow-hidden pb-[.1em] pt-[.06em] text-[clamp(46px,13vw,60px)] cmp:text-[clamp(63px,6.95vw,125px)] leading-[.94] tracking-[-.01em] [text-wrap:balance]">
                <span data-line="1" className="inline-block">הבית שלכם לכשרות בעולם, מבית ועד רבני אירופה</span>
              </span>
            </h1>
            <p data-hero-in="250" className="max-[1210px]:order-3 mb-0 mt-[clamp(20px,2.2vw,30px)] max-[1210px]:mt-0 max-w-[500px] text-[clamp(17px,1.3vw,20px)] leading-[1.65] text-muted [text-wrap:pretty]">
              מסעדות בהשגחה, מוצרים מאושרים ורב אחראי שזמין לכם, בארץ ובעשרות יעדים בעולם. בודקים לפני שיוצאים, אוכלים בראש שקט כשמגיעים.
            </p>

            <div data-hero-in="400" className="max-[1210px]:order-4 mt-[clamp(24px,2.6vw,38px)] max-[1210px]:mt-0 w-full max-w-[600px]">
              <div role="group" aria-label="סוג חיפוש" className="mb-3.5 flex flex-col gap-2.5 cmp:flex-row">
                {MODES.map((m) => {
                  const on = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      aria-pressed={on}
                      className={cn(
                        "h-[54px] w-full cmp:w-auto cursor-pointer rounded-full border-[1.5px] px-[30px] text-[17px] font-normal transition-[background,color] duration-[250ms]",
                        on ? "border-ink bg-ink text-white" : "border-ink/20 bg-transparent text-ink",
                      )}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3.5 flex flex-wrap items-center gap-2 text-sm text-muted" />
            </div>
          </div>

          {/* Rotating destination dial */}
          <div className="max-[1210px]:order-2 relative w-[min(100%,680px)] justify-self-center py-[clamp(18px,2vw,28px)]">
            <div
              onMouseEnter={() => (hoverRef.current = true)}
              onMouseLeave={() => (hoverRef.current = false)}
              className="relative mb-[115px] aspect-square w-full [container-type:inline-size] cmp:mb-0"
            >
              <div aria-hidden="true" className="absolute inset-[-5%] rounded-full border-[1.5px] border-dashed border-navy/[.28]" />
              <div aria-hidden="true" className="absolute inset-[-5%]">
                <span className="absolute left-1/2 top-[-6px] -ml-1.5 h-3 w-3 rounded-full bg-accent shadow-[0_0_0_5px_rgba(208,65,40,.18)]" />
              </div>

              <div
                data-dial="1"
                className="absolute inset-0 overflow-hidden rounded-full bg-ink shadow-[0_60px_120px_-50px_rgba(12,23,51,.7),inset_0_0_0_1px_rgba(238,242,251,.08)]"
              >
                <div className="absolute inset-0" style={{ transform: `rotate(${wRot}deg)`, transition: `transform ${dialEase}` }}>
                  <div
                    aria-hidden="true"
                    className="absolute inset-[2.4%] rounded-full"
                    style={{ background: "repeating-conic-gradient(from -.4deg, rgba(238,242,251,.32) 0 .8deg, rgba(238,242,251,0) .8deg 6deg)", ...ringMask("3.2cqw") }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-[2.4%] rounded-full"
                    style={{ background: "repeating-conic-gradient(from -.7deg, rgba(142,166,255,.9) 0 1.4deg, rgba(142,166,255,0) 1.4deg 60deg)", ...ringMask("5cqw") }}
                  />
                  <span aria-hidden="true" className="absolute inset-[15.5%] rounded-full border border-paper/[.14]" />
                  {COUNTRIES.map((c, i) => {
                    const on = i === wIdx;
                    const ang = (i * 360) / N;
                    return (
                      <span key={c.code} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transform: `rotate(${ang}deg) translateY(-41.2cqw)` }}>
                        <button
                          type="button"
                          onClick={() => goWorld(i)}
                          aria-label={"הצגת " + c.name}
                          aria-pressed={on}
                          className={cn("absolute left-0 top-0 cursor-pointer whitespace-nowrap rounded-full border-none font-body font-normal", on ? "bg-accent text-white" : "bg-paper/[.08] text-soft")}
                          style={{
                            transform: `translate(-50%,-50%) rotate(${-(ang + wRot)}deg)`,
                            transition: `transform ${dialEase}, background .4s, color .4s`,
                            height: "clamp(30px,5.4cqw,38px)",
                            padding: "0 clamp(10px,2cqw,16px)",
                            fontSize: "clamp(12px,2.2cqw,15px)",
                          }}
                        >
                          {c.name}
                        </button>
                      </span>
                    );
                  })}
                </div>

                <div className="absolute inset-[19%] overflow-hidden rounded-full bg-ink">
                  {COUNTRIES.map((c, i) => {
                    const on = i === wIdx;
                    return (
                      <div
                        key={c.code}
                        role="img"
                        aria-label={on ? DISHES[c.code].dish : ""}
                        className="absolute inset-[-6%] h-[112%] w-[112%] bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${DISHES[c.code].src})`,
                          opacity: on ? 1 : 0,
                          transform: on ? "rotate(0deg) scale(1)" : "rotate(-28deg) scale(1.08)",
                          transition: "opacity .9s ease, transform 1.4s cubic-bezier(.16,1,.3,1)",
                        }}
                      />
                    );
                  })}
                  <span aria-hidden="true" className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 6cqw 1cqw rgba(12,23,51,.9)" }} />
                </div>
              </div>

              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[-1px] z-[3] -ml-[9px] h-0 w-0 border-x-[9px] border-t-[14px] border-x-transparent border-t-accent"
              />

              {/* Dish ticket */}
              <div className="absolute left-[22px] top-[88%] z-[4] cmp:bottom-[-2%] cmp:left-[-4%] cmp:top-auto">
                <div data-pop="1100" className="relative">
                  <div
                    className="rounded-[20px] bg-white px-[18px] pb-3.5 pt-[30px] text-ink shadow-[0_30px_60px_-24px_rgba(12,23,51,.55),0_0_0_1px_rgba(12,23,51,.06)]"
                    style={{ width: "clamp(232px,40cqw,300px)" }}
                  >
                    <div className="pl-14 font-display text-[clamp(26px,2.2vw,32px)] leading-none">{dish.dish}</div>
                    <div className="mt-1.5 text-[13px] text-muted">
                      {cur.name} · {cur.cities}
                    </div>
                    <div className="mt-3.5 flex items-center justify-between gap-2.5 border-t-[1.5px] border-dashed border-ink/20 pt-3">
                      <span className={cn("inline-flex h-7 items-center gap-[7px] whitespace-nowrap rounded-full px-3 text-[13px] font-bold", TYPE_C[dish.type].bg, TYPE_C[dish.type].fg)}>
                        <span className={cn("h-[7px] w-[7px] rounded-full", TYPE_DOT[dish.type])} />
                        {dish.type}
                      </span>
                      <a href="#world" className="whitespace-nowrap text-[13px] font-bold text-ink hover:text-accent">
                        מסעדות ביעד ←
                      </a>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute left-[-18px] top-[-34px] flex h-[88px] w-[88px] -rotate-12 flex-col items-center justify-center rounded-full bg-accent text-white shadow-[0_16px_30px_-10px_rgba(208,65,40,.7)]"
                  >
                    <span className="absolute inset-1.5 rounded-full border border-dashed border-white/75" />
                    <span className="font-display text-[32px] leading-none">כשר</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick-link strip */}
        <nav
          aria-label="קיצורי דרך"
          data-hero-in="700"
          className="relative z-[2] mt-[clamp(36px,4vw,56px)] grid grid-cols-2 overflow-hidden rounded-[22px] bg-ink shadow-[0_30px_60px_-36px_rgba(12,23,51,.6)] cmp:grid-cols-4"
        >
          {LINKS.map((l, i) => (
            <SiteLink
              key={l.t}
              to={l.href}
              className={cn(
                "flex flex-col gap-1.5 border-paper/[.14] px-[clamp(16px,1.6vw,24px)] py-[clamp(14px,1.4vw,20px)] text-paper transition-[background] duration-300 hover:bg-paper/[.08] hover:text-white",
                i % 2 === 1 && "border-s",
                i === 2 && "cmp:border-s",
                i > 1 && "border-t cmp:border-t-0",
              )}
            >
              <span className="flex items-center justify-between">
                <StripIcon k={i} />
                <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full border border-paper/30 text-sm">←</span>
              </span>
              <span className="font-display text-[clamp(22px,1.9vw,28px)] leading-[1.05]">{l.t}</span>
              <span className="text-[13px] text-mist">{l.d}</span>
            </SiteLink>
          ))}
        </nav>
      </div>
    </section>
  );
}
