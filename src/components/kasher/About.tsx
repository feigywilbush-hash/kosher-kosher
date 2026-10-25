import { asset } from "./data";

const LINKS = [
  { t: "רשימת רבנים", d: "הרבנים והמשגיחים של המערך, לפי אזור ותחום.", href: "#about" },
  { t: "בית הדין", d: "פניות, דיונים ובירורים מול הרכב הדיינים.", href: "#about" },
  { t: "הצטרפות להשגחה", d: "לבעלי עסקים: תהליך מסודר, ליווי צמוד ותעודה.", href: "#contact" },
];

export function About() {
  return (
    <section
      id="about"
      data-screen-label="About"
      className="mx-auto max-w-[1480px] scroll-mt-[90px] px-[clamp(20px,4.6vw,80px)] pb-[clamp(80px,9vw,140px)] pt-12 cmp:pt-[clamp(96px,12vw,180px)]"
    >
      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-[clamp(32px,6vw,100px)]">
        <div id="about-statement" data-reveal="0" className="flex w-full max-w-[640px] flex-col gap-[clamp(18px,2vw,28px)] self-center [container-type:inline-size]">
          <h2 className="m-0 font-display text-[clamp(48px,5.6vw,98px)] font-normal leading-[.92] text-ink">הרב ידידיה כהן שליט"א</h2>
          <div className="mt-[calc(-1*clamp(12px,1.6vw,22px))] font-display text-[clamp(48px,5.6vw,98px)] leading-none text-blue">
            <span className="block whitespace-nowrap">הרב הראשי של קפריסין ויוון</span>
            <span className="block whitespace-nowrap">נשיא ועד רבני אירופה</span>
          </div>
          <p className="m-0 text-[clamp(17px,1.3vw,20px)] leading-[1.75] text-ink [text-wrap:pretty]">
            הרב ידידיה כהן עומד בראש מערך הכשרות בקפריסין ויוון ומשמש כנשיא ועד רבני אירופה שע״י תפארת ישראל. אחראי על הפיקוח השוטף על העסקים, הדרכת המשגיחים ומתן מענה כשרותי לציבור המטייל והתושב בארץ ובעולם.
          </p>
          <p className="m-0 text-[clamp(17px,1.3vw,20px)] leading-[1.75] text-muted [text-wrap:pretty]">
            אתר כשרכשר פועל בהכוונת רבני ועד רבני אירופה שע״י תפארת ישראל, מתוך מטרה לתת לציבור מענה כשרותי מקצועי, ברור ואחראי בארץ ובעולם - <strong className="text-ink">להרבות כשרות בעולם.</strong>
          </p>
        </div>
        <div data-reveal="100" className="relative order-[-1] aspect-[4/5] max-h-[620px] w-[min(100%,496px)] justify-self-end rounded-[28px] bg-tint">
          <div
            role="img"
            aria-label="הרב ידידיה כהן בודק מוצרים במטבח"
            className="absolute inset-0 rounded-[28px] bg-cover"
            style={{ backgroundImage: `url(${asset("images/rabbi-inspecting.jpg")})`, backgroundPosition: "50% 30%" }}
          />
        </div>
      </div>

      <div className="mt-[clamp(96px,11vw,170px)] border-b border-ink/[.16]">
        {LINKS.map((l) => (
          <a
            key={l.t}
            href={l.href}
            data-reveal="0"
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-[clamp(16px,2.4vw,40px)] rounded-[20px] border-t border-ink/[.16] px-[clamp(8px,1.2vw,20px)] py-[clamp(22px,2.4vw,34px)] text-ink transition-[background,color] duration-[350ms] hover:bg-blue hover:text-white"
          >
            <span className="flex min-w-0 flex-wrap items-center justify-between gap-x-10 gap-y-2">
              <span className="whitespace-nowrap font-display text-[clamp(32px,3.4vw,56px)] leading-none">{l.t}</span>
              <span className="max-w-[440px] text-[17px] leading-[1.5] opacity-80 [text-wrap:pretty]">{l.d}</span>
            </span>
            <span aria-hidden="true" className="grid h-[52px] w-[52px] place-items-center rounded-full border-[1.5px] border-current text-xl">
              ←
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
