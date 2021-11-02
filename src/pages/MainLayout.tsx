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
import CityPicker from "../components/CityPicker";
import NavUser from "../components/NavUser";
import routes from "../routes";
import { cookieStorageService } from "../services/cookie-storage.service";
import NotFoundPage from "./NotFoundPage";

interface Props {
  initialData?: any[];
}

const MainLayout = ({ initialData }: Props) => {
  const [selectedCity, setSelectedCity] = useState<string>(
    cookieStorageService.getItem("TENANT")
  );

  const { tenantId } = useParams<any>();
  const location = useLocation();
  const history = useHistory();

  // useEffect(() => {
  //   console.log("Main Laylout tId: " + tenantId);
  //   if (tenantId) {
  //     const isValidTenant = cities.some(
  //       (c) => c.code.toLowerCase() === tenantId.toLowerCase()
  //     );
  //     if (isValidTenant) {
  //       console.log("valid tenant");
  //       if (selectedCity?.toLowerCase() !== tenantId.toLowerCase()) {
  //         setSelectedCity(tenantId.toUpperCase());
  //       }
  //     } else {
  //       console.log("invalid tenant code or missing tenant code");
  //       var path = location.pathname;
  //       const defaultTenantId = cities[0].code.toLowerCase();
  //       //history.push(`/${defaultTenantId}${path}`);
  //       //window.location.reload();
  //       window.location.replace(`/${defaultTenantId}${path}`);
  //     }
  //   } else {
  //     console.log("No tenant code in url");
  //     const defaultTenantId = cities[0].code.toLowerCase();
  //     //history.push(`${defaultTenantId}`);
  //     //window.location.reload();
  //     window.location.replace(`/${defaultTenantId}`);
  //   }
  // }, [tenantId]);

  const handleCityChange = (city: string, path: string) => {
    console.log("city changed");
    window.location.replace(`/${city.toLowerCase()}${path}`);
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
            {routes.map((r) => {
              const Element = r.component;
              return (
                <Route key={r.name} path={r.path} exact={r.exact}>
                  <Element />
                </Route>
              );
            })}
            <Route path="/" component={() => <NotFoundPage />} />
          </Switch>
        </div>
      </div>
    </AppRouter>
  );
};

export default MainLayout;
