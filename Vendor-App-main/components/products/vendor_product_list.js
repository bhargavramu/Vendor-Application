import React, { useEffect, useState, useCallback, state } from 'react';
import { useRouter, Router } from 'next/router';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from '../../helper/axios';
export default function Productlist() {
    const [Show, setShow] = useState(false);
    const [products, setProducts] = useState();

    const [product, setProduct] = useState({});
    const router = useRouter()

    useEffect(() => {
        const getData = () => {
            axios.get(`/api/vendor_productlist?shop=${router.query.shop}`).then((res) =>  // setProducts(res.data.products)
            {
                const products = res.data.products;
                setProducts(res.data.products)
            },
            )
        }
        getData()
    }, []);

    const handleClick = (product) => {
        setProduct(product);

        setShow(true);
    };
    const handleChange = event => {
        setProduct({ ...product, [event.target.name]: event.target.value })
    }
    const getData = () => {
        axios.get(`/api/vendor_productlist?shop=${router.query.shop}`).then((res) =>  // setProducts(res.data.products)
        {
            const products = res.data.products;
            setProducts(res.data.products)
        },
        )
    }
    const handleSubmit = async () => {
        const req = await axios.put(`/api/updateproduct`, { product }).then((req) => setShow(false), getData())

        // window.location.reload()
    }
    // console.log("producttitle", product);
    let [prodDelete, setProdDelete] = useState();

    const handleDeleteClick = async (product_id) => {
        console.log("handleDeleteClick", product_id);
        setProdDelete(product_id);
        //console.log("checkset", setProdDelete(product_id));

        vendorproddel(product_id);
    };


    const vendorproddel = useCallback(async (product_id) => {
        const res = axios.post(`/api/vendorproductdelete?shop=${router.query.shop}&productId=${product_id}`);
        console.log("proddelete-->", res);
    });

    return (
        <>
            <div className='table-in-card'>
                <h1> All The Products List</h1>
                <div>
                    <div className='col-md-12'>
                        <div className='card-1'>
                            <div className='tab'>
                                <div>
                                    <table id="products" className='table'>
                                        <thead className='thead'>
                                            <tr><th >Product Handle</th><th >Title</th><th >Vendor</th><th>Price</th><th>Product_type</th><th>Product Status</th><th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products?.map((item) =>
                                                <tr>
                                                    <td className="">{item.handle} </td><td className="">{item.title} </td><td className="">{item.vendor}</td><td>{item.amount}</td><td>{item.product_type}</td><td>{item.status}</td><td>
                                                        <div className='product-td-svg' >
                                                            <button className='edit-button' onClick={() => handleClick(item)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                                </svg>
                                                            </button>
                                                            <button className='delete-button' onClick={() => handleDeleteClick(item.id)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16" >
                                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {Show && product && (
                <Modal size="xl" show={Show} onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-lg">
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            Update Product
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className=' row product-below-div'>
                            <div className='col-md-6 padd-10  list-fields'>
                                <div className='prd-text-box'>
                                    <div className=' prd-inpt-title'>
                                        <h4>Title</h4>
                                        <input type="text" name='title' value={product.title} onChange={handleChange} />
                                    </div>
                                    <div className=' prd-inpt-title'>
                                        <h4>Description</h4>
                                        <input type="textarea" className='text-area' name='body_html' value={product.body_html} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6 padd-10'>
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
                                                            <input type="file" className="default-file-input" />
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
                            <div className='col-md-6 padd-10'>
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

                                                <button className="browse-files-text option-button" >Add Option</button>
                                            </label>
                                            <div>

                                                <div>
                                                    <div className="mb-3 dis-flex" controlId="formBasicEmail">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            placeholder="Enter Option Name"
                                                        // value={field.name}

                                                        />
                                                        <button className='delete-button'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16" >
                                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                            </svg>
                                                        </button>
                                                    </div>


                                                </div>

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
                                                <button className="browse-files-text option-button" >Add Variant</button>
                                            </label>
                                            <div>

                                                <div className=''>
                                                    <div className="add-player-div">
                                                        <div className='dis-rtl'>
                                                            <h4>Variant </h4>
                                                            <button className='delete-button' >
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
                                                            // value={field.option1}
                                                            // onChange={(event) =>
                                                            //     handleInputChange(index, event)
                                                            // }
                                                            />

                                                        </div>


                                                        <div
                                                            className="mb-3"
                                                            controlId="formBasicEmail"
                                                        >
                                                            <input
                                                                type="text"
                                                                name="option2"
                                                                placeholder="Enter Optopn 2 Value"
                                                            // value={field.option2}
                                                            // onChange={(event) =>
                                                            //     handleInputChange(index, event)
                                                            // }
                                                            />
                                                        </div>


                                                        <div
                                                            className="mb-3"
                                                            controlId="formBasicEmail"
                                                        >
                                                            <input
                                                                type="text"
                                                                name="option3"
                                                                placeholder="Enter Option 3 Value"
                                                            // value={field.option3}
                                                            // onChange={(event) =>
                                                            //     handleInputChange(index, event)
                                                            // }
                                                            />
                                                        </div>

                                                        <div className="mb-3" controlId="formBasicEmail">
                                                            <input
                                                                type="number"
                                                                name="price"
                                                                placeholder="Enter Price"
                                                            // value={field.price}
                                                            // onChange={(event) =>
                                                            //     handleInputChange(index, event)
                                                            // }
                                                            />
                                                        </div>
                                                        <div className="mb-3" controlId="formBasicEmail">
                                                            <input
                                                                type="number"
                                                                name="sku"
                                                                placeholder="Sku"
                                                            // value={field.sku}
                                                            // onChange={(event) =>
                                                            //     handleInputChange(index, event)
                                                            // }
                                                            />

                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 padd-10 ">
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
                                                <input type="text" name='product_type' pvalue={product.product_type} onChange={handleChange} />
                                            </div>
                                            <div className=" prd-inpt-title">
                                                <h4>Vendor</h4>
                                                <input type="text" name='vendor' value={product.vendor} />
                                            </div>
                                            <div className=" prd-inpt-title">
                                                <h4>Collections</h4>
                                                <input type="text" name='collection' value={product.collection} onChange={handleChange} />
                                            </div>
                                            <div className=" prd-inpt-title">
                                                <h4>Tags</h4>
                                                <input type="text" name='tags' value={product.tags} onChange={handleChange} />
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
                        {/* <div className='row'>
                            <div className='col-md-6'>
                                <div >
                                    <div className='line-grid'>
                                        <label>Title </label>
                                        <input type="text" name='title' className="input-title" value={product.title} onChange={handleChange} />
                                    </div>
                                    <div className='line-grid'>
                                        <label> Description</label>
                                        <input type="text" name='body_html' className="input-title" value={product.body_html} onChange={handleChange} />
                                    </div>
                                    <div className='line-grid'>
                                        <label> Product Type</label>
                                        <input type="text" name='product_type' className="input-title" value={product.product_type} onChange={handleChange} />
                                    </div>
                                    <div className='line-grid'>
                                        <label>collection </label>
                                        <input type="text" name='collection' className="input-title" value={product.collection} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div >
                                    <div className='line-grid'>
                                        <label>Tags</label>
                                        <input type="text" name='tags' className="input-title" value={product.tags} onChange={handleChange} />
                                    </div>
                                    <div className='line-grid'>
                                        <label>Variants</label>
                                        <input type="text" name='variants' className="input-title" value={product.variants} onChange={handleChange} />
                                    </div>
                                    <div className='line-grid'>
                                        <label>vendor</label>
                                        <input type="text" name='vendor' className="input-title" value={product.vendor} />
                                    </div>
                                    <div className='line-grid'>
                                        <label>Status</label>
                                        <input type="text" name='status' value={product.status} />
                                    </div>
                                </div>
                            </div>
                        </div> */}

                    </Modal.Body>


                </Modal>
            )}
        </>
    )
}
