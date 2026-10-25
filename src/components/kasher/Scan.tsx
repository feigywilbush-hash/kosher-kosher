import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const TEETH = 24;
const ZIG = (() => {
  const pts = ["0 0", "100% 0"];
  for (let i = TEETH; i >= 0; i--) pts.push(`${((i / TEETH) * 100).toFixed(2)}% ${i % 2 === 0 ? "calc(100% - 10px)" : "100%"}`);
  return `polygon(${pts.join(",")})`;
})();

const CORNERS = [
  "right-0 top-0 border-r-4 border-t-4 rounded-tr-[14px]",
  "left-0 top-0 border-l-4 border-t-4 rounded-tl-[14px]",
  "bottom-0 right-0 border-b-4 border-r-4 rounded-br-[14px]",
  "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-[14px]",
];

/** Deterministic pseudo-barcode bars seeded from the code. */
function makeBars(code: string) {
  let seed = 7;
  for (const ch of code) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  return Array.from({ length: 46 }, (_, i) => {
    const guard = i < 3 || i > 42 || (i > 21 && i < 25);
    return { f: guard ? 1 : 1 + Math.floor(rnd() * 3.4), dark: i % 2 === 0 };
  });
}

function Receipt({ code, onReset }: { code: string; onReset: () => void }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reduced) return;
    ref.current?.animate([{ transform: "translateY(60px) rotate(4deg)", opacity: 0 }, { transform: "translateY(0) rotate(-2deg)", opacity: 1 }], { duration: 650, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
    stampRef.current?.animate(
      [{ transform: "rotate(-34deg) scale(2.6)", opacity: 0 }, { transform: "rotate(-10deg) scale(.94)", opacity: 1, offset: 0.75 }, { transform: "rotate(-12deg) scale(1)", opacity: 1 }],
      { duration: 520, delay: 420, easing: "cubic-bezier(.6,0,.4,1)", fill: "both" },
    );
  }, [reduced]);

  const rows = [
    { k: "ברקוד", v: code }, { k: "מוצר", v: "חטיף תירס" }, { k: "יצרן", v: "שם היצרן" },
    { k: "סוג", v: "פרווה" }, { k: "השגחה", v: "חותם · מהדרין" }, { k: "בתוקף עד", v: "אלול תשפ״ז" },
  ];

  return (
    <div className="absolute inset-0 grid place-items-center bg-ink/[.28] p-6">
      <div
        ref={ref}
        className="relative w-[min(100%,380px)] -rotate-2 bg-white px-7 pb-[46px] pt-7 text-ink shadow-[0_30px_60px_rgba(5,11,30,.4)]"
        style={{ clipPath: ZIG }}
      >
        <div className="flex items-baseline justify-between">
          <span className="font-display text-[30px]">תוצאת בדיקה</span>
          <span className="rounded-full border border-ink/20 px-2.5 py-[3px] text-xs font-bold text-muted">נתוני דוגמה</span>
        </div>
        <div className="mb-2 mt-4 border-t-[1.5px] border-dashed border-ink/30" />
        {rows.map((r) => (
          <div key={r.k} className="flex items-baseline gap-2 py-[7px] text-[15px]">
            <span className="text-muted">{r.k}</span>
            <span aria-hidden="true" className="flex-1 -translate-y-1 border-b-[1.5px] border-dotted border-ink/30" />
            <span className="font-bold">{r.v}</span>
          </div>
        ))}
        <div className="mb-3.5 mt-3 border-t-[1.5px] border-dashed border-ink/30" />
        <button type="button" onClick={onReset} className="cursor-pointer border-none bg-transparent py-2 text-[15px] font-bold text-blue">
          בדיקה נוספת ←
        </button>
        <span
          ref={stampRef}
          aria-hidden="true"
          className="absolute bottom-[42px] left-[22px] flex h-[104px] w-[104px] -rotate-12 flex-col items-center justify-center rounded-full border-4 border-accent text-accent mix-blend-multiply"
        >
          <span className="absolute inset-1.5 rounded-full border border-accent" />
          <span className="font-display text-[30px] leading-none">מאושר</span>
          <span className="mt-0.5 text-[10px] font-bold tracking-[.14em]">פרווה · מהדרין</span>
        </span>
      </div>
    </div>
  );
}

