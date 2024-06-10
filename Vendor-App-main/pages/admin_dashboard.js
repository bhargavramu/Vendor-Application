
import { Tabs, Tab, Col, Form, Button, Modal } from "react-bootstrap";
import axios from "../helper/axios";
import React, { useEffect, useState, useCallback, state } from "react";
import "./index.css";
import Vendor_List from "../components/admin_component/vendor_list";
import All_Order_Status from "../components/admin_component/all_order_status";
import Admin_All_ProductList from "../components/products/admin_all_productlist";
import { useRouter, Router } from "next/router";

function Admin_dashboard() {
    const router = useRouter();
    const [adminShopDetails, setAdminShopDetails] = useState();
    //   const checkShop = require("../server/middleware/checkShop");
    //   console.log(checkShop);
    useEffect(async () => {
        await axios.get(`/api/checkShop?shop=${router.query.shop}`).then((res) => {
            setAdminShopDetails(res.data.info.shop_owner);
            //console.log(res.data.info.shop_owner);
        });
    }, []);
    return (
        <>
            <div className="create-Home-content">
                <div class="main-header">
                    <h4>
                        MULTIVENDOR
                        <br />
                        MARKET PLACE
                    </h4>
                    <ul class="pull-right">
                        <li>
                            <div class="btn-group dropleft dropdown-avatar head-profil-d-flex">
                                <div class="head-profil-name-div">
                                    <span>
                                        <h3>Hello {adminShopDetails}</h3>{" "}
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="row b-gutter">
                    <div className="col-12 col-md-12 ">
                        <div className="header  ">
                            <Tabs
                                defaultActiveKey="Dashboard"
                                href=""
                                id="uncontrolled-tab"
                                className="tab-nav"
                            >
                                {/* //---------------------------------------------------------------------------- */}
                                <Tab
                                    eventKey="Dashboard"
                                    title="Dashboard"
                                    className="temp-tab pop-head-style"
                                >
                                    <div className="vendor-product">
                                        {/* <Vendor_dash_data /> */}
                                    </div>
                                </Tab>
                                {/* //---------------------------------------------------------------------------- */}
                                <Tab
                                    eventKey="Products"
                                    title="Products"
                                    href="#Product"
                                    className="temp-tab"
                                >
                                    <div class="header-pro header-main-d-flex">
                                        <div className="d-flex">
                                            <div class="header-title-div">
                                                <h4>All Products</h4>
                                                <p>Here are the current products on your store </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="search-padd">
                                                <div class="search-div">
                                                    <ul class="search-flex">
                                                        <li>
                                                            <div class="search">
                                                                <span class="fa fa-search"></span>
                                                                <input placeholder="Search term" />
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="btn-group dropleft">
                                                                <button
                                                                    type="button"
                                                                    class="btn btn-default dropdown-toggle"
                                                                    data-toggle="dropdown"
                                                                    aria-haspopup="true"
                                                                    aria-expanded="false"
                                                                >
                                                                    Products admin{" "}
                                                                    <i class="fa fa-angle-down"></i>
                                                                </button>
                                                                <ul class="dropdown-menu">
                                                                    <li>
                                                                        <a href="#">Edit Profile</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">View Activity</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">Manage Roles</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="btn-group dropleft">
                                                                <button
                                                                    type="button"
                                                                    class="btn btn-default dropdown-toggle"
                                                                    data-toggle="dropdown"
                                                                    aria-haspopup="true"
                                                                    aria-expanded="false"
                                                                >
                                                                    Status <i class="fa fa-angle-down"></i>
                                                                </button>
                                                                <ul class="dropdown-menu">
                                                                    <li>
                                                                        <a href="#">Edit Profile</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">View Activity</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">Manage Roles</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="btn-group dropleft">
                                                                <button
                                                                    type="button"
                                                                    class="btn btn-default dropdown-toggle"
                                                                    data-toggle="dropdown"
                                                                    aria-haspopup="true"
                                                                    aria-expanded="false"
                                                                >
                                                                    FILTERS<i class="fa fa-angle-down"></i>
                                                                </button>
                                                                <ul class="dropdown-menu">
                                                                    <li>
                                                                        <a href="#">Edit Profile</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">View Activity</a>
                                                                    </li>
                                                                    <li>
                                                                        <a href="#">Manage Roles</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="vendor-product">
                                                <Admin_All_ProductList />
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab
                                    eventKey="orders"
                                    title="Orders"
                                    href="#Orders"
                                    className="temp-tab"
                                >
                                    <All_Order_Status />
                                </Tab>
                                <Tab
                                    eventKey="vendor-list"
                                    title="Vendor List"
                                    className="temp-tab"
                                >
                                    <Vendor_List />
                                </Tab>
                                <Tab
                                    eventKey="Vendor login"
                                    title="Vendor login"
                                    className="temp-tab"
                                    onClick={() => router.push(`/vendor_login?shop=${router.query.shop}`)}
                                >
                                    Vendor Login
                                </Tab>
                            </Tabs>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin_dashboard;