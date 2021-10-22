import React, { useEffect, useState } from "react";
import { orderService } from "../services/order.service";

const OrderList = () => {
  var [orders, setOrders] = useState<any[]>();

  useEffect(() => {
    orderService
      .getLatest10Orders()
      .then((orders: any) => {
        setOrders(orders.items);
        console.log(orders);
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
