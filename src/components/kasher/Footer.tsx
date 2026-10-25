import { useState } from "react";
import { cn } from "@/lib/utils";
import { NAV, asset } from "./data";
import { SiteLink } from "./SiteLink";

const AMOUNTS = [
  { v: 18, goal: "ביקור משגיח" },
  { v: 36, goal: "בדיקת מוצר חדש" },
  { v: 180, goal: "יום השגחה בחו״ל" },
  { v: 360, goal: "הכשרת משגיח" },
];
const FREQS = [
  { id: "once", label: "חד־פעמי" },
  { id: "monthly", label: "הוראת קבע" },
] as const;
const CONTACTS = [
  { k: "טלפון", v: "02-000-0000" },
  { k: "וואטסאפ", v: "050-000-0000" },
  { k: "דוא״ל", v: "info@example.co.il" },
  { k: "כתובת", v: "כתובת המשרד, ירושלים" },
  { k: "שעות פעילות", v: "א׳–ה׳ · 9:00–17:00" },
];
const TOPICS = ["בירור כשרות של מוצר", "מסעדה או עסק", "הצטרפות להשגחה", "בית הדין", "אחר"];
const DOTS = `url(${asset("images/world-dots.svg")})`;

const field = "w-full h-[52px] border-0 border-b-[1.5px] border-paper/30 bg-transparent p-0 text-lg text-paper outline-none focus:border-paper";
const fieldLabel = "block text-[13px] font-bold text-sky";

