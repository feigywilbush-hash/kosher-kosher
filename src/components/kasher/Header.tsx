import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { NAV } from "./data";
import { SiteLink } from "./SiteLink";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const close = () => setMenu(false);

  return (
    <>
      <a
        href="#main"
        className="fixed right-4 top-[-80px] z-[100] rounded-xl bg-ink px-5 py-3 font-bold text-white focus:top-4 focus:text-white"
      >
        דילוג לתוכן
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 backdrop-blur-[16px] transition-[background,box-shadow] duration-[400ms]",
          scrolled
            ? "bg-white/[.86] shadow-[0_1px_0_rgba(12,23,51,.08),0_10px_30px_-18px_rgba(12,23,51,.25)]"
            : "bg-white/0",
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-6 px-[2.5vw] transition-[padding] duration-[400ms]",
            scrolled ? "py-[17px]" : "py-[22px]",
          )}
        >
          <SiteLink to="/" aria-label="כשר כשר, ועד רבני אירופה. לדף הבית" className="flex items-center gap-3 text-ink hover:text-ink">
            <span className="flex flex-col leading-none">
              <span className="whitespace-nowrap font-display text-[28px]">
                כשר <span className="text-blue">כשר</span>
              </span>
              <span className="mt-[5px] text-xs tracking-[.02em] text-muted">ועד רבני אירופה</span>
            </span>
          </SiteLink>

          <nav aria-label="ניווט ראשי" className="hidden items-center gap-[clamp(16px,2vw,34px)] dsk:flex">
            {NAV.map((n) => {
              const active = n.href === pathname;
              return (
                <SiteLink
                  key={n.label}
                  to={n.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b-[1.5px] py-2.5 text-lg transition-[color,border-color] duration-[250ms] hover:border-blue hover:text-blue",
                    active ? "border-blue text-blue" : "border-transparent text-ink",
                  )}
                >
                  {n.label}
                </SiteLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="#donate"
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-accent px-6 text-[15px] font-normal text-white transition-[background,transform] duration-[250ms] hover:-translate-y-px hover:bg-accent-hover hover:text-white"
            >
              תרומות <span aria-hidden="true">←</span>
            </a>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label="פתיחת תפריט"
              aria-expanded={menu}
              className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full border-[1.5px] border-ink bg-transparent p-0 dsk:hidden"
            >
              <span className="h-0.5 w-[18px] rounded-sm bg-ink" />
              <span className="h-0.5 w-[18px] rounded-sm bg-ink" />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div role="dialog" aria-label="תפריט" className="fixed inset-0 z-[90] flex flex-col bg-ink p-6 text-paper">
          <div className="flex items-center justify-between">
            <span className="flex flex-col leading-none">
              <span className="whitespace-nowrap font-display text-[28px] text-white">
                כשר <span className="text-sky">כשר</span>
              </span>
              <span className="mt-[5px] text-xs tracking-[.02em] text-mist">ועד רבני אירופה</span>
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="סגירת תפריט"
              className="h-12 w-12 cursor-pointer rounded-full border-[1.5px] border-paper bg-transparent text-[22px] text-paper"
            >
              ✕
            </button>
          </div>
          <nav aria-label="ניווט נייד" className="mt-12 flex flex-col gap-1.5">
            {[...NAV, { label: "יצירת קשר", href: "#contact" }].map((n) => (
              <SiteLink
                key={n.label}
                to={n.href}
                onClick={close}
                className="border-b border-paper/[.12] py-1.5 font-display text-[44px] leading-[1.15] text-paper hover:text-paper"
              >
                {n.label}
              </SiteLink>
            ))}
          </nav>
          <a
            href="#donate"
            onClick={close}
            className="mt-auto flex h-[60px] items-center justify-center rounded-full bg-accent text-lg font-bold text-white hover:text-white"
          >
            לתרומה ←
          </a>
        </div>
      )}
    </>
  );
}
