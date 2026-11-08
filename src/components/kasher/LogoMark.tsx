import { cn } from "@/lib/utils";

/** Double-kaf symbol: a dark כ with a smaller blue כ inside it. */
export function LogoMark({ className, inner = "stroke-blue" }: { className?: string; inner?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" strokeLinecap="round" strokeLinejoin="round" className={cn("flex-none", className)}>
      <path d="M9 7h18a13 13 0 0 1 13 13v8a13 13 0 0 1-13 13H9" stroke="currentColor" strokeWidth="4" />
      <path d="M15 16h11a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5H15" className={inner} strokeWidth="4" />
    </svg>
  );
}
