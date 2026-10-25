import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import RestaurantsPage from "./pages/Restaurants";
import { ScrollManager } from "./components/kasher/ScrollManager";
import { useSmoothScroll } from "./hooks/use-smooth-scroll";

const App = () => {
  useSmoothScroll();
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ScrollManager />
      <Routes>
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
