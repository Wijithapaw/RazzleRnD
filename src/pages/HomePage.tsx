import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import PricingMatrix from "../components/PricingMatrix";
import { clearServerLoadedData, getInitialData } from "../utils/ssr-helper.utils";

function loadDummyPricingMatrixData() {
  const sampleData = [
    {
      dateRange: "5",
      meals_2: 20,
      meals_3: 28,
      meals_4: 34,
      meals_5: 39,
      meals_6: 43,
    },
    {
      dateRange: "10",
      meals_2: 19,
      meals_3: 27,
      meals_4: 33,
      meals_5: 38,
      meals_6: 42,
    },
  ];

  return Promise.resolve(sampleData);
}


function loadDummyPricingMatrixData2() {
  const sampleData = [
    {
      dateRange: "20",
      meals_2: 20,
      meals_3: 28,
      meals_4: 34,
      meals_5: 39,
      meals_6: 43,
    },
    {
      dateRange: "30",
      meals_2: 19,
      meals_3: 27,
      meals_4: 33,
      meals_5: 38,
      meals_6: 42,
    },
    {
      dateRange: "40",
      meals_2: 19,
      meals_3: 27,
      meals_4: 33,
      meals_5: 38,
      meals_6: 42,
    },
  ];

  return Promise.resolve(sampleData);
}

export const loadHomePagePricingMatrixInitialData = () => {
  return loadDummyPricingMatrixData();
};

const HomePage = () => {
  const location = useLocation();
  var [pricingMatrix, setPricingMatrix] = useState<any[]>(
    getInitialData(location.pathname) || []
  );

  useEffect(() => {
    setTimeout(() => {
      loadDummyPricingMatrixData2().then((data) => {
        setPricingMatrix(data);
        clearServerLoadedData(location.pathname);
      });
    }, 2000);
  }, []);

  return (
    <div>
      This is home page 4 <PricingMatrix data={pricingMatrix} />
    </div>
  );
};

export default HomePage;
