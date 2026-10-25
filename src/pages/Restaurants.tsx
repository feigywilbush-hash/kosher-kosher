import { SiteShell } from "@/components/kasher/SiteShell";
import { Directory } from "@/components/kasher/restaurants/Directory";
import { AddRestaurant } from "@/components/kasher/restaurants/AddRestaurant";
import { useKasherMotion } from "@/hooks/use-kasher-motion";

const RestaurantsPage = () => {
  useKasherMotion();
  return (
    <SiteShell>
      {/* On phones the whole page sits on white instead of tinted boxes. */}
      <div className="flow-root bg-white pb-8 cmp:bg-transparent cmp:pb-0">
        <Directory />
        <AddRestaurant />
      </div>
    </SiteShell>
  );
};

export default RestaurantsPage;
