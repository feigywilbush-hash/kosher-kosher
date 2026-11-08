import { cn } from "@/lib/utils";

/** Shield symbol: a single-line shield with a blue dot inside. */
export function LogoMark({ className, inner = "fill-blue" }: { className?: string; inner?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" strokeLinecap="round" strokeLinejoin="round" className={cn("flex-none", className)}>
      <path d="M24 4.5L40 10v12c0 11-7 18.5-16 21.5C15 40.5 8 33 8 22V10Z" stroke="currentColor" strokeWidth="3.4" />
      <circle cx="24" cy="22.5" r="5" className={inner} />
    </svg>
  );
}
