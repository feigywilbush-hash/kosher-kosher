import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { QS } from "./data";

const timeFmt = new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jerusalem" });

function TypingDots() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const as = Array.from(ref.current?.children ?? []).map((d, i) =>
      d.animate([{ transform: "translateY(0)", opacity: 0.35 }, { transform: "translateY(-5px)", opacity: 1 }, { transform: "translateY(0)", opacity: 0.35 }], { duration: 900, delay: i * 150, iterations: Infinity }),
    );
    return () => as.forEach((a) => a.cancel());
  }, []);
  return (
    <div ref={ref} aria-label="מקלידים" className="flex gap-1.5 self-start rounded-[20px_20px_6px_20px] bg-paper px-[18px] py-4">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-navy" />
      ))}
    </div>
  );
}

function Answer({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!reduced) ref.current?.animate([{ transform: "translateY(10px) scale(.97)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 380, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
  }, [reduced]);
  return (
    <div ref={ref} className="max-w-[86%] self-start rounded-[20px_20px_6px_20px] bg-paper px-[18px] py-3.5 text-[17px] leading-[1.6] text-ink">
      <div className="mb-1 text-[13px] font-bold text-blue">מחלקת שאלות ותשובות</div>
      {text}
    </div>
  );
}

export function QA() {
  const reduced = useReducedMotion();
  const [openQ, setOpenQ] = useState(0);
  const [custom, setCustom] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const typeT = useRef<number>();

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => {
      clearInterval(t);
      clearTimeout(typeT.current);
    };
  }, []);

  const showTyping = (ms: number) => {
    clearTimeout(typeT.current);
    setTyping(true);
    typeT.current = window.setTimeout(() => setTyping(false), ms);
  };

  const ask = (i: number) => {
    setOpenQ(i);
    setCustom(null);
    showTyping(reduced ? 0 : 1100);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    setCustom(t);
    setDraft("");
    showTyping(1300);
  };

  const q = custom ?? QS[openQ].q;
  const a = custom != null ? "קיבלנו את השאלה. רב מהמחלקה יחזור אליכם בהקדם, ואפשר להמשיך גם בוואטסאפ." : QS[openQ].a;

  return (
    <section
      id="qa"
      data-screen-label="Q&A"
      className="mx-[2.5vw] mt-6 scroll-mt-[90px] rounded-[32px] bg-navy px-[clamp(20px,4.6vw,80px)] py-[clamp(36px,5.4vw,88px)] text-paper"
    >
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div data-reveal="0">
          <h2 className="mb-0 mt-[18px] font-display text-[clamp(52px,7.4vw,128px)] font-normal leading-[.92]">
            שאלות <span className="text-sky">ותשובות</span>
          </h2>
        </div>
        <a
          data-reveal="150"
          href="#qa"
          className="inline-flex h-[52px] items-center gap-2.5 rounded-full border-[1.5px] border-paper/40 px-[26px] font-normal text-paper hover:bg-paper hover:text-navy"
        >
          לכל השאלות <span aria-hidden="true">←</span>
        </a>
      </div>

      <div className="mt-[clamp(40px,4.4vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-stretch gap-[clamp(32px,4vw,64px)]">
        <ol data-reveal="100" className="m-0 flex list-none flex-col border-t border-paper/[.18] p-0">
          {QS.map((x, i) => {
            const on = custom == null && openQ === i;
            return (
              <li key={i} className="flex flex-1">
                <button
                  type="button"
                  onClick={() => ask(i)}
                  aria-pressed={on}
                  className={cn(
                    "grid w-full flex-1 cursor-pointer grid-cols-[44px_minmax(0,1fr)_14px] items-center gap-3.5 border-b border-paper/[.14] bg-transparent px-1 py-[22px] text-right text-[clamp(17px,1.35vw,21px)] leading-[1.45] transition-colors duration-[250ms] hover:text-white",
                    on ? "text-white" : "text-mist",
                  )}
                >
                  <span className="font-mono text-[13px] text-sky">{String(i + 1).padStart(2, "0")}</span>
                  <span className="[text-wrap:pretty]">{x.q}</span>
                  <span className={cn("h-2.5 w-2.5 rounded-full transition-[background] duration-[250ms]", on ? "bg-accent" : "bg-paper/[.18]")} />
                </button>
              </li>
            );
          })}
        </ol>

        <div data-reveal="200" className="flex min-h-[500px] flex-col overflow-hidden rounded-[28px] bg-ink shadow-[0_40px_80px_-40px_rgba(5,11,30,.8)]">
          <div className="flex items-center gap-3.5 border-b border-paper/10 px-[22px] py-[18px]">
            <span aria-hidden="true" className="grid h-[46px] w-[46px] place-items-center rounded-full bg-blue font-display text-xl">
              ש״ת
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-base font-bold">מחלקת שאלות ותשובות</span>
              <span className="flex items-center gap-1.5 text-[13px] text-mist">
                <span className="h-[7px] w-[7px] rounded-full bg-sky" />
                זמינים לשאלות
              </span>
            </span>
          </div>
          <div
            role="log"
            aria-live="polite"
            className="flex flex-1 flex-col gap-3.5 px-[22px] py-6"
            style={{ backgroundImage: "radial-gradient(rgba(142,166,255,.08) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
          >
            <span className="self-center rounded-full bg-paper/[.08] px-3 py-1 text-xs text-mist">היום</span>
            <div className="max-w-[82%] self-end rounded-[20px_20px_20px_6px] bg-blue px-[18px] py-3.5 text-[17px] leading-[1.55] text-white">
              {q}
              <div className="mt-1.5 text-left text-[11px] opacity-75">{timeFmt.format(new Date(now))} ✓✓</div>
            </div>
            {typing ? <TypingDots /> : <Answer key={q + openQ} text={a} />}
          </div>
          <form onSubmit={send} className="flex gap-2.5 border-t border-paper/10 p-3.5">
            <label htmlFor="ask-q" className="sr-only">
              שאלה לרב
            </label>
            <input
              id="ask-q"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="כתבו שאלה משלכם…"
              autoComplete="off"
              className="h-[54px] min-w-0 flex-1 rounded-full border border-paper/[.14] bg-navy px-[22px] text-base text-paper outline-none focus:border-sky"
            />
            <button type="submit" aria-label="שליחת השאלה" className="h-[54px] w-[54px] flex-none cursor-pointer rounded-full border-none bg-accent text-xl text-white hover:bg-accent-hover">
              ←
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
