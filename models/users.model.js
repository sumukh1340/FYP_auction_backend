var mongoose = require('mongoose');

let users_schema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    mobile_number: {
        type: String,
        required: true
    },
    aadhar_card_number: {
        type: Number,
        required: true
    },
    profession: {
        type: String,
        required: false
    },
    experience: {
        type: Number,
        required: false
    },
    orginization_name: {
        type: String,
        required: false
    },
    user_type: {
        type: String,
        required: false
    },
    password: {
        hash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        }
    }
});

var Users = module.exports = mongoose.model('users', users_schema)
