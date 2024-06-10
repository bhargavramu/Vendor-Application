import Nav from 'react-bootstrap/Nav';
import React, { useState, useEffect, } from "react";
import { Tabs, Tab, Col, Form, Button, Modal, } from "react-bootstrap";
import Vendor_product_list from '../components/products/vendor_product_list';
import Vendor_orderlist from "../components/products/vendor_orderlist";
import './index.css';
import { useRouter, Router } from 'next/router';
import axios from "../helper/axios";

function Vendor_dashboard() {
    const router = useRouter()
    const vendor_name_local = window.localStorage.getItem("vendor_name");

    const [totalOrdersCount, setTotalOrdersCount] = useState();
    const [unfulfilledOrdersCount, setUnfulfilledOrdersCount] = useState();
    const [totalProductsCount, setTotalProductsCount] = useState();
    const [activeProductsCount, setActiveProductsCount] = useState();
    const [draftProductsCount, setDraftProductsCount] = useState();

    useEffect(() => {
        axios
            .get(`/api/vendororderscount?shop=${router.query.shop}`)
            .then((res) => setTotalOrdersCount(res.data.count));
    }, []);
    useEffect(() => {
        axios
            .get(`/api/vendorunfulfilledorderscount?shop=${router.query.shop}`)
            .then((res) => setUnfulfilledOrdersCount(res.data.count));
    }, []);

    useEffect(() => {
        axios
            .get(`/api/vendorproductscount?shop=${router.query.shop}`)
            .then((res) => setTotalProductsCount(res.data.count));
    }, []);
    useEffect(() => {
        axios
            .get(`/api/vendorproductsactivecount?shop=${router.query.shop}`)
            .then((res) => setActiveProductsCount(res.data.count));
    }, []);
    useEffect(() => {
        axios
            .get(`/api/vendorproductspendingcount?shop=${router.query.shop}`)
            .then((res) => setDraftProductsCount(res.data.count));
    }, []);

    return (
        <>
            <div className="create-Home-content">
                <div className="main-header">
                    <h4>MULTIVENDOR<br />MARKET PLACE</h4>
                    <ul className="pull-right">
                        <li>
                            <div className="btn-group dropleft dropdown-avatar head-profil-d-flex">
                                <div className="head-profil-name-div"> <span>Hellow </span><br /><span>{vendor_name_local}</span></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="row b-gutter">
                    <div className="col-12 col-md-12 ">
                        <div className="header  ">
                            <Tabs
                                defaultActiveKey="Dashboard"
                                id="uncontrolled-tab"
                                className="tab-nav">
                                <Tab
                                    eventKey="Dashboard"
                                    title="Dashboard"
                                    className="temp-tab pop-head-style">
                                    <h3>Dashboard</h3>
                                    <div className='row padd-all'>
                                        <div className='col-md-12'>
                                            <h2>All Counts of vendor details</h2>
                                            <div className='row'>
                                                <div className='col-md-3'>
                                                    <div className='card-dashboard'>
                                                        <h1>Total Products</h1>
                                                        <div className='count'>{totalProductsCount}</div>
                                                    </div>
                                                </div>
                                                <div className='col-md-3'>
                                                    <div className='card-dashboard'>
                                                        <h1>Product Aproved</h1>
                                                        <div className='count'>{activeProductsCount}</div>
                                                    </div>
                                                </div>
                                                <div className='col-md-3'>
                                                    <div className='card-dashboard'>
                                                        <h1>Product Aproval Pending</h1>
                                                        <div className='count'>{draftProductsCount}</div>
                                                    </div>
                                                </div>
                                                <div className='col-md-3'>
                                                    <div className='card-dashboard'>
                                                        <h1>Total Orders</h1>
                                                        <div className='count'>{totalOrdersCount}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab
                                    eventKey="Products"
                                    title="Products"
                                    href='#Product'
                                    className="temp-tab"  >
                                    <div className="header-pro header-main-d-flex">
                                        <div className='d-flex'>
                                            <div className="header-title-div">
                                                <h4>All Products</h4>
                                                <p>Here are the current products on your store </p>
                                            </div>
                                            <div className='add-prodcut-button'>
                                                <Button variant="primary" onClick={() => router.push(`/create_product?shop=${router.query.shop}`)} className="add-product-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                    </svg>
                                                    ADD PRODUCT
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='search-padd'>
                                                <div className="search-div">
                                                    <ul className="search-flex">
                                                        <li>
                                                            <div className="search">
                                                                <span className="fa fa-search"></span>
                                                                <input placeholder="Search term" />
                                                            </div>
                                                        </li>
                                                        <li><div className="btn-group dropleft">
                                                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                Products vendor <i className="fa fa-angle-down"></i>
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li><a href="#">Edit Profile</a></li>
                                                                <li><a href="#">View Activity</a></li>
                                                                <li><a href="#">Manage Roles</a></li>
                                                            </ul>
                                                        </div></li>
                                                        <li><div className="btn-group dropleft">
                                                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                Status <i className="fa fa-angle-down"></i>
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li><a href="#">Edit Profile</a></li>
                                                                <li><a href="#">View Activity</a></li>
                                                                <li><a href="#">Manage Roles</a></li>
                                                            </ul>
                                                        </div></li>
                                                        <li><div className="btn-group dropleft">
                                                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                FILTERS<i className="fa fa-angle-down"></i>
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li><a href="#">Edit Profile</a></li>
                                                                <li><a href="#">View Activity</a></li>
                                                                <li><a href="#">Manage Roles</a></li>
                                                            </ul>
                                                        </div></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className='vendor-product'>
                                                <Vendor_product_list />
                                            </div>
                                        </div>

                                    </div>
                                </Tab>
                                <Tab
                                    eventKey="orders"
                                    title="Orders"
                                    href='#Orders'
                                    className="temp-tab"  >
                                    <h3>Orders</h3>
                                    <Vendor_orderlist />
                                </Tab>
                                <button
                                    eventKey="profile"
                                    title="Profile"
                                    className="temp-tab"  >
                                    <h3>Profile</h3>
                                </button>
                            </Tabs>
                            <div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

        </>

    );
}

export default Vendor_dashboard;


// import React from "react";
// import Paper from "@material-ui/core/Paper";
// import Tab from "@material-ui/core/Tab";
// import Tabs from "@material-ui/core/Tabs";

// const App = () => {
//     const [value, setValue] = React.useState(2);

//     return (
//         <div>
//             <h2>How to Create Tabs in ReactJS?</h2>
//             <Paper square>
//                 <Tabs
//                     value={value}
//                     textColor="primary"
//                     indicatorColor="primary"
//                     onChange={(event, newValue) => {
//                         setValue(newValue);
//                     }}
//                 >
//                     <Tab label="Active TAB One" />
//                     <Tab label="Active TAB Two" />
//                     <Tab label="Disabled TAB!" disabled />
//                     <Tab label="Active Tab Three" />
//                 </Tabs>
//                 <h3>TAB NO: {value} clicked!</h3>
//             </Paper>
//         </div>
//     );
// };

// export default App;
