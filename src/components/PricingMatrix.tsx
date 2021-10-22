import React, { useEffect, useState } from "react";
import { orderService } from "../services/order.service";

const PricingMatrix = () => {
  var [pricingMatrix, setPricingMatrix] = useState<any[]>();

  useEffect(() => {
    orderService
      .getPricingMatrix()
      .then((values: any) => {
        setPricingMatrix(values);
        console.log(values);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <table>
      <tbody>
        <tr>
          <th>Date Rage</th>
          <th>2 Meals</th>
          <th>3 Meals</th>
        </tr>
        {pricingMatrix &&
          pricingMatrix.map((m) => (
            <tr key={"id_" + m.dateRange}>
              <td>{m.dateRange}</td>
              <td>{m.meals_2}</td>
              <td>{m.meals_3}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default PricingMatrix;
