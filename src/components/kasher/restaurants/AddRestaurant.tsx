import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type KType } from "../data";

const COUNTRY_OPTS = ["קפריסין", "יוון", "תאילנד", "הונגריה", "בריטניה", "אוקראינה", "אחר"];
const TYPES: KType[] = ["בשרי", "חלבי", "פרווה"];
const STEPS = [
  { n: "01", t: "מגישים בקשה", d: "ממלאים את פרטי המסעדה, מיקומה וסוג הכשרות המבוקשת." },
  { n: "02", t: "בדיקת הכשרות", d: "צוות ועד רבני אירופה בוחן את פרטי המסעדה ואת הכשרות הקיימת או המבוקשת." },
  { n: "03", t: "אישור והצטרפות", d: "לאחר השלמת הבדיקות וקבלת אישור הוועד, המסעדה תוכל להצטרף לרשימת המסעדות הכשרות המומלצות באתר." },
];

const input =
  "h-14 w-full rounded-[18px] border-[1.5px] border-ink/[.16] bg-white px-[18px] text-[17px] text-ink outline-none transition-[border-color] duration-[250ms] placeholder:text-[#757575] hover:border-ink/40 focus:border-blue";

function Field({ id, label, required, className, children }: { id: string; label: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-bold">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
    </div>
  );
}

