import React, { useEffect, useState, useCallback } from 'react';
import Card from 'react-bootstrap/Card';
import { useRouter, Router } from 'next/router';
import { saveToStorage } from '../../helper/helper';
import "./index.css";
export default function Password_reset(props) {


    // const [email, setemail] = useState("");
    // const [password, setpassword] = useState("");
    // const router = useRouter()

    // const handleSubmit = useCallback((e) => {

    // },)
    // const handleChangeEmail = useCallback((event) => {
    //     setemail(event.target.value);
    // }, []);

    // const handleChangePassword = useCallback((event) => {
    //     setpassword(event.target.value);
    // }, []);
    return (
        <>
            <div className='signin-page'>
                <Card className='card'>
                    <div className='form-1'>
                        <h1 className="fw-normal">Reset Password</h1>

                        {/* <form onSubmit={handleSubmit} >
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

                        </form > */}
                    </div>
                </Card>
            </div>
        </>
    )
}
