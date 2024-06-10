const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    id: {
        type: String,

        unique: true
    },
    title: {
        type: String,
        // required: true
    },
    vendor: {
        type: String,
        // required: true
    },
    product_type: {
        type: String,
        // required: true
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    tags: {
        type: [Array]
    },
    status: { type: String }

})

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema)