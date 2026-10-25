import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: string; count: number };

/** Pill button that opens a list of options with counts (the directory's country / kashrut filters). */
export function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
  outlined = false,
}: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  className?: string;
  /** Visible border while idle, for use on white backgrounds. */
  outlined?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = options.find((o) => o.value === value) ?? options[0];
  const active = value !== options[0].value;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          "flex h-14 w-full cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-full border-[1.5px] px-5 text-[15px] font-normal transition-[border-color,background,color] duration-[250ms]",
          active ? "border-ink bg-ink text-white" : "border-transparent bg-white text-ink hover:border-ink/30",
          outlined && !active && !open && "border-ink/[.18]",
          open && !active && "border-blue",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className={active ? "text-white/70" : "text-muted"}>{label}</span>
          <span className="truncate">{current.label}</span>
        </span>
        <ChevronDown size={18} strokeWidth={2} aria-hidden="true" className={cn("flex-none transition-transform duration-300", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          id={listId}
          data-lenis-prevent
          className="absolute right-0 top-[calc(100%+8px)] z-20 m-0 min-w-full list-none rounded-[20px] bg-white p-1.5 shadow-[0_24px_50px_-18px_rgba(12,23,51,.4)] ring-1 ring-ink/[.06]"
        >
          {options.map((o) => {
            const on = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-11 w-full cursor-pointer items-center justify-between gap-6 whitespace-nowrap rounded-[14px] border-none px-3.5 text-right text-[15px] font-normal transition-[background] duration-200",
                    on ? "bg-paper text-ink" : "bg-transparent text-ink hover:bg-paper",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Check size={16} strokeWidth={2.2} aria-hidden="true" className={cn("text-blue", !on && "invisible")} />
                    {o.label}
                  </span>
                  <span className="font-mono text-xs text-muted">{o.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
