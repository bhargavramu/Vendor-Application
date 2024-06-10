import React, { Component } from 'react'
import { baseUrl } from '../helpers';
import { Link } from 'react-router-dom'
import "./index.css";
export default class Logout extends Component {

    logout = () => {
        window.localStorage.clear();
        window.location.href = baseUrl + `vendor_login?shop=${router.query.shop}`;
    }
    render() {
        return (
            <Link onClick={this.logout} className="logout">Logout</Link>
        )
    }
}