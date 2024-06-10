import React, { useEffect, useState, useCallback } from 'react';
import Card from 'react-bootstrap/Card';
import { useRouter, Router } from 'next/router';
import { saveToStorage } from '../helper/helper';
import "./index.css";

export default function Forget_Password(props) {

    const [input, setInput] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const onInputChange = e => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
        validateInput(e);
    }

    const validateInput = e => {
        let { name, value } = e.target;
        setError(prev => {
            const stateObj = { ...prev, [name]: "" };

            switch (name) {
                case "email":
                    if (!value) {
                        stateObj[name] = "Please enter email.";
                    }
                    break;

                case "password":
                    if (!value) {
                        stateObj[name] = "Please enter Password.";
                    } else if (input.confirmPassword && value !== input.confirmPassword) {
                        stateObj["confirmPassword"] = "Password and Confirm Password does not match.";
                    } else {
                        stateObj["confirmPassword"] = input.confirmPassword ? "" : error.confirmPassword;
                    }
                    break;

                case "confirmPassword":
                    if (!value) {
                        stateObj[name] = "Please enter Confirm Password.";
                    } else if (input.password && value !== input.password) {
                        stateObj[name] = "Password and Confirm Password does not match.";
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        });
    }
    const router = useRouter()

    return (
        <>
            <div className='signin-page'>
                <Card className='card'>
                    <div className='form-1'>
                        <h1 className="fw-normal">Conformation password</h1>

                        <form className='form-outline' >
                            <div className="form-outline mb-4">
                                <input type="email" id="form2Example11" className="form-control" name='email'
                                    placeholder="Enter Email" value={input.email} onChange={onInputChange} />
                                {error.email && <span className='err'>{error.email}</span>}
                            </div>
                            <div className="form-outline mb-4">
                                <input type="password" id="form2Example22" className="form-control" name='password'
                                    placeholder="Enter Password" value={input.password} onChange={onInputChange} />
                                {error.password && <span className='err'>{error.password}</span>}
                            </div>
                            <div className="form-outline mb-4">
                                <input type="password" id="form2Example22" className="form-control" name='confirmPassword'
                                    placeholder="Enter Confirm Password" value={input.confirmPassword} onChange={onInputChange} />
                                {error.confirmPassword && <span className='err'>{error.confirmPassword}</span>}
                            </div>
                            <div className='form-outline mb-4'>
                                <button type="submit" className="form-control">Submit</button>
                            </div>


                        </form>
                    </div>
                </Card>
            </div>
        </>
    )
}
