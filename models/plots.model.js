var mongoose = require('mongoose');

let plots_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    product_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'products',
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    document_image: {
        type: String,
        required: false
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    public_key: {
        type: Number,
        required: false
    }
});

var Plots = module.exports = mongoose.model('plots', plots_schema)