export function Footer() {
  const [amount, setAmount] = useState(180);
  const [freq, setFreq] = useState<(typeof FREQS)[number]["id"]>("once");
  const [sent, setSent] = useState(false);

  return (
    <footer
      id="contact"
      data-screen-label="Footer"
      className="relative scroll-mt-[90px] overflow-hidden pt-[2.5vw] text-paper"
      style={{ background: "linear-gradient(180deg, #EEF2FB 0, #EEF2FB clamp(140px,16vw,260px), #0C1733 clamp(140px,16vw,260px))" }}
    >
      {/* Donate */}
      <div
        id="donate"
        className="relative mx-[2.5vw] grid scroll-mt-[90px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(36px,5vw,80px)] overflow-hidden rounded-[32px] bg-accent px-[clamp(20px,4.6vw,80px)] py-[clamp(36px,5.4vw,88px)] text-white shadow-[0_50px_90px_-40px_rgba(12,23,51,.55)]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute aspect-square rounded-full border-2 border-white/[.18]" style={{ left: "-12%", top: "-40%", width: "min(70vw,760px)" }} />
        <div aria-hidden="true" className="pointer-events-none absolute aspect-square rounded-full border border-dashed border-white/[.22]" style={{ left: "-6%", top: "-28%", width: "min(56vw,600px)" }} />
        <div data-reveal="0" className="relative">
          <h2 className="mb-0 mt-[18px] font-display text-[clamp(48px,6.4vw,112px)] font-normal leading-[.94] [text-wrap:balance]">שותפים לכשרות של כולם.</h2>
          <p className="mb-0 mt-[22px] max-w-[500px] text-lg font-normal leading-[1.6]">התרומה מממנת משגיחים בשטח, את מאגר המוצרים הפתוח ואת המענה לשאלות, לכל מי שצריך.</p>
        </div>
        <div data-reveal="150" className="relative rounded-[26px] bg-white p-[clamp(24px,2.6vw,36px)] text-ink">
          <div role="group" aria-label="תדירות" className="grid grid-cols-2 gap-1 rounded-full bg-paper p-1">
            {FREQS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFreq(f.id)}
                aria-pressed={freq === f.id}
                className={cn("h-11 cursor-pointer rounded-full border-none text-[15px] font-normal", freq === f.id ? "bg-ink text-white" : "bg-transparent text-ink")}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="mb-2.5 mt-[22px] text-sm font-normal">סכום התרומה</div>
          <div role="group" aria-label="סכום" className="grid grid-cols-4 gap-2">
            {AMOUNTS.map((a) => {
              const on = amount === a.v;
              return (
                <button
                  key={a.v}
                  type="button"
                  onClick={() => setAmount(a.v)}
                  aria-pressed={on}
                  className={cn(
                    "flex min-h-[76px] cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] px-1.5 py-2.5 font-body transition-all duration-200",
                    on ? "border-ink bg-ink text-white" : "border-ink/[.16] bg-white text-ink",
                  )}
                >
                  <span className="text-[22px] font-bold leading-none">₪{a.v}</span>
                  <span className={cn("text-center text-xs font-normal leading-[1.25]", on ? "text-soft" : "text-muted")}>{a.goal}</span>
                </button>
              );
            })}
          </div>
          <a
            href="#donate"
            className="mt-[18px] flex h-16 items-center justify-center gap-2.5 rounded-full bg-accent text-lg font-normal text-white hover:bg-accent-hover hover:text-white"
          >
            {`לתרומה של ₪${amount}${freq === "monthly" ? " בחודש" : ""}`} <span aria-hidden="true">←</span>
          </a>
          <div className="mt-3 text-center text-[13px] text-muted">תשלום מאובטח · קבלה נשלחת במייל</div>
        </div>
      </div>

      {/* Contact */}
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 grid place-items-center overflow-hidden"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 70% 75% at 50% 50%, #000 35%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 70% 75% at 50% 50%, #000 35%, transparent 100%)",
          }}
        >
          <div className="relative flex-none" style={{ width: "max(150%, 1600px)", aspectRatio: "1800 / 690" }}>
            <div className="absolute inset-0 bg-sky opacity-[.035]" style={{ WebkitMaskImage: DOTS, maskImage: DOTS, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }} />
          </div>
        </div>
        <div className="mx-auto flex max-w-[1480px] flex-wrap gap-[clamp(48px,6vw,104px)] px-[clamp(20px,4.6vw,80px)] pt-[clamp(64px,8vw,120px)]">
          <div className="min-w-0 flex-[1_1_480px]">
            <h2 className="m-0 font-display text-[clamp(44px,5vw,84px)] font-normal leading-[.95]">
              יצירת <span className="text-sky">קשר</span>
            </h2>
            <p className="mb-0 mt-4 text-lg leading-[1.6] text-mist">שאלה, בירור כשרות או הצטרפות להשגחה. נחזור אליכם.</p>
            {!sent ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-7 gap-y-6"
              >
                <div>
                  <label htmlFor="c-name" className={fieldLabel}>שם מלא</label>
                  <input id="c-name" required autoComplete="name" className={field} />
                </div>
                <div>
                  <label htmlFor="c-phone" className={fieldLabel}>טלפון</label>
                  <input id="c-phone" type="tel" required autoComplete="tel" className={cn(field, "text-right [direction:ltr]")} />
                </div>
                <div className="col-span-full">
                  <label htmlFor="c-topic" className={fieldLabel}>נושא הפנייה</label>
                  <select id="c-topic" className={field}>
                    {TOPICS.map((t) => (
                      <option key={t} className="text-ink">{t}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-full">
                  <label htmlFor="c-msg" className={fieldLabel}>הודעה</label>
                  <textarea id="c-msg" rows={3} className={cn(field, "h-auto resize-y py-3.5")} />
                </div>
                <div className="col-span-full">
                  <button type="submit" className="inline-flex h-[60px] cursor-pointer items-center gap-2.5 rounded-full border-none bg-accent px-[34px] text-[17px] font-normal text-white hover:bg-accent-hover">
                    שליחה <span aria-hidden="true">←</span>
                  </button>
                </div>
              </form>
            ) : (
              <div role="status" className="mt-9 flex items-center gap-5 rounded-3xl border-[1.5px] border-paper/25 p-7">
                <span aria-hidden="true" className="grid h-16 w-16 flex-none -rotate-12 place-items-center rounded-full border-[3px] border-accent font-display text-[22px] text-accent">
                  התקבל
                </span>
                <span className="text-lg leading-[1.5]">תודה, הפנייה התקבלה. נציג יחזור אליכם בהקדם.</span>
              </div>
            )}
          </div>
          <div className="grid min-w-0 flex-[1_1_340px] grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] content-end gap-10 pb-[84px]">
            <div>
              <div className="mb-[18px] font-display text-[clamp(26px,2.2vw,34px)] leading-none text-sky">פרטי התקשרות</div>
              {CONTACTS.map((c) => (
                <div key={c.k} className="border-b border-paper/10 py-2.5">
                  <div className="text-xs text-mist">{c.k}</div>
                  <div className="mt-1 text-[17px]">{c.v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="mb-[18px] font-display text-[clamp(26px,2.2vw,34px)] leading-none text-sky">באתר</div>
              <nav aria-label="ניווט תחתון" className="flex flex-col gap-1">
                {[...NAV, { label: "תרומות", href: "#donate" }].map((n) => (
                  <SiteLink key={n.label} to={n.href} className="py-2 text-[17px] text-paper hover:text-sky">
                    {n.label}
                  </SiteLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="h-[clamp(110px,9vw,150px)]" />
      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1480px] flex-wrap justify-between gap-x-6 gap-y-3 px-[clamp(20px,4.6vw,80px)] pb-[120px] pt-[22px] text-[13px] text-mist dsk:pb-12">
        <span>© 2026 כשר כשר · ועד רבני אירופה</span>
        <span className="flex flex-wrap gap-5">
          <a href="#contact" className="text-mist">הצהרת נגישות</a>
          <a href="#contact" className="text-mist">מדיניות פרטיות</a>
          <a href="#contact" className="text-mist">תקנון</a>
        </span>
      </div>
    </footer>
  );
}
