import { Hero } from "@/components/kasher/Hero";
import { World } from "@/components/kasher/World";
import { Scan } from "@/components/kasher/Scan";
import { Restaurants } from "@/components/kasher/Restaurants";
import { QA } from "@/components/kasher/QA";
import { About } from "@/components/kasher/About";
import { SiteShell } from "@/components/kasher/SiteShell";
import { useKasherMotion } from "@/hooks/use-kasher-motion";

const Index = () => {
  useKasherMotion();
  return (
    <SiteShell>
      <Hero />
      <World />
      <Scan />
      <Restaurants />
      <QA />
      <About />
    </SiteShell>
  );
};

export default Index;
