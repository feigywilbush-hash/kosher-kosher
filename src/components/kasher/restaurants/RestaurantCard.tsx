import type { Restaurant } from "@/data/restaurants";
import { RestaurantImage } from "./RestaurantImage";
import { TypeTag } from "./tags";

export function RestaurantCard({ r, onOpen }: { r: Restaurant; onOpen: (r: Restaurant, el: HTMLElement) => void }) {
  return (
    <article className="group flex flex-col rounded-[24px] bg-paper p-2.5 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(12,23,51,.45)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
        <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]">
          <RestaurantImage r={r} />
        </div>
        {r.authority === "vaad" && (
          <span className="absolute right-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-normal text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            בפיקוח פעיל
          </span>
        )}
        {r.status === "בבדיקה" && (
          <span className="absolute left-3 top-3 inline-flex h-7 items-center rounded-full bg-accent px-3 text-xs font-bold text-white">בבדיקה</span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-2 pt-5">
        <div className="text-[13px] text-muted">
          {r.country} · {r.city}
        </div>
        <h3 className="mb-0 mt-2 font-body text-[22px] font-bold leading-[1.25] [text-wrap:balance]">{r.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="flex items-center gap-2">
            <TypeTag type={r.type} />
            {r.level === "מהדרין" && <span className="text-sm font-bold">מהדרין</span>}
          </span>
          <button
            type="button"
            onClick={(e) => onOpen(r, e.currentTarget)}
            aria-label={`פרטים נוספים על ${r.name}`}
            className="inline-flex flex-none cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-[15px] font-normal text-ink transition-colors duration-[250ms] hover:text-blue [&>span]:transition-transform [&>span]:duration-300 hover:[&>span]:-translate-x-1"
          >
            פרטים נוספים <span aria-hidden="true">←</span>
          </button>
        </div>
      </div>
    </article>
  );
}
