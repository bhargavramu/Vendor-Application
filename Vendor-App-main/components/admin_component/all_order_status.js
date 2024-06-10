import React, { useEffect, useState, useCallback, state } from "react";
import { useRouter, Router } from "next/router";
import axios from "../../helper/axios";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { setTimeout } from "timers";

export default function admin_orderlist() {
  const [orders, setOrders] = useState();

  //  console.log("prod",orders)
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`/api/allorders?shop=${router.query.shop}`)
      .then((res) => setOrders(res.data.orders));
  }, []);

  return (
    <div className="col-md-12">
      <div className="card-1 ">
        <div className="tab">
          <div>
            <table id="orders" className="table">
              <thead className="thead">
                <tr>
                  <th>Order Id</th>
                  <th>order_number</th>
                  <th>Creaction date</th>
                  <th>order_status</th>
                  <th>Name</th>
                  <th>Vendor</th>
                  <th>price</th>
                  <th>fulfillment_status</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {orders?.map((item) => (
                  <>
                    <tr>
                      <td className="">{item.id}</td>
                      <td>{item.order_number}</td>
                      {item.line_items.map((element) => (
                        <tr>
                          <td className="">{item.created_at.split("T")[0]}</td>
                          <td className="">{item.financial_status}</td>
                          <td>{element.name}</td>
                          <td>{element.vendor}</td>
                          <td>{item.current_total_price}</td>
                          {/* <td>{element.fulfillment_status}</td> */}
                          <td>
                            <>
                              {element.fulfillment_status != "fulfilled" ? (
                                <p>unfulfilled</p>
                              ) : (
                                <p>fulfilled</p>
                              )}
                            </>
                          </td>
                        </tr>
                      ))}
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
