import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Dropdown,
  FloatingLabel,
} from "react-bootstrap";

import { useRouter, Router } from "next/router";
import axios from "../../helper/axios";
import React, { useEffect, useState, useCallback, state } from "react";

function admin_vendor_list() {
  let [vendorDelete, setVendotDelete] = useState();
  let [vendorDeleteedres, setVendotDeleteedres] = useState();
  const router = useRouter();
  const [vendorList, setVendorList] = useState();
  //   const checkShop = require("../server/middleware/checkShop");
  //   console.log(checkShop);
  useEffect(async () => {
    await axios
      .get(`/api/vendorlistdata?shop=${router.query.shop}`)
      .then((res) => {
        setVendorList(res.data);
        //console.log(res.data.info.shop_owner);
      });
  }, []);
  const handleVendorDeleteClick = async (email) => {
    console.log("handleVendorDeleteClick", email);
    setVendotDelete(email);

    vendordel(email);
  };

  const vendordel = useCallback(async (email) => {
    const res = await axios
      .post(`/api/vendordelete?shop=${router.query.shop}&email=${email}`)
      .then((res) => {
        //console.log("vendordelete-->", res.status);
        setVendotDeleteedres(res.status);
        if (res.status == "200") {
          alert("Vendor deleted");
          window.location.reload(false);
        }
      });
  });

  return (
    <>
      <div>
        <h1>Vendor list</h1>
      </div>
      <div className="col-md-12">
        <div className="card-1 ">
          <div className="tab">
            <div>
              <table id="products" className="table">
                <thead className="thead">
                  <tr>
                    <th>Vendor Name</th>
                    <th>Vendor Email</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorList?.map((item) => (
                    <>
                      <tr>
                        <td>{item.vendor_name}</td>
                        <td>{item.email}</td>
                        <td>
                          <button
                            className="delete-button"
                            onClick={() => handleVendorDeleteClick(item.email)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="30"
                              height="30"
                              fill="currentColor"
                              className="bi bi-trash"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                              <path
                                fillRule="evenodd"
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default admin_vendor_list;
