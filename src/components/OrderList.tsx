import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { orderService } from "../services/order.service";
import { getInitialData } from "../utils/ssr-helper.utils";

export const loadOrdersInitialData = () => {
  return orderService
    .getLatest10Orders()
    .then((orders: any) => {
      //console.log("server orders", orders);

      return orders.items;
    })
    .catch((err) => {
      //console.log(err);
      return [];
    });
};

const OrderList = () => {
  const location = useLocation();
  var [orders, setOrders] = useState<any[]>(getInitialData(location.pathname));

  useEffect(() => {
    orderService
      .getLatest10Orders()
      .then((orders: any) => {
        setOrders(orders.items);
        //console.log(orders);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <table>
      <tbody>
        <tr>
          <th>Order No</th>
          <th>Customer</th>
          <th>Goal</th>
        </tr>
        {orders &&
          orders.map((o) => (
            <tr key={o.id}>
              <td>{o.orderNo}</td>
              <td>{o.customerName}</td>
              <td>{o.goal}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default OrderList;
