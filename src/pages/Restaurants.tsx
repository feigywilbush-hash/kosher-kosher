import { SiteShell } from "@/components/kasher/SiteShell";
import { Directory } from "@/components/kasher/restaurants/Directory";
import { AddRestaurant } from "@/components/kasher/restaurants/AddRestaurant";
import { useKasherMotion } from "@/hooks/use-kasher-motion";

const RestaurantsPage = () => {
  useKasherMotion();
  return (
    <SiteShell>
      <Directory />
      <AddRestaurant />
    </SiteShell>
  );
};

export default RestaurantsPage;
