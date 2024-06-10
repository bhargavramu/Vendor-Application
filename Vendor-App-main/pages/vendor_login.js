import React, { useEffect, useState, useCallback } from 'react';
import Card from 'react-bootstrap/Card';
import { useRouter, Router } from 'next/router';
import { saveToStorage } from '../helper/helper';
import axios from '../helper/axios'
import './index.css';

export default function Home(props) {
    let [authMode, setAuthMode] = useState("signin")
    const changeAuthMode = () => {
        // setAuthMode(authMode === "signup" ? "signin" : "signup")
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }
    const router = useRouter()
    const queryParameters = new URLSearchParams(window.location.search);
    const [vendor_name, setVendor_name] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const vendorshop = queryParameters.get("shop");

    const triggerAPI = useCallback(async () => {
        // Use async await instead of chained promise
        const res = await axios.post("/api/register", { vendor_name, email, password, vendorshop, });
        // console.log(res);
        if (res.status == 200) {
            saveToStorage("shopname", router.query.shop);
            saveToStorage("vendor_name", users.vendor_name);
            // router.push(`/Homepage?shop=${router.query.shop}`)
        }
    }, [vendor_name, email, password, vendorshop]);

    const handleSubmit = useCallback((e) => {
        window.location.reload()
        e.preventDefault()
        triggerAPI();
    }, [triggerAPI])

    const handleLogin = e => {
        e.preventDefault();
        axios.post(`/api/login`, { email, password }).then(res => {
            console.log("loginnnnnnn", res)
            if (res.data.length !== 0) {
                saveToStorage("shopname", router.query.shop)
                //saveToStorage("email", res.data.email)
                saveToStorage("vendor_name", res.data.vendor_name)
                // JSON.stringify(res.data.vendor_name)
                // console.log("vendornameeeee", JSON.stringify(res.data.vendor_name))
                router.push(`/Vendor_dashboard?shop=${router.query.shop}`)
                alert("Your Successfully Logged in !")
            } else (alert("Not able to login."))

        })
    }

    const handleChangeName = useCallback((event) => {
        setVendor_name(event.target.value);
    }, []);

    const handleChangeEmail = useCallback((event) => {
        setemail(event.target.value);
    }, []);

    const handleChangePassword = useCallback((event) => {
        setpassword(event.target.value);
    }, []);

    if (authMode === "signin") {
        return (
            <>
                <div className='signin-page'>
                    <Card className='card'>
                        <div className='form-1'>
                            <h1 className="fw-normal">Sign In</h1>

                            <form className='form-outline' onSubmit={handleLogin} >
                                <div className="form-outline mb-4">
                                    <input type="email" id="form2Example11" className="form-control" name='email'
                                        placeholder="email address" onChange={handleChangeEmail} />

                                </div>
                                <div className="form-outline mb-4">
                                    <input type="password" id="form2Example22" className="form-control" name='password'
                                        placeholder="Enter Password" onChange={handleChangePassword} />

                                </div>
                                <div className='form-outline mb-4'>
                                    <button type="submit" className="form-control">Submit</button>
                                </div>
                                <div className="text-center font-medium">
                                    Not registered yet?{" "}
                                    <span className="link-primary" href="#!" onClick={changeAuthMode}>
                                        Register
                                    </span>
                                </div>
                                <div className="form-outline mb-4">
                                    <a className="text-muted" >Forgot Password ?</a>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            </>
        )
    }

    return (
        <>
            <div className='signin-page'>
                <Card className='card'>
                    <div className='form-1'>
                        <h1 className="fw-normal">Please Sign Up</h1>
                        {/* <div className="text-center font-medium">
                            Registered yet?{" "}
                            <span className="link-primary" href="#!" onClick={changeAuthMode}>
                                Sign In
                            </span>
                        </div> */}
                        <form onSubmit={handleSubmit}  >
                            <div className="form-outline mb-4">
                                <input type="text" id="form2name" className="form-control" name='Name'
                                    placeholder="Vendor Name" onChange={handleChangeName} />

                            </div>
                            <div className="form-outline mb-4">
                                <input type="email" id="form2Example11" className="form-control" name='email'
                                    placeholder="email address" onChange={handleChangeEmail} />

                            </div>
                            <div className="form-outline mb-4">
                                <input type="password" id="form2Example22" className="form-control" name='password'
                                    placeholder="Enter Password" onChange={handleChangePassword} />

                            </div>
                            <div className='form-outline mb-4'>
                                <input type='submit' value='Create New' className='form-control'  ></input>
                            </div>
                            <div className="text-center font-medium">
                                If Registered {" "}
                                <span className="link-primary" href="#!" onClick={changeAuthMode}>
                                    Login
                                </span>
                            </div>
                        </form >
                    </div>
                </Card>
            </div>
        </>
    )
}



