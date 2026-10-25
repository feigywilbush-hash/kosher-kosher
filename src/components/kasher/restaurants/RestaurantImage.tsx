import { cn } from "@/lib/utils";
import type { Restaurant } from "@/data/restaurants";
import { MAP_POS, asset } from "../data";

const ZOOM = 3.4; // map width as a multiple of the frame width
const DOTS = `url(${asset("images/world-dots.svg")})`;

/**
 * The restaurant's photo, or, until one is uploaded, a branded card:
 * the dotted world map centred on the restaurant's country with a pin.
 */
export function RestaurantImage({ r, className }: { r: Restaurant; className?: string }) {
  if (r.img) {
    return <img src={asset(r.img)} alt={r.name} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
  }
  const [px, py] = MAP_POS[r.countryCode] ?? [50, 40];
  return (
    <div role="img" aria-label={`${r.name}, ${r.city}`} className={cn("relative h-full w-full overflow-hidden bg-ink", className)}>
      <div aria-hidden="true" className="absolute" style={{ width: `${ZOOM * 100}%`, aspectRatio: "1800 / 690", left: "50%", top: "50%", transform: `translate(-${px}%, -${py}%)` }}>
        {/* Translating by the pin's own map percentages puts the country at the frame centre at any aspect ratio. */}
        <div className="absolute inset-0 bg-sky opacity-50" style={{ WebkitMaskImage: DOTS, maskImage: DOTS, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(12,23,51,0)_0,rgba(12,23,51,.55)_75%)]" />
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 -ml-[60px] -mt-[60px] h-[120px] w-[120px] rounded-full border-[1.5px] border-dashed border-sky/30" />
      <span aria-hidden="true" className="kk-pin absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-accent shadow-[0_0_0_3px_rgba(12,23,51,.9)]" />
      <span aria-hidden="true" className="absolute bottom-3.5 right-4 font-display text-[22px] leading-none text-white">{r.city}</span>
      <span aria-hidden="true" className="absolute bottom-4 left-4 font-mono text-xs font-bold tracking-[.14em] text-sky">{r.countryCode}</span>
    </div>
  );
}
