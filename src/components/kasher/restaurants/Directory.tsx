import { useCallback, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESTAURANTS, type Authority, type Restaurant } from "@/data/restaurants";
import { TYPE_DOT, type KType } from "../data";
import { SiteLink } from "../SiteLink";
import { RestaurantCard } from "./RestaurantCard";
import { RestaurantDialog } from "./RestaurantDialog";
import { FilterSelect } from "./FilterSelect";

const COUNTRY_ORDER = ["קפריסין", "יוון", "תאילנד", "הונגריה"];
const COUNTRIES = [...new Set(RESTAURANTS.map((r) => r.country))].sort((a, b) => COUNTRY_ORDER.indexOf(a) - COUNTRY_ORDER.indexOf(b));
const TYPES: ("הכל" | KType)[] = ["הכל", "בשרי", "חלבי", "פרווה"];
const AUTHS: ("הכל" | Authority)[] = ["הכל", "vaad", "recommended"];
const AUTH_CHIP: Record<"הכל" | Authority, string> = { "הכל": "הכל", vaad: "בפיקוח ועד רבני אירופה", recommended: "בהמלצת ועד רבני אירופה" };
const PAGE = 20;

const norm = (s: string) => s.toLowerCase().replace(/['"׳״`]/g, "");
const haystack = (r: Restaurant) => norm([r.name, r.city, r.country, r.description, r.address].join(" "));

export function Directory() {
  const [country, setCountry] = useState("הכל");
  const [type, setType] = useState<"הכל" | KType>("הכל");
  const [auth, setAuth] = useState<"הכל" | Authority>("הכל");
  const [rq, setRq] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState<Restaurant | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const q = norm(rq.trim());
  const matches = useCallback(
    (r: Restaurant, skipCountry = false, skipAuth = false) =>
      (skipCountry || country === "הכל" || r.country === country) &&
      (type === "הכל" || r.type === type) &&
      (skipAuth || auth === "הכל" || r.authority === auth) &&
      (!q || haystack(r).includes(q)),
    [country, type, auth, q],
  );
  const filtered = useMemo(() => RESTAURANTS.filter((r) => matches(r)), [matches]);
  const countFor = (c: string) => RESTAURANTS.filter((r) => matches(r, true) && (c === "הכל" || r.country === c)).length;

  const reset = () => {
    setCountry("הכל");
    setType("הכל");
    setAuth("הכל");
    setRq("");
    setLimit(PAGE);
  };
  // Any filter change starts the list from the top again.
  const withReset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setLimit(PAGE);
  };

  const onOpen = useCallback((r: Restaurant, el: HTMLElement) => {
    opener.current = el;
    setOpen(r);
  }, []);
  const onClose = useCallback(() => {
    setOpen(null);
    opener.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section id="directory" data-screen-label="Restaurants directory" className="relative px-[2.5vw] pt-24">
      <div className="rounded-[32px] bg-white px-[clamp(20px,4.6vw,80px)] pb-[clamp(48px,7vw,112px)] pt-[clamp(28px,3.6vw,56px)]">
        <nav aria-label="פירורי לחם" data-hero-in="0" className="flex items-center gap-2 text-sm text-muted">
          <SiteLink to="/" className="text-muted hover:text-blue">
            דף הבית
          </SiteLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-ink">
            מסעדות כשרות
          </span>
        </nav>

        <div className="mt-[clamp(28px,4vw,64px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
          <h1 className="m-0 font-display text-[clamp(68px,11vw,196px)] font-normal leading-[.86]">
            <span className="block overflow-hidden pb-[.06em]">
              <span data-line className="block">
                מסעדות <span className="text-blue">כשרות</span>
              </span>
            </span>
          </h1>
          <div data-hero-in="100" className="w-[min(100%,420px)] dsk:mb-[calc(clamp(68px,11vw,196px)*0.107-11px)]">
            <p className="m-0 text-[clamp(17px,1.3vw,20px)] leading-[1.6] text-muted [text-wrap:pretty]">
              מסעדות בכשרות ועד רבני אירופה ובהמלצתו.
              <br />
              סננו לפי יעד וסוג, ובדקו את פרטי ההשגחה לפני שמגיעים.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div data-hero-in="200" className="mt-[clamp(40px,4.4vw,72px)] flex flex-wrap items-center gap-3 rounded-[24px] bg-paper p-[clamp(12px,1.4vw,20px)]">
          <div className="relative min-w-[min(100%,220px)] flex-1">
            <label htmlFor="dir-q" className="sr-only">
              חיפוש מסעדה
            </label>
            <Search size={20} strokeWidth={2} aria-hidden="true" className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="dir-q"
              type="search"
              value={rq}
              onChange={(e) => withReset(setRq)(e.target.value)}
              placeholder="שם מסעדה, עיר או מדינה"
              autoComplete="off"
              className="h-14 w-full rounded-full border-[1.5px] border-transparent bg-white pe-12 ps-[52px] text-[17px] text-ink outline-none transition-[border-color] duration-[250ms] focus:border-blue [&::-webkit-search-cancel-button]:hidden"
            />
            {rq && (
              <button
                type="button"
                onClick={() => withReset(setRq)("")}
                aria-label="ניקוי החיפוש"
                className="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-none bg-paper text-ink hover:bg-ink hover:text-white"
              >
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>
          <div role="group" aria-label="סינון לפי סוג" className="flex w-full gap-1 rounded-full bg-white p-1 cmp:w-auto">
            {TYPES.map((t) => {
              const on = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => withReset(setType)(t)}
                  aria-pressed={on}
                  className={cn(
                    "flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-none px-3 text-[15px] font-normal transition-all duration-[250ms] cmp:flex-none cmp:px-[18px]",
                    on ? "bg-ink text-white" : "bg-transparent text-muted hover:text-ink",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", t === "הכל" ? (on ? "bg-white" : "bg-ink") : TYPE_DOT[t])} />
                  {t}
                </button>
              );
            })}
          </div>
          <FilterSelect
            label="מדינה:"
            value={country}
            onChange={withReset(setCountry)}
            options={["הכל", ...COUNTRIES].map((c) => ({ value: c, label: c === "הכל" ? "כל המדינות" : c, count: countFor(c) }))}
            className="min-w-[200px] flex-1 cmp:flex-none"
          />
          <FilterSelect<"הכל" | Authority>
            label="כשרות:"
            value={auth}
            onChange={withReset(setAuth)}
            options={AUTHS.map((a) => ({
              value: a,
              label: AUTH_CHIP[a],
              count: RESTAURANTS.filter((r) => matches(r, false, true) && (a === "הכל" || r.authority === a)).length,
            }))}
            className="min-w-[200px] flex-1 cmp:flex-none"
          />
        </div>

        <p aria-live="polite" className="sr-only">
          {filtered.length} מסעדות נמצאו
        </p>

        {filtered.length > 0 ? (
          <div className="mt-[clamp(24px,2.6vw,40px)] grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] dsk:grid-cols-4 gap-[clamp(14px,1.6vw,24px)]">
            {filtered.slice(0, limit).map((r) => (
              <RestaurantCard key={r.id} r={r} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="font-display text-4xl">לא נמצאו מסעדות בסינון הזה</div>
            <p className="mx-auto mb-0 mt-3 max-w-[420px] text-base leading-[1.6] text-muted">
              מכירים מסעדה כשרה שחסרה כאן?{" "}
              <a href="#add-restaurant" className="text-blue underline underline-offset-4">
                ספרו לנו עליה
              </a>
            </p>
            <button type="button" onClick={reset} className="mt-6 h-12 cursor-pointer rounded-full border-[1.5px] border-ink bg-transparent px-[22px] font-bold hover:bg-ink hover:text-white">
              ניקוי הסינון
            </button>
          </div>
        )}

        {filtered.length > limit && (
          <div className="mt-[clamp(32px,3.6vw,56px)] flex justify-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE)}
              className="inline-flex h-[52px] cursor-pointer items-center gap-2.5 rounded-full border-none bg-ink px-[26px] text-base font-normal text-white hover:bg-blue"
            >
              הצגת עוד מסעדות
              <span className="font-mono text-[13px] text-white/60">{filtered.length - limit}</span>
            </button>
          </div>
        )}
      </div>

      {open && <RestaurantDialog r={open} onClose={onClose} />}
    </section>
  );
}
