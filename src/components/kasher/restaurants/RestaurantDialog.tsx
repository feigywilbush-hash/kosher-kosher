import { useEffect, useRef } from "react";
import { MapPin, MessageCircle, Phone, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLenis } from "@/lib/scroll";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Restaurant } from "@/data/restaurants";
import { RestaurantImage } from "./RestaurantImage";
import { AUTHORITY_LABEL, TypeTag } from "./tags";

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(+d) ? iso : d.toLocaleDateString("he-IL", { day: "numeric", month: "numeric", year: "numeric" });
};

export function RestaurantDialog({ r, onClose }: { r: Restaurant; onClose: () => void }) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    if (!reduced)
      panelRef.current?.animate([{ opacity: 0, transform: "translateY(40px) scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      // Keep focus inside the dialog.
      const f = panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [onClose, reduced]);

  const rows = [
    { k: "עיר", v: `${r.city}, ${r.country}` },
    { k: "כתובת", v: r.address },
    { k: "שעות פתיחה", v: r.hours },
    { k: "רמת כשרות", v: r.level },
    { k: "גוף מפקח", v: r.supervisor },
    { k: "הרב האחראי", v: r.rabbi },
    { k: "משגיח", v: r.mashgiach },
    { k: "סוג פיקוח", v: r.supervisionType },
    { k: "תעודה בתוקף עד", v: r.certValidUntil && fmtDate(r.certValidUntil) },
  ].filter((x) => x.v);

  const actions = [
    r.maps && { href: r.maps, label: "ניווט", Icon: MapPin, primary: true },
    r.whatsapp && { href: r.whatsapp, label: "וואטסאפ", Icon: MessageCircle },
    r.wolt && { href: r.wolt, label: "הזמנה ב-Wolt", Icon: ShoppingBag },
    r.phone && { href: `tel:${r.phone.replace(/[^\d+]/g, "")}`, label: r.phone, Icon: Phone, ltr: true },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof MapPin; primary?: boolean; ltr?: boolean }[];

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-ink/60 p-3 backdrop-blur-[6px] cmp:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rest-dialog-title"
        data-lenis-prevent
        className="relative grid max-h-[calc(100dvh-24px)] w-full max-w-[960px] overflow-y-auto overscroll-contain rounded-[28px] bg-white text-ink shadow-[0_50px_100px_-30px_rgba(5,11,30,.7)] cmp:max-h-[calc(100dvh-48px)] dsk:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="סגירת חלון הפרטים"
          className="absolute left-4 top-4 z-[2] grid h-11 w-11 cursor-pointer place-items-center rounded-full border-none bg-white/90 text-ink shadow-[0_6px_20px_-6px_rgba(12,23,51,.4)] hover:bg-ink hover:text-white"
        >
          <X size={20} strokeWidth={2} />
        </button>

        <div className="p-2.5 dsk:pe-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] dsk:aspect-auto dsk:h-full dsk:min-h-[520px]">
            <RestaurantImage r={r} />
          </div>
        </div>

        <div className="flex flex-col px-[clamp(20px,3vw,40px)] pb-[clamp(22px,3vw,36px)] pt-[clamp(18px,3vw,40px)]">
          <div className="text-[13px] text-muted">
            {r.country} · {r.city}
          </div>
          <h2 id="rest-dialog-title" className="mb-0 mt-2 font-display text-[clamp(36px,3.6vw,52px)] font-normal leading-[.95] [text-wrap:balance]">
            {r.name}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <TypeTag type={r.type} />
            <span className={cn("inline-flex h-8 items-center gap-2 rounded-full px-3.5 text-sm font-bold", r.authority === "vaad" ? "bg-ink text-white" : "bg-paper text-ink")}>
              <span className={cn("h-[7px] w-[7px] rounded-full", r.authority === "vaad" ? "bg-accent" : "bg-blue")} />
              {AUTHORITY_LABEL[r.authority]}
            </span>
            {r.status === "בבדיקה" && <span className="inline-flex h-8 items-center rounded-full bg-meat-bg px-3.5 text-sm font-bold text-meat">בבדיקה</span>}
          </div>

          {r.status === "בבדיקה" && (
            <p className="mb-0 mt-4 rounded-2xl bg-meat-bg px-4 py-3 text-[15px] leading-[1.5] text-meat">העסק נמצא כרגע בבדיקה. מומלץ לוודא את סטטוס הכשרות לפני הביקור.</p>
          )}
          {r.description && <p className="mb-0 mt-5 text-[17px] leading-[1.65] text-muted [text-wrap:pretty]">{r.description}</p>}

          <div className="mb-2 mt-6 border-t-[1.5px] border-dashed border-ink/30" />
          {rows.map((row) => (
            <div key={row.k} className="flex items-baseline gap-2 py-[7px] text-[15px]">
              <span className="flex-none text-muted">{row.k}</span>
              <span aria-hidden="true" className="min-w-[24px] flex-1 -translate-y-1 border-b-[1.5px] border-dotted border-ink/30" />
              <span className="text-left font-bold">{row.v}</span>
            </div>
          ))}
          <div className="mt-3 border-t-[1.5px] border-dashed border-ink/30" />

          {actions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {actions.map(({ href, label, Icon, primary, ltr }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex h-12 items-center gap-2.5 rounded-full px-5 text-[15px] font-bold transition-[background,color] duration-[250ms]",
                    primary ? "bg-accent text-white hover:bg-accent-hover hover:text-white" : "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-white",
                  )}
                >
                  <Icon size={17} strokeWidth={2} aria-hidden="true" />
                  <span className={ltr ? "[direction:ltr]" : undefined}>{label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
