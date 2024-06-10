const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    vendor_name: {
        type: String,
        required: true,
        // unique: true
    },
    email: {
        type: String,
        required: true,
        // unique: true
    },
    password: {
        type: String,
        required: true
    },
    vendorshop: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema)