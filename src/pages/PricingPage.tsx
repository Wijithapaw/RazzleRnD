import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import PricingMatrix from "../components/PricingMatrix";
import { orderService } from "../services/order.service";
import { clearServerLoadedData, getInitialData } from "../utils/ssr-helper.utils";

export const loadPricingMatrixInitialData = () => {
  return orderService.getPricingMatrix().then((values: any) => {
    return values;
  });
};

const PricingPage = () => {
  const location = useLocation();
  const [pricingMatrix, setPricingMatrix] = useState<any[]>(
    getInitialData(location.pathname) || []
  );

  useEffect(() => {
    setTimeout(() => {
      orderService
        .getPricingMatrix()
        .then((values: any) => {
          setPricingMatrix(values);
          console.log("Client side loading", values);
          clearServerLoadedData(location.pathname);
        })
        .catch((err) => console.log(err));
    }, 2000);
  }, []);

  return (
    <div>
      This is pricing page <PricingMatrix data={pricingMatrix} />
    </div>
  );
};

export default PricingPage;
