import { Header, MobileActionBar } from "@/components/kasher/Header";
import { Hero } from "@/components/kasher/Hero";
import { World } from "@/components/kasher/World";
import { Scan } from "@/components/kasher/Scan";
import { Restaurants } from "@/components/kasher/Restaurants";
import { QA } from "@/components/kasher/QA";
import { About } from "@/components/kasher/About";
import { Footer } from "@/components/kasher/Footer";
import { useKasherMotion } from "@/hooks/use-kasher-motion";

const Index = () => {
  useKasherMotion();
  return (
    <div dir="rtl" lang="he" className="relative min-h-[100dvh] overflow-x-clip bg-paper font-body text-ink">
      <Header />
      <main id="main">
        <Hero />
        <World />
        <Scan />
        <Restaurants />
        <QA />
        <About />
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
};

export default Index;
