var mongoose = require('mongoose');

let products_schema = new mongoose.Schema({
    title: {
        type: String,
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
    attachements: {
        type: String,
        required: false
    }
});

var products = module.exports = mongoose.model('products', products_schema)
