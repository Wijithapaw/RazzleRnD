import React, { useEffect, useState } from "react";
import { orderService } from "../services/order.service";

interface Props {
  data: any[];
}

const PricingMatrix = ({ data }: Props) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>Date Rage</th>
          <th>2 Meals</th>
          <th>3 Meals</th>
        </tr>
        {(data).map((m) => (
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
