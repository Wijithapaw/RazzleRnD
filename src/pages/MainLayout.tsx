import React, { useEffect, useState } from "react";
import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  useParams,
  useLocation,
  useHistory,
  Redirect,
} from "react-router-dom";
import AppRouter from "../components/AppRouter";
import CityPicker, { cities } from "../components/CityPicker";
import NavUser from "../components/NavUser";
import AboutPage from "./AboutPage";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import PricingPage from "./PricingPage";
import OrdersPage from "./OrdersPage";

const MainLayout = () => {
  const [selectedCity, setSelectedCity] = useState<string>();

  const { tenantId } = useParams<any>();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    console.log("Main Laylout tId: " + tenantId);
    if (tenantId) {
      const isValidTenant = cities.some(
        (c) => c.code.toLowerCase() === tenantId.toLowerCase()
      );
      if (isValidTenant) {
        console.log("valid tenant");
        if (selectedCity?.toLowerCase() !== tenantId.toLowerCase()) {
          setSelectedCity(tenantId.toUpperCase());
        }
      } else {
        console.log("invalid tenant code or missing tenant code");
        var path = location.pathname;
        const defaultTenantId = cities[0].code.toLowerCase();
        history.push(`/${defaultTenantId}${path}`);
        window.location.reload();
      }
    } else {
      console.log("No tenant code in url");
      const defaultTenantId = cities[0].code.toLowerCase();
      history.push(`${defaultTenantId}`);
      window.location.reload();
    }
  }, [tenantId]);

  const handleCityChange = (city: string, path: string) => {
    history.push(`/${city.toLowerCase()}${path}`);
    window.location.reload();
  };

  return (
    <AppRouter basename={`/${tenantId}`}>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "50px",
            flexDirection: "row",
            background: "lightgray",
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/orders">Orders</Link>
          <div>
            <CityPicker
              onChange={handleCityChange}
              selectedCity={selectedCity}
            />
          </div>
          <div>
            <NavUser />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
          }}
        >
          <Switch>
            <Route path="/about">
              <AboutPage />
            </Route>
            <Route path="/pricing">
              <PricingPage />
            </Route>
            <Route path="/orders">
              <OrdersPage />
            </Route>
            <Route path="/not-found">
              <NotFoundPage />
            </Route>
            <Route path="/" exact>
              <HomePage />
            </Route>
            <Redirect
              to={{
                pathname: "/not-found",
              }}
            />
          </Switch>
        </div>
      </div>
    </AppRouter>
  );
};

export default MainLayout;
