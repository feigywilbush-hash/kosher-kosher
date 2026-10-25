import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { RESTS, TYPE_C, TYPE_DOT, type KType } from "./data";

const CITIES = ["הכל", "קפריסין", "יוון", "בריטניה", "תאילנד", "הונגריה", "אוקראינה"];
const TYPES: ("הכל" | KType)[] = ["הכל", "בשרי", "חלבי", "פרווה"];
const FLOAT_H = 210;

export function Restaurants() {
  const [city, setCity] = useState("הכל");
  const [type, setType] = useState<"הכל" | KType>("הכל");
  const [rq, setRq] = useState("");
  const [hover, setHover] = useState<number | null>(null);
  const [floatY, setFloatY] = useState(0);
  const [floatAnim, setFloatAnim] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const q = rq.trim();
  const filtered = RESTS.filter((r) => (city === "הכל" || r.city === city) && (type === "הכל" || r.type === type) && (!q || r.name.includes(q) || r.city.includes(q)));
  const hov = hover != null ? RESTS[hover] : null;

  const onEnter = (idx: number, row: HTMLElement) => {
    const cont = listRef.current;
    if (!cont) return;
    const rr = row.getBoundingClientRect(), cr = cont.getBoundingClientRect();
    const rowTop = rr.top - cr.top;
    const above = rr.top - FLOAT_H - 12 > 100;
    setFloatAnim(hover != null);
    setFloatY(above ? rowTop - FLOAT_H - 12 : rowTop + rr.height + 12);
    setHover(idx);
  };

  return (
    <section
      id="restaurants"
      data-screen-label="Restaurants"
      className="mx-[2.5vw] scroll-mt-[90px] rounded-[32px] bg-white px-[clamp(20px,4.6vw,80px)] py-[clamp(48px,7vw,112px)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div data-reveal="0">
          <h2 className="mb-0 mt-3.5 flex items-start gap-3.5 font-display text-[clamp(68px,11vw,196px)] font-normal leading-[.86]">מסעדות</h2>
        </div>
        <div data-reveal="150" className="w-[min(100%,380px)]">
          <label htmlFor="rest-q" className="mb-1.5 block text-sm font-bold">
            חיפוש מסעדה
          </label>
          <input
            id="rest-q"
            value={rq}
            onChange={(e) => setRq(e.target.value)}
            placeholder="שם מסעדה, עיר או מדינה"
            autoComplete="off"
            className="h-14 w-full border-0 border-b-[1.5px] border-ink bg-transparent p-0 text-xl text-ink outline-none focus:border-blue"
          />
        </div>
      </div>

      <div data-reveal="200" className="mt-10 flex flex-wrap items-center justify-between gap-5">
        <div role="group" aria-label="סינון לפי עיר" className="flex flex-wrap gap-2">
          {CITIES.map((c) => {
            const on = city === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                aria-pressed={on}
                className={cn(
                  "h-11 cursor-pointer rounded-full border-[1.5px] px-[18px] text-[15px] font-normal transition-all duration-[250ms]",
                  on ? "border-ink bg-ink text-white" : "border-ink/[.18] bg-transparent text-ink",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div role="group" aria-label="סינון לפי סוג" className="flex gap-1 rounded-full bg-paper p-1">
          {TYPES.map((t) => {
            const on = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={on}
                className={cn(
                  "flex h-10 cursor-pointer items-center gap-2 rounded-full border-none px-4 text-sm font-bold transition-all duration-[250ms]",
                  on ? "bg-white text-ink" : "bg-transparent text-muted",
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", t === "הכל" ? "bg-ink" : TYPE_DOT[t])} />
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={listRef}
        onMouseLeave={() => {
          setHover(null);
          setFloatAnim(false);
        }}
        className="relative mt-7 border-t-[1.5px] border-ink"
      >
        {/* Floating photo preview (desktop hover) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 z-[6] -ml-[150px] hidden h-[210px] w-[300px] overflow-hidden rounded-[18px] bg-tint shadow-[0_30px_60px_-20px_rgba(12,23,51,.45)] dsk:block"
          style={{ top: floatY, opacity: hov ? 1 : 0, transition: `opacity .3s, top ${floatAnim ? ".45s cubic-bezier(.16,1,.3,1)" : "0s"}` }}
        >
          {RESTS.map((r, i) => (
            <span
              key={r.name}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${r.img})`,
                opacity: hover === i ? 1 : 0,
                transform: hover === i ? "scale(1)" : "scale(1.08)",
                transition: "opacity .35s ease, transform .6s cubic-bezier(.16,1,.3,1)",
              }}
            />
          ))}
          <span className="absolute inset-x-0 bottom-0 h-[60%] bg-[linear-gradient(0deg,rgba(12,23,51,.75),rgba(12,23,51,0))]" />
          <span className={cn("absolute right-3.5 top-3.5 rounded-full px-3 py-[5px] text-xs font-bold", hov ? cn(TYPE_C[hov.type].bg, TYPE_C[hov.type].fg) : "bg-white text-ink")}>
            {hov ? `${hov.type} · ${hov.level}` : ""}
          </span>
          <span className="absolute bottom-3.5 left-4 right-4 font-display text-[26px] leading-none text-white">{hov?.name ?? ""}</span>
        </div>

        {filtered.map((r, i) => (
          <a
            key={r.name}
            href="#restaurants"
            onMouseEnter={(e) => onEnter(RESTS.indexOf(r), e.currentTarget)}
            className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-5 border-b border-ink/[.12] px-3 py-6 text-ink transition-[background,padding] duration-300 hover:bg-paper hover:px-6 hover:text-ink cmp:grid-cols-[48px_minmax(0,1.7fr)_minmax(0,.8fr)_120px_minmax(0,.6fr)_44px]"
            style={{ transitionDuration: ".3s, .4s" }}
          >
            <span className="font-mono text-[13px] text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="font-display text-[clamp(28px,3.2vw,50px)] leading-none">{r.name}</span>
              <span className="text-sm text-muted cmp:hidden">
                {r.city} · {r.level}
              </span>
            </span>
            <span className="hidden text-base text-muted cmp:inline">{r.city}</span>
            <span className={cn("inline-flex h-8 items-center gap-2 justify-self-start rounded-full px-3.5 text-sm font-bold", TYPE_C[r.type].bg, TYPE_C[r.type].fg)}>
              <span className={cn("h-[7px] w-[7px] rounded-full", TYPE_DOT[r.type])} />
              {r.type}
            </span>
            <span className="hidden text-[15px] font-bold cmp:inline">{r.level}</span>
            <span aria-hidden="true" className="hidden h-11 w-11 place-items-center justify-self-end rounded-full border border-ink/20 text-lg cmp:grid">
              ←
            </span>
          </a>
        ))}

        {filtered.length === 0 && (
          <div className="py-14 text-center">
            <div className="font-display text-4xl">לא נמצאו מסעדות בסינון הזה</div>
            <button
              type="button"
              onClick={() => {
                setCity("הכל");
                setType("הכל");
                setRq("");
              }}
              className="mt-4 h-12 cursor-pointer rounded-full border-[1.5px] border-ink bg-transparent px-[22px] font-bold"
            >
              ניקוי הסינון
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
        <span className="text-sm text-muted">385 מסעדות כשרות מומלצות</span>
        <a href="#restaurants" className="inline-flex h-[52px] items-center gap-2.5 rounded-full bg-ink px-[26px] font-normal text-white hover:bg-blue hover:text-white">
          לכל המסעדות <span aria-hidden="true">←</span>
        </a>
      </div>
    </section>
  );
}
