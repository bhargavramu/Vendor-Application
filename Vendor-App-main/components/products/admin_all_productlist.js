import React, { useEffect, useState, useCallback, state } from "react";
import { useRouter, Router } from "next/router";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../../helper/axios";
export default function allProductlist() {
  const [Show, setShow] = useState(false);
  const [products, setProducts] = useState();

  const router = useRouter();

  useEffect(() => {
    const getData = () => {
      axios.get(`/api/all_productlist?shop=${router.query.shop}`).then(
        (
          res // setProducts(res.data.products)
        ) => {
          const products = res.data.products;
          setProducts(res.data.products);
        }
      );
    };
    getData();
  }, []);
  const [vendorList, setVendorList] = useState();
  useEffect(async () => {
    await axios
      .get(`/api/vendorlistdata?shop=${router.query.shop}`)
      .then((res) => {
        setVendorList(res.data);
        //console.log(res.data.info.shop_owner);
      });
  }, []);

  // const getInitialState = () => {
  //   const value = "";
  //   return value;
  // };

  // const [value, setValue] = useState(getInitialState);

  // const handleabcChange = (e) => {
  //   setValue(e.target.value);
  //   console.log(e.target.value);
  // };
  const [optionVendor, setOptionVendor] = useState();

  function handlevendorChange(event) {
    setOptionVendor(event.target.value);
  }
  //console.log(optionVendor);

  const [optionStatus, setOptionStatus] = useState();

  function handlestatusChange(event) {
    setOptionStatus(event.target.value);
  }
  //console.log(optionStatus);
  const [product, setProduct] = useState({});
  const [productId, setProductId] = useState({});
  const handleClick = (product_id, product) => {
    setProductId(product_id);
    setProduct(product);
    setShow(true);
  };
  // const handleChange = (event) => {
  //   setProduct({ ...product, [event.target.name]: event.target.value });
  // };
  //   const getData = () => {
  //     axios.get(`/api/vendor_productlist?shop=${router.query.shop}`).then(
  //       (
  //         res // setProducts(res.data.products)
  //       ) => {
  //         const products = res.data.products;
  //         setProducts(res.data.products);
  //       }
  //     );
  //   };
  const getData = {
    product: {
      id: productId,
      status: optionStatus,
      vendor: optionVendor,
    },
  };
  const handleSubmit = async () => {
    const req = await axios
      .put(`/api/updateproduct?shop=${router.query.shop}`, getData)
      .then((req) => setShow(false));
    window.location.reload();
  };
  // console.log("producttitle", product);
  let [prodDelete, setProdDelete] = useState();

  const handleDeleteClick = async (product_id) => {
    console.log("handleDeleteClick", product_id);
    setProdDelete(product_id);
    //console.log("checkset", setProdDelete(product_id));

    vendorproddel(product_id);
  };

  const vendorproddel = useCallback(async (product_id) => {
    const res = axios.post(
      `/api/vendorproductdelete?shop=${router.query.shop}&productId=${product_id}`
    );
    console.log("proddelete-->", res);
  });

  return (
    <>
      <div className="table-in-card">
        <h1> All The Products List</h1>
        <div>
          <div className="col-md-12">
            <div className="card-1">
              <div className="tab">
                <div>
                  <table id="products" className="table">
                    <thead className="thead">
                      <tr>
                        <th>Product Handle</th>
                        <th>Title</th>
                        <th>Vendor</th>
                        <th>Price</th>
                        <th>Product_type</th>
                        <th>Product Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.map((item) => (
                        <tr>
                          <td className="">{item.handle} </td>
                          <td className="">{item.title} </td>
                          <td className="">{item.vendor}</td>
                          <td>{item.amount}</td>
                          <td>{item.product_type}</td>
                          <td>{item.status}</td>
                          <td>
                            <div className="product-td-svg">
                              <button
                                className="edit-button"
                                onClick={() => handleClick(item.id, item)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="30"
                                  height="30"
                                  fill="currentColor"
                                  className="bi bi-pencil-square"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                  />
                                </svg>
                              </button>
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteClick(item.id)}
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
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {Show && product && (
        <Modal
          size="lg"
          show={Show}
          onHide={() => setShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Assign Vendor
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-12">
                <div>
                  <div className="line-grid">
                    <label>Assign vendor</label>

                    <select name="option" onChange={handlevendorChange}>
                      <option value={product.vendor}>{product.vendor}</option>
                      {vendorList?.map((item, index) => (
                        <>
                          <option value={item.vendor_name}>
                            {item.vendor_name}
                          </option>
                        </>
                      ))}
                    </select>
                  </div>
                  <div className="line-grid">
                    <label>Aprove Product</label>
                    <select name="option" onChange={handlestatusChange}>
                      <option value={product.status}>{product.status}</option>
                      if({product.status}=="draft")
                      {<option value="active">Active</option>}else
                      {<option value="draft">Draft</option>}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Button onClick={handleSubmit}>Save</Button>
        </Modal>
      )}
    </>
  );
}