export function Scan() {
  const [barcode, setBarcode] = useState("7290000123456");
  const [scan, setScan] = useState<"idle" | "scanning" | "done">("idle");
  const laserRef = useRef<HTMLSpanElement>(null);
  const laserAnim = useRef<Animation | null>(null);
  const timer = useRef<number>();

  useEffect(() => {
    laserAnim.current =
      laserRef.current?.animate(
        [
          { top: "0%", transform: "scaleY(1)" },
          { top: "100%", transform: "scaleY(1)", offset: 0.5 },
          { top: "100%", transform: "scaleY(-1)", offset: 0.5001 },
          { top: "0%", transform: "scaleY(-1)" },
        ],
        { duration: 2600, iterations: Infinity, easing: "linear" },
      ) ?? null;
    return () => {
      laserAnim.current?.cancel();
      clearTimeout(timer.current);
    };
  }, []);

  const runScan = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (scan === "scanning") return;
    setScan("scanning");
    if (laserAnim.current) laserAnim.current.playbackRate = 3.2;
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setScan("done");
      if (laserAnim.current) laserAnim.current.playbackRate = 1;
    }, 1700);
  };

  const bars = useMemo(() => makeBars(barcode), [barcode]);
  const bc = barcode || "0000000000000";
  const shown = bc.length === 13 ? `${bc[0]} ${bc.slice(1, 7)} ${bc.slice(7)}` : bc;

  return (
    <section id="scan" data-screen-label="Barcode" className="mx-auto max-w-[1480px] scroll-mt-[90px] px-[clamp(20px,4.6vw,80px)] py-[clamp(80px,10vw,160px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(48px,6vw,104px)]">
        <div data-reveal="0">
          <h2 className="mb-0 mt-[18px] font-display text-[clamp(46px,5.6vw,98px)] font-normal leading-[.98] [text-wrap:balance]">
            בדיקת מוצר בסריקת <span className="text-blue">ברקוד</span>
          </h2>
          <p className="mb-0 mt-[22px] max-w-[520px] text-lg leading-[1.65] text-muted [text-wrap:pretty]">
            מקלידים או סורקים את הברקוד שעל האריזה, ומקבלים מיד את סטטוס הכשרות, סוג המוצר (בשרי, חלבי או פרווה) והגורם המשגיח.
          </p>
          <form onSubmit={runScan} className="mt-9 max-w-[560px]">
            <label htmlFor="barcode-in" className="mb-2.5 block text-sm font-bold">
              מספר הברקוד
            </label>
            <div className="flex gap-2.5">
              <input
                id="barcode-in"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value.replace(/\D/g, "").slice(0, 14));
                  setScan("idle");
                }}
                inputMode="numeric"
                autoComplete="off"
                maxLength={14}
                className="h-16 min-w-0 flex-1 rounded-[18px] border-[1.5px] border-ink/[.18] bg-white px-[22px] text-right font-mono text-[22px] tracking-[.14em] text-ink outline-none [direction:ltr] focus:border-blue"
              />
              <button
                type="submit"
                className="flex h-16 flex-none cursor-pointer items-center gap-2.5 rounded-[18px] border-none bg-accent px-[30px] text-[17px] font-bold text-white hover:bg-accent-hover"
              >
                בדיקה <span aria-hidden="true">←</span>
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={runScan}
                className="flex h-12 cursor-pointer items-center gap-2.5 rounded-full border-[1.5px] border-ink bg-transparent px-5 text-[15px] font-bold text-ink hover:bg-ink hover:text-white"
              >
                <span aria-hidden="true" className="h-3 w-4 rounded-[3px] border-2 border-current" />
                סריקה במצלמה
              </button>
              <a href="#contact" className="text-[15px] text-navy underline underline-offset-4">
                המוצר לא במאגר? שלחו צילום
              </a>
            </div>
          </form>
          <ol className="m-0 mt-12 grid max-w-[560px] list-none grid-cols-3 gap-4 p-0" />
        </div>

        <div data-reveal="150" className="relative grid max-[1037px]:order-first min-h-[clamp(340px,30vw,450px)] place-items-center overflow-hidden rounded-[36px] bg-blue px-6 py-8">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          <div className="relative w-[min(84%,400px)] p-[26px]">
            {CORNERS.map((c) => (
              <span key={c} aria-hidden="true" className={`absolute h-11 w-11 border-white ${c}`} />
            ))}
            <div className="rounded-[18px] bg-white px-6 pb-[18px] pt-6 shadow-[0_30px_60px_-24px_rgba(5,11,30,.6)]">
              <div aria-hidden="true" className="relative h-[clamp(110px,10vw,150px)] [direction:ltr]">
                <div className="flex h-full">
                  {bars.map((b, i) => (
                    <span key={i} className={b.dark ? "bg-ink" : "bg-transparent"} style={{ flex: b.f }} />
                  ))}
                </div>
                <span ref={laserRef} className="pointer-events-none absolute -left-3.5 -right-3.5 top-0 h-0">
                  <span className="absolute inset-x-0 bottom-0 h-11 bg-[linear-gradient(0deg,rgba(255,90,60,.28),rgba(255,90,60,0))]" />
                  <span className="absolute inset-x-0 top-[-1px] h-0.5 rounded-sm bg-[#FF5A3C] shadow-[0_0_12px_3px_rgba(255,90,60,.75),0_0_40px_8px_rgba(208,65,40,.35)]" />
                </span>
              </div>
              <div className="mt-2 text-center font-mono text-[15px] tracking-[.3em] [direction:ltr]">{shown}</div>
            </div>
          </div>

          {scan === "done" && <Receipt code={bc} onReset={() => setScan("idle")} />}
        </div>
      </div>
    </section>
  );
}
