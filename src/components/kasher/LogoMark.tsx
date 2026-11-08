import { cn } from "@/lib/utils";

/** Double-kaf symbol drawn in the Manhattan letter style: a dark כ with a smaller blue כ inside it. */
export function LogoMark({ className, inner = "fill-blue" }: { className?: string; inner?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={cn("flex-none", className)}>
      <path d="M9 4H41V34.5C41 40 37.5 44 32 44H9V36H31.6C32.6 36 33 35.5 33 34.4V12H9Z" fill="currentColor" />
      <path d="M14 15.5H29.5V27C29.5 30.3 27.6 32.5 24.4 32.5H14V26.5H22.8C23.3 26.5 23.5 26.2 23.5 25.6V21.5H14Z" className={inner} />
    </svg>
  );
}
