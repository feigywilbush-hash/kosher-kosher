import type { ReactNode } from "react";
import { Header, MobileActionBar } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" lang="he" className="relative min-h-[100dvh] overflow-x-clip bg-paper font-body text-ink">
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}
