import axios from "axios"
import { getFromStorage } from "./helper";

// const shopname = 
const instance = axios.create({
    headers: {
        shopname: getFromStorage("shopname"),
        email: getFromStorage("email"),
        vendor_name: getFromStorage("vendor_name")
    }
});

export default instance