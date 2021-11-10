import { loadOrdersInitialData } from "./components/OrderList";
import loadable from '@loadable/component';
// import AboutPage from "./pages/AboutPage";
import {
  loadHomePagePricingMatrixInitialData,
} from "./pages/HomePage";
 import LoginPage from "./pages/LoginPage";
// import OrdersPage from "./pages/OrdersPage";
// import NotFoundPage from "./pages/NotFoundPage";
import { loadPricingMatrixInitialData } from "./pages/PricingPage";

const HomePage1 = loadable(() => import('./pages/HomePage'));
const AboutPage1 = loadable(() => import('./pages/AboutPage'));
const LoginPage1 = loadable(() => import('./pages/LoginPage'));
const OrdersPage1 = loadable(() => import('./pages/OrdersPage'));
const PricingPage1 = loadable(() => import('./pages/PricingPage'));
const NotFoundPage1 = loadable(() => import('./pages/NotFoundPage'));

const routes = [
  {
    path: "/",
    component: HomePage1,
    name: "Home",
    exact: true,
    initialData: loadHomePagePricingMatrixInitialData,
  },
  {
    path: "/about",
    component: AboutPage1,
    name: "About",
    exact: true,
  },
  {
    path: "/orders",
    component: OrdersPage1,
    name: "Orders",
    exact: true,
    initialData: loadOrdersInitialData,
  },
  {
    path: "/pricing",
    component: PricingPage1,
    name: "Pricing",
    exact: true,
    initialData: loadPricingMatrixInitialData,
  },
  {
    path: "/not-found",
    component: NotFoundPage1,
    name: "Not Found",
    exact: true,
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
