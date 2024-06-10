import React, { useEffect, useState, useCallback } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from '../helper/axios';
import './index.css';
import { useRouter, Router } from 'next/router';
import { getFromStorage } from '../helper/helper';

export default function Example() {
    const vendor_name_local = window.localStorage.getItem("vendor_name");
    const router = useRouter()

    const [title, setTitle] = useState("");
    const [body_html, setBody_html] = useState("");
    const [vendor, setVendor] = useState("");
    const [productImg, setProductImg] = useState("");
    const [product_type, setProduct_type] = useState("");
    const [tags, setTags] = useState([]);

    const handleChangeTitle = useCallback((event) => {
        setTitle(event.target.value);
    });

    const handleProductImageUpload = (e) => {
        const file = e.target.files[0];
        console.log("fffffffffffff", file)
        setProductImg(file)
        // TransformFileData(file);
    };

    const handleChangeBody_html = useCallback((event) => {
        setBody_html(event.target.value);
        // console.log(imageURLs[0]);
    });

    const handleChangeVendor = useCallback((event) => {
        setVendor(event.target.value);
    });

    const handleChangeProduct_type = useCallback((event) => {
        setProduct_type(event.target.value);
    });

    const handleChangeTags = useCallback((event) => {
        setTags(event.target.value);
    });

    const [allPlayers, setAllPlayers] = useState([
        {
            option1: "",
            option2: "",
            option3: "",
            price: null,
            sku: null,
        },
    ]);
    const [allOptions, setAllOptions] = useState([
        {
            name: "",
        },
    ]);

    const handleAddPlayers = () => {
        const values = [...allPlayers];
        values.push({
            option1: "",
            option2: "",
            option3: "",
            price: null,
            sku: null,
        });
        setAllPlayers(values);
    };
    const handleAddOptions = () => {
        if (allOptions.length < 3) {
            const values = [...allOptions];
            values.push({
                name: "",
            });
            setAllOptions(values);
        }
    };

    const handleRemovePlayers = (index) => {
        const values = [...allPlayers];
        values.splice(index, 1);
        setAllPlayers(values);
    };

    const handleRemoveOptions = (index) => {
        const values = [...allOptions];
        values.splice(index, 1);
        setAllOptions(values);
    };

    const handleInputChange = (index, event) => {
        const values = [...allPlayers];
        const updatedValue = event.target.name;
        values[index][updatedValue] = event.target.value;

        setAllPlayers(values);
    };

    //console.log(allPlayers);

    const handleOptionChange = (index, event) => {
        const values = [...allOptions];

        const updatedValue = event.target.name;
        // console.log(updatedValue);
        values[index][updatedValue] = event.target.value;

        setAllOptions(values);
    };
    // console.log(allOptions);


    // const product = {
    //     product: {
    //         title: title,
    //         body_html: body_html,
    //         vendor: vendor_name_local,
    //         product_type: product_type,
    //         // "published": "false",
    //         status: "draft",
    //         // images: [
    //         //   {
    //         //     attachment: imageURLs[0],
    //         //     filename: "rails_logo.gif",
    //         //   },
    //         // ],
    //         // image: {
    //         //     src: productImg,
    //         // },
    //         variants: allPlayers,
    //         options: allOptions,

    //         tags: tags,
    //         // inventory_quantity: "7"


    //     },
    // };
    // let formData = new FormData();    //formdata object

    // formData.append('image1', productImg);   //append the values with key, value pair
    // formData.append('product', product);
    // console.log("image1", image1)
    // var img =
    //     JSON.stringify({
    //         image: {
    //             attachment: productImg,
    //             filename: "KD_20-1.jpg"
    //         }
    //     })
    // console.log("img-->", img)

    const products = useCallback(async () => {
        const product = {
            product: {
                title: title,
                body_html: body_html,
                vendor: vendor_name_local,
                product_type: product_type,
                status: "draft",
                variants: allPlayers,
                options: allOptions,
                tags: tags,
            },
        };
        console.log("productproduct", product)
        let formData = new FormData();    //formdata object

        formData.append('image1', productImg);   //append the values with key, value pair
        formData.append('title', title);
        formData.append('body_html', body_html);
        formData.append('vendor', vendor_name_local);
        formData.append('product_type', product_type);
        formData.append('status', "draft");
        formData.append('variants', JSON.stringify(allPlayers));
        formData.append('options', JSON.stringify(allOptions));
        formData.append('tags', tags);
        // console.log("formData", formData)
        await axios.post("/api/createproducts", formData,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    shopname: getFromStorage("shopname"),
                    email: getFromStorage("email"),
                    vendor_name: getFromStorage("vendor_name")
                }

            }).then((res) => {
                console.log("prod-->", res);//res.data.product.id
                if (res.status == 200) {
                    const imgData = axios.post(`https://bhargav123456.myshopify.com/admin/api/2022-10/products/${res.data.product.id}.json`,
                        {
                            "images": {
                                "product_id": res.data.product.id,
                                "attachment": "R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\n",
                                "filename": "testing.png"
                            }
                        })

                }
            });


    });

    const handleSubmit = useCallback((e) => {
        products();

        // window.history.back();
    });


    return (
        <>
            <div id="product" className="">
                <div className='main-header'>
                    <h4>MULTIVENDOR<br />MARKET PLACE</h4>
                    <ul className="pull-right">
                        <li>
                            <div className="btn-group dropleft dropdown-avatar head-profil-d-flex">
                                <div className="head-profil-name-div"> <span>Hellow </span><br /><span>{vendor_name_local}</span></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="content-product">
                    <div className="row">
                        <div className="col-8 col-md-offset-1">
                            <div className="add-product-div">
                                <div className="pd-add-product-btn">
                                    <span>
                                        <a href="#">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
                                                <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1z" />
                                            </svg>
                                        </a>
                                    </span>
                                    <span className='add-prd-title '>Add Product</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=' row product-below-div'>
                <div className='col-md-5 col-md-offset-1 list-fields'>
                    <div className='prd-text-box'>
                        <div className=' prd-inpt-title'>
                            <h4>Title</h4>
                            <input type="title" placeholder="Product Title" onChange={handleChangeTitle} />
                        </div>
                        <div className=' prd-inpt-title'>
                            <h4>Description</h4>
                            <input type="textarea" className='text-area' onChange={handleChangeBody_html} />
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='prd-text-box'>
                        <div className=' prd-inpt-title'>
                            <h4 className="prd-box-title">Product Status</h4>
                            <input type="text" placeholder="Product Status as a Draft" />
                            <p>This product will be available to 1 sale channel</p>
                        </div>
                    </div>
                    <div className='prd-text-box m-top-20'>
                        <div className='prd-inpt-title'>
                            <h4 className='prd-box-title'>Media</h4>
                            <form className="form-container" encType='multipart/form-data'>
                                <div className="upload-files-container">
                                    <div className="drag-file-area">
                                        <label className="label">
                                            <span className="browse-files">
                                                <input type="file" className="default-file-input" onChange={handleProductImageUpload} src={productImg} />
                                                <span className="browse-files-text">Add file</span>
                                                <span>Add from URL</span>
                                            </span>
                                        </label>
                                        <h4 className="dynamic-message"> Accepts images, videos, or 3D models</h4>
                                    </div>
                                    <span className="cannot-upload-message"> <span className="material-icons-outlined">error</span> Please select a file first <span className="material-icons-outlined cancel-alert-button">cancel</span> </span>
                                    <div className="file-block">
                                        <div className="file-info"> <span className="material-icons-outlined file-icon">description</span> <span className="file-name"> </span> | <span className="file-size">  </span> </div>
                                        <span className="material-icons remove-file-icon">delete</span>
                                        <div className="progress-bar"> </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
            <div className='row product-below-div'>
                <div className='col-md-5 col-md-offset-1 '>
                    <div className=' below-div'>
                        <div className='prd-text-box'>
                            <h4 className='prd-box-title'>Pricing</h4>
                            <div className=" prd-inpt-title">
                                <h4>Price</h4>
                                <input type="text" name="" placeholder="$ 0.00" />
                            </div>
                            <div className="prd-inpt-title">
                                <h4>Compare at price</h4>
                                <input type="text" placeholder="$ 0.00" />
                            </div>
                            <div className="checkbox" id="check">
                                <label>
                                    <input type="checkbox" /> Charge tax on this product
                                </label>
                            </div>
                            <hr />
                            <div className=" prd-inpt-title">
                                <h4>Cost per item</h4>
                                <input type="text" name="" placeholder="$ 0.00" />
                                <p>Customers won't see this</p>
                            </div>
                        </div>
                    </div>
                    <div className='below-div'>
                        <div className='prd-text-box'>
                            <div className="prd-inpt-title">
                                <h4>Options</h4>
                                <label className='dis-rtl'>
                                    <p>This product has options, like size or color</p>

                                    <button className="browse-files-text option-button" onClick={() => handleAddOptions()}>Add Option</button>
                                </label>
                                <div>
                                    {allOptions.length > 0 && (
                                        <>
                                            {allOptions.map((field, index) => (
                                                <div>
                                                    <div className="mb-3 dis-flex" controlId="formBasicEmail">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            placeholder="Enter Option Name"
                                                            value={field.name}
                                                            onChange={(event) => handleOptionChange(index, event)}
                                                        />
                                                        <button className='delete-button' onClick={() => handleRemoveOptions(index)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16" >
                                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                            </svg>
                                                        </button>
                                                    </div>


                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='below-div'>
                        <div className='prd-text-box'>
                            <div className="prd-inpt-title">
                                <h4>Variant</h4>
                                <label className='dis-rtl'>
                                    <p>You can add your variants here</p>
                                    <button className="browse-files-text option-button" onClick={() => handleAddPlayers()}>Add Variant</button>
                                </label>
                                <div>
                                    {allPlayers.length > 0 && allOptions.length > 0 && (
                                        <>
                                            {allPlayers.map((field, index) => (
                                                <div className=''>
                                                    <div className="add-player-div">
                                                        <div className='dis-rtl'>
                                                            <h4>Variant {index + 1}</h4>
                                                            <button className='delete-button' onClick={() => handleRemovePlayers(index)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16" >
                                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div className="mb-3" controlId="formBasicEmail">

                                                            <input
                                                                type="text"
                                                                name="option1"
                                                                placeholder="Enter Option 1 Name"
                                                                value={field.option1}
                                                                onChange={(event) =>
                                                                    handleInputChange(index, event)
                                                                }
                                                            />

                                                        </div>

                                                        {allOptions.length > 1 ? (
                                                            <div
                                                                className="mb-3"
                                                                controlId="formBasicEmail"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    name="option2"
                                                                    placeholder="Enter Optopn 2 Value"
                                                                    value={field.option2}
                                                                    onChange={(event) =>
                                                                        handleInputChange(index, event)
                                                                    }
                                                                />
                                                            </div>
                                                        ) : null}
                                                        {allOptions.length > 2 ? (
                                                            <div
                                                                className="mb-3"
                                                                controlId="formBasicEmail"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    name="option3"
                                                                    placeholder="Enter Option 3 Value"
                                                                    value={field.option3}
                                                                    onChange={(event) =>
                                                                        handleInputChange(index, event)
                                                                    }
                                                                />
                                                            </div>
                                                        ) : null}

                                                        <div className="mb-3" controlId="formBasicEmail">
                                                            <input
                                                                type="number"
                                                                name="price"
                                                                placeholder="Enter Price"
                                                                value={field.price}
                                                                onChange={(event) =>
                                                                    handleInputChange(index, event)
                                                                }
                                                            />
                                                        </div>
                                                        <div className="mb-3" controlId="formBasicEmail">
                                                            <input
                                                                type="number"
                                                                name="sku"
                                                                placeholder="Sku"
                                                                value={field.sku}
                                                                onChange={(event) =>
                                                                    handleInputChange(index, event)
                                                                }
                                                            />

                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 ">
                    <div className="prd-text-box">
                        <div className="prd-inpt-title">
                            <h4>Product organization</h4>
                            <div className="inner-prd-bg">
                                <div className=" prd-inpt-title">
                                    <h4>Product Category</h4>
                                    <input type="text" name="" placeholder="search product category" />
                                    {/* <p>Helps you manage products, and determines US tax rates and/or exemptions for product and its variants. Learn more about product category and taxes.</p> */}
                                </div>
                                <div className=" prd-inpt-title">
                                    <h4>Product Type</h4>
                                    <input type="text" name="" placeholder="e.g, T-Shirt" onChange={handleChangeProduct_type} />
                                </div>
                                <div className=" prd-inpt-title">
                                    <h4>Vendor</h4>
                                    <input type="text" name="" placeholder="" />
                                </div>
                                <div className=" prd-inpt-title">
                                    <h4>Collections</h4>
                                    <input type="text" name="" placeholder="" />
                                </div>
                                <div className=" prd-inpt-title">
                                    <h4>Tags</h4>
                                    <input type="text" name="" placeholder="Find or create tags" onChange={handleChangeTags} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='save-button'>
                    <button onClick={() => handleSubmit()} >
                        Save
                    </button>
                </div>
            </div>


            {/*  Send data to backend =save */}

        </>
    );
}

