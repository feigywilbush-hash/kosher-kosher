import { cn } from "@/lib/utils";
import type { KType } from "../data";
import { TYPE_C, TYPE_DOT } from "../data";
import type { Authority } from "@/data/restaurants";

export const AUTHORITY_LABEL: Record<Authority, string> = {
  vaad: "כשרות ועד רבני אירופה",
  recommended: "בהמלצת ועד רבני אירופה",
};

export function TypeTag({ type, className }: { type: KType; className?: string }) {
  return (
    <span className={cn("inline-flex h-8 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-sm font-bold", TYPE_C[type].bg, TYPE_C[type].fg, className)}>
      <span className={cn("h-[7px] w-[7px] rounded-full", TYPE_DOT[type])} />
      {type}
    </span>
  );
}
