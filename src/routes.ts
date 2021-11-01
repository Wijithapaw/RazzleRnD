import AboutPage from "./pages/AboutPage";
import HomePage, {
  loadHomePagePricingMatrixInitialData,
} from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import PricingPage, { loadPricingMatrixInitialData } from "./pages/PricingPage";

const routes = [
  {
    path: "/",
    component: HomePage,
    name: "Home",
    exact: true,
    initialData: loadHomePagePricingMatrixInitialData,
  },
  {
    path: "/about",
    component: AboutPage,
    name: "About",
    exact: true,
  },
  {
    path: "/orders",
    component: OrdersPage,
    name: "Orders",
    exact: true,
  },
  {
    path: "/pricing",
    component: PricingPage,
    name: "Pricing",
    exact: true,
    initialData: loadPricingMatrixInitialData,
  },
];

export default routes;

export const commonRoutes = [
  {
    path: "/login",
    component: LoginPage,
    name: "Login",
    exact: true,
  },
];
