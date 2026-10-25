/** Resolves a file in public/ against the deploy base path. */
export const asset = (p: string) => import.meta.env.BASE_URL + p;

export type KType = "בשרי" | "חלבי" | "פרווה";

export const COUNTRIES = [
  { code: "CY", name: "קפריסין", cities: "לרנקה · לימסול · פאפוס" },
  { code: "GR", name: "יוון", cities: "אתונה · סלוניקי · רודוס" },
  { code: "GB", name: "בריטניה", cities: "לונדון · מנצ׳סטר" },
  { code: "TH", name: "תאילנד", cities: "בנגקוק · פוקט · קוסמוי" },
  { code: "HU", name: "הונגריה", cities: "בודפשט" },
  { code: "UA", name: "אוקראינה", cities: "קייב · אומן · אודסה" },
] as const;

export const TYPE_C: Record<KType, { bg: string; fg: string }> = {
  "בשרי": { bg: "bg-meat-bg", fg: "text-meat" },
  "חלבי": { bg: "bg-dairy-bg", fg: "text-blue" },
  "פרווה": { bg: "bg-parve-bg", fg: "text-navy" },
};
export const TYPE_DOT: Record<KType, string> = { "בשרי": "bg-meat", "חלבי": "bg-blue", "פרווה": "bg-navy" };

export const DISHES: Record<string, { dish: string; type: KType; src: string }> = {
  CY: { dish: "דניס על האש", type: "פרווה", src: asset("images/dish-cy.jpg") },
  GR: { dish: "סלט יווני", type: "חלבי", src: asset("images/dish-gr.jpg") },
  GB: { dish: "פיש אנד צ׳יפס", type: "פרווה", src: asset("images/dish-gb.jpg") },
  TH: { dish: "פאד תאי עוף", type: "בשרי", src: asset("images/dish-th.jpg") },
  HU: { dish: "גולאש בקר", type: "בשרי", src: asset("images/dish-hu.jpg") },
  UA: { dish: "וארניקי תפוחי אדמה", type: "פרווה", src: asset("images/dish-ua.jpg") },
};

export const PLACE_IMG: Record<string, string> = {
  CY: asset("images/place-cy.jpg"), GR: asset("images/place-gr.jpg"), GB: asset("images/place-gb.jpg"),
  TH: asset("images/place-th.jpg"), HU: asset("images/place-hu.jpg"), UA: asset("images/place-ua.jpg"),
};

/** Pin positions on world-dots.svg, in % of the 1800×690 map. */
export const MAP_POS: Record<string, [number, number]> = {
  CY: [59.28, 32.54], GR: [56.58, 30.43], GB: [49.58, 19.57],
  TH: [77.92, 48.04], HU: [55.28, 23.55], UA: [58.47, 21.45],
};
export const ISRAEL_POS: [number, number] = [59.72, 35.14];

export const RESTS: { name: string; city: string; type: KType; level: string; img: string }[] = [
  { name: "גפן ותאנה", city: "קפריסין", type: "בשרי", level: "מהדרין", img: asset("images/rest-1.jpg") },
  { name: "חלב וזית", city: "יוון", type: "חלבי", level: "מהדרין", img: asset("images/rest-2.jpg") },
  { name: "הטאבון של שמעון", city: "בריטניה", type: "בשרי", level: "כשר", img: asset("images/rest-3.jpg") },
  { name: "קפה פרחים", city: "הונגריה", type: "חלבי", level: "כשר", img: asset("images/rest-4.jpg") },
  { name: "סושי ים", city: "תאילנד", type: "פרווה", level: "מהדרין", img: asset("images/rest-5.jpg") },
  { name: "בית האש", city: "אוקראינה", type: "בשרי", level: "מהדרין", img: asset("images/rest-6.jpg") },
  { name: "פסטה נונה", city: "יוון", type: "חלבי", level: "כשר", img: asset("images/rest-7.jpg") },
  { name: "מאפיית הבוקר", city: "קפריסין", type: "פרווה", level: "מהדרין", img: asset("images/rest-8.jpg") },
];

export const QS = [
  { q: "איך יודעים אם תעודת הכשרות של מסעדה בתוקף?", a: "לכל תעודה שלנו יש מספר ותאריך תוקף. אפשר לחפש את המסעדה באתר ולראות את הסטטוס העדכני, או לבקש מהמסעדה להציג את התעודה המקורית." },
  { q: "מוצר מחו״ל בלי סימון בעברית. אפשר לסמוך?", a: "סרקו את הברקוד בבדיקת המוצר. אם הוא לא מופיע במאגר, שלחו צילום של התווית ורשימת הרכיבים ונבדוק עבורכם מול הגורם המשגיח." },
  { q: "אני בחו״ל. איפה מוצאים אוכל כשר?", a: "בלוח \"כשרות בעולם\" מופיעים היעדים שבהם פועלים מוסדות בהשגחה. לכל יעד יש פרטי קשר של הרב האחראי במקום." },
  { q: "איך עסק מצטרף להשגחה?", a: "ממלאים טופס פנייה, ונציג מחלקת הכשרות חוזר לתיאום ביקור ראשון: סקירת ספקים, מטבח ונהלי עבודה." },
  { q: "צריך לבדוק הכשר גם על ירקות ופירות?", a: "ברוב המקרים לא, אבל יש ירקות עלים שדורשים בדיקת חרקים. ברשימת המוצרים מסומן אילו מהם מגיעים בדוק." },
  { q: "מה ההבדל בין כשר למהדרין?", a: "מהדרין מחייב פיקוח צמוד יותר והקפדה על חומרות נוספות. על כל תעודה מופיעה רמת הכשרות, ואפשר לסנן לפיה בחיפוש." },
  { q: "איך שולחים שאלה לרב?", a: "כותבים את השאלה בתיבה כאן למטה או בוואטסאפ. התשובה נשלחת אישית, ושאלות נפוצות מתפרסמות כאן בעילום שם." },
];

export const NAV = [
  { label: "מוצרים כשרים", href: "#scan" },
  { label: "מסעדות כשרות", href: "#restaurants" },
  { label: "כשרות בעולם", href: "#world" },
  { label: "שאלות ותשובות", href: "#qa" },
  { label: "רשימת רבנים", href: "#about" },
  { label: "בית הדין", href: "#about" },
];

export const EASE_OUT = "cubic-bezier(.16,1,.3,1)";
export const EASE_IO = "cubic-bezier(.76,0,.24,1)";