export function AddRestaurant() {
  const [type, setType] = useState<KType | "">("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    // TODO: connect to the backend / email service that receives restaurant requests.
    setSent(true);
  };

  return (
    <section
      id="add-restaurant"
      data-screen-label="Add restaurant"
      className="mx-[2.5vw] mt-6 scroll-mt-[90px] rounded-[32px] bg-navy px-[clamp(20px,4.6vw,80px)] py-[clamp(36px,5.4vw,88px)] text-paper"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-[clamp(32px,5vw,88px)]">
        <div data-reveal="0" className="flex flex-col dsk:sticky dsk:top-28">
          <h2 className="m-0 font-display text-[clamp(52px,7.4vw,128px)] font-normal leading-[.92]">
            הצטרפות למערך <span className="text-sky">הכשרות</span>
          </h2>
          <div className="mt-6 max-w-[480px] space-y-4 text-[clamp(17px,1.3vw,20px)] leading-[1.65] text-mist [text-wrap:pretty]">
            <p className="m-0">
              בעלי מסעדה? ועד רבני אירופה מזמין אתכם להגיש בקשה להצטרפות למערך הכשרות או לבחינת המסעדה והכשרות הקיימת לצורך קבלת המלצה והופעה באתר.
            </p>
            <p className="m-0">
              מלאו את פרטי המסעדה, וצוות הוועד יבחן את הבקשה, יבדוק את פרטי הכשרות ויצור עמכם קשר להמשך התהליך.
            </p>
          </div>
          <ol className="m-0 mt-[clamp(32px,3.6vw,56px)] list-none border-t border-paper/[.18] p-0">
            {STEPS.map((s) => (
              <li key={s.n} className="grid grid-cols-[44px_minmax(0,1fr)] gap-3.5 border-b border-paper/[.14] px-1 py-[22px]">
                <span className="pt-1 font-mono text-[13px] text-sky">{s.n}</span>
                <span className="flex flex-col gap-1.5">
                  <span className="font-display text-[clamp(26px,2.2vw,34px)] leading-none text-white">{s.t}</span>
                  <span className="text-base leading-[1.5] text-mist">{s.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div data-reveal="150" className="rounded-[28px] bg-white p-[clamp(20px,3vw,44px)] text-ink shadow-[0_40px_80px_-40px_rgba(5,11,30,.8)]">
          {sent ? (
            <div role="status" className="flex min-h-[520px] flex-col items-center justify-center text-center">
              <span aria-hidden="true" className="grid h-[132px] w-[132px] -rotate-[8deg] place-items-center rounded-full border-[2.5px] border-dashed border-blue">
                <span className="grid h-[104px] w-[104px] place-items-center rounded-full bg-blue font-display text-[34px] text-white">התקבל</span>
              </span>
              <h3 className="mb-0 mt-8 font-display text-[clamp(36px,3.4vw,52px)] font-normal leading-none">תודה, הבקשה נשלחה</h3>
              <p className="mx-auto mb-0 mt-4 max-w-[380px] text-[17px] leading-[1.6] text-muted">נבדוק את פרטי הכשרות מול המשגיח ונעדכן אתכם בטלפון שהשארתם.</p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setType("");
                }}
                className="mt-8 h-12 cursor-pointer rounded-full border-[1.5px] border-ink bg-transparent px-[22px] font-bold hover:bg-ink hover:text-white"
              >
                בקשה נוספת
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-x-4 gap-y-5 cmp:grid-cols-2">
              <div className="cmp:col-span-2">
                <h3 className="m-0 font-display text-[clamp(32px,2.8vw,44px)] font-normal leading-none">בקשה להוספת מסעדה</h3>
                <p className="mb-0 mt-2 text-[15px] text-muted">שדות המסומנים ב-<span className="text-accent">*</span> הם שדות חובה</p>
              </div>

              <Field id="ar-name" label="שם המסעדה" required className="cmp:col-span-2">
                <input id="ar-name" name="name" required className={input} />
              </Field>
              <Field id="ar-country" label="מדינה" required>
                <span className="relative">
                  <select id="ar-country" name="country" required defaultValue="" className={cn(input, "cursor-pointer appearance-none pe-10 invalid:text-[#757575]")}>
                    <option value="" disabled>
                      בחירת מדינה
                    </option>
                    {COUNTRY_OPTS.map((c) => (
                      <option key={c} className="text-ink">
                        {c}
                      </option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 text-sm">
                    ▾
                  </span>
                </span>
              </Field>
              <Field id="ar-city" label="עיר" required>
                <input id="ar-city" name="city" required className={input} />
              </Field>

              <Field id="ar-type" label="סוג המסעדה" className="cmp:col-span-2">
                <span className="relative">
                  <select
                    id="ar-type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as KType | "")}
                    className={cn(input, "cursor-pointer appearance-none pe-10", !type && "text-[#757575]")}
                  >
                    <option value="" disabled>
                      בחירת סוג
                    </option>
                    {TYPES.map((t) => (
                      <option key={t} className="text-ink">
                        {t}
                      </option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 text-sm">
                    ▾
                  </span>
                </span>
              </Field>

              <Field id="ar-cert" label="גוף הכשרות / תעודה">
                <input id="ar-cert" name="certificate" placeholder="לדוגמה: ועד רבני אירופה" className={input} />
              </Field>
              <Field id="ar-addr" label="כתובת או קישור למפה">
                <input id="ar-addr" name="address" className={input} />
              </Field>

              <div className="my-1 border-t-[1.5px] border-dashed border-ink/25 cmp:col-span-2" />

              <Field id="ar-contact" label="שם הפונה" required>
                <input id="ar-contact" name="contact" required autoComplete="name" className={input} />
              </Field>
              <Field id="ar-phone" label="טלפון / וואטסאפ" required>
                <input id="ar-phone" name="phone" type="tel" required autoComplete="tel" dir="ltr" className={cn(input, "text-right")} />
              </Field>
              <Field id="ar-notes" label="הערות" className="cmp:col-span-2">
                <textarea id="ar-notes" name="notes" rows={4} className={cn(input, "h-auto resize-y py-4 leading-[1.5]")} />
              </Field>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 cmp:col-span-2">
                <p className="m-0 max-w-[300px] text-[13px] leading-[1.5] text-muted">הפרטים ישמשו רק לבדיקת הבקשה ולחזרה אליכם.</p>
                <button type="submit" className="inline-flex h-14 cursor-pointer items-center gap-2.5 rounded-full border-none bg-accent px-[30px] text-base font-bold text-white hover:bg-accent-hover">
                  שליחת הבקשה <span aria-hidden="true">←</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
