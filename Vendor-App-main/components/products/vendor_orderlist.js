import React, { useEffect, useState, useCallback, state } from "react";
import { useRouter, Router } from "next/router";
import axios from "../../helper/axios";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { setTimeout } from "timers";

export default function Vendor_orderlist() {
    const [orders, setOrders] = useState();
    const [fulfillmentOrders, setFulfillmentOrders] = useState();
    const vendor_name_local = window.localStorage.getItem("vendor_name");
    //  console.log("prod",orders)
    const router = useRouter();

    //let orderId = "hello";
    const [orderId, setOrderID] = useState(0);
    const [lineitemId, setLineItemID] = useState(0);
    const [inventoryitemId, setInventoryItemID] = useState(0);
    const [variantId, setVariantID] = useState(0);
    const [fuorderLocation, setFuorderLocation] = useState(0);
    const [fulfillmentQuantity, setFulfillmentQuantity] = useState(0);

    useEffect(() => {
        axios
            .get(`/api/vendororders?shop=${router.query.shop}`)
            .then((res) => setOrders(res.data.orders));
    }, []);

    const [show, setShow] = useState(false);
    const [fullscreen, setFullscreen] = useState(true);

    const handleClick = async (orderid, product_id, line_item_id, variant_id) => {

        await axios
            .get(
                `/api/vendorordersfulfilment?shop=${router.query.shop}&orderId=${orderid}`
            )
            .then((res) => {
                res.data.fulfillment_orders[0].line_items;
                console.log(res.data.fulfillment_orders[0].line_items);
                let fuorder = res.data.fulfillment_orders[0].line_items;

                setFuorderLocation(
                    res.data.fulfillment_orders[0].assigned_location["location_id"]
                );

                //console.log(fuorderlocation);
                fuorder.map((cell, i) => {
                    if (fuorder[i].line_item_id == product_id) {
                        setInventoryItemID(fuorder[i].inventory_item_id);
                        setOrderID(fuorder[i].fulfillment_order_id);
                        setLineItemID(fuorder[i].id);
                        setVariantID(fuorder[i].variant_id);
                        setFulfillmentQuantity(fuorder[i].fulfillable_quantity);
                    }
                });
            });
        setShow(true);
    };

    const [ordermessage, setOrderMessage] = useState("");
    const [shippingnumber, setShippingNumber] = useState("");
    const [trackingurl, setTrackingUrl] = useState("");
    const [shippingcompany, setShippingCompany] = useState("");
    // const [fulfillmentQuantity, setFulfillmentQuantity] = useState("");

    const handleChangeOrderMessage = useCallback((event) => {
        setOrderMessage(event.target.value);
    });
    const handleChangeShippingNumber = useCallback((event) => {
        setShippingNumber(event.target.value);
    });
    const handleChangeTackingUrl = useCallback((event) => {
        setTrackingUrl(event.target.value);
    });
    const handleChangeShippingCompany = useCallback((event) => {
        setShippingCompany(event.target.value);
    });

    const vorder = {
        fulfillment: {
            message: ordermessage,
            notify_customer: true,
            location_id: fuorderLocation,
            service: "manual",
            tracking_info: {
                number: shippingnumber,
                url: trackingurl,
                company: shippingcompany,
            },
            line_items_by_fulfillment_order: [
                {
                    fulfillment_order_id: orderId,
                    fulfillment_order_line_items: [
                        {
                            id: lineitemId,
                            quantity: fulfillmentQuantity,
                        },
                    ],
                },
            ],
        },
    };
    //console.log(vorder);
    const vendorFulfillment = useCallback(async () => {
        const res = await axios.post("/api/vendorfulfulment", vorder);
        console.log("prod-->", res.status);
        if (res.status == 200) {
            setShow(false);

            setTimeout(function () {
                alert("An Email has been sent to customer regarding shipping details");
            }, 1000);
        }
        //let sucessstatus = res.data.status
    });

    const handlevSubmit = useCallback((e) => {
        vendorFulfillment();
    });

    return (
        <div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>order fuflilment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <button
                            onClick={() => handlevSubmit()}
                            style={{
                                textAlign: "center",
                                width: "100px",
                                border: "1px solid gray",
                                borderRadius: "5px",
                            }}
                        >
                            Send data to backend
                        </button>
                        <>
                            <FloatingLabel
                                controlId="vendor-order-msg"
                                label="Product fulfillment message"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="Your order has been shipped"
                                    onChange={handleChangeOrderMessage}
                                />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="vendor-order-shipping-number"
                                label="Product shipping number"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="shipping number"
                                    onChange={handleChangeShippingNumber}
                                />
                            </FloatingLabel>

                            <FloatingLabel
                                controlId="vendor-order-url"
                                label="tracking url"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="Enter order tracking url"
                                    onChange={handleChangeTackingUrl}
                                />
                            </FloatingLabel>

                            <FloatingLabel
                                controlId="vendor-order-shipping-company"
                                label="Shipping Company"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="Name of the shipping company"
                                    onChange={handleChangeShippingCompany}
                                />
                            </FloatingLabel>
                        </>
                    </div>
                </Modal.Body>
            </Modal>
            ;
            <div>
                <h1>Vendor Order list</h1>
            </div>
            <div className="col-md-12">
                <div className="card-1 ">
                    <div className="tab">
                        <div>
                            <table id="products" className="table">
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
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders?.map((item) => (
                                        <>
                                            {item.line_items.map((element) =>
                                                // {
                                                //    if (element.vendor == "lalit") {
                                                element.vendor == vendor_name_local ? (
                                                    <tr>
                                                        <td className="">{item.id}</td>
                                                        <td>{item.order_number}</td>
                                                        <td className="">{item.created_at}</td>
                                                        <td className="">{item.financial_status}</td>
                                                        <td>{element.name}</td>
                                                        <td>{element.vendor}</td>
                                                        <td>{item.current_total_price}</td>
                                                        <td>{element.fulfillment_status}</td>
                                                        <td>
                                                            <Dropdown>
                                                                <Dropdown.Toggle
                                                                    id="dropdown-button-dark-example1"
                                                                    variant="secondary"
                                                                >
                                                                    Edit Status
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu variant="dark">
                                                                    <>
                                                                        {element.fulfillment_status !=
                                                                            "fulfilled" ? (
                                                                            <Dropdown.Item
                                                                                eventKey="Fulfill"
                                                                                onClick={() =>
                                                                                    handleClick(
                                                                                        item.id,
                                                                                        element.id,
                                                                                        element.product_id,
                                                                                        element.variant_id,
                                                                                        element.inventory_item_id
                                                                                    )
                                                                                }
                                                                            >
                                                                                Fulfill Item
                                                                            </Dropdown.Item>
                                                                        ) : null}
                                                                    </>
                                                                    <Dropdown.Item eventKey="Cancel">
                                                                        Cancel Item
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                ) : null
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
