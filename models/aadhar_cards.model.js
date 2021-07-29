var mongoose = require('mongoose');

let aadhar_card_schema = new mongoose.Schema({
    aadhar_card_number: {
        type: String,
        required: true
    },
    aadhar_card_number_found: {
        type: Boolean,
        required: false,
        default: false
    }
});

var aadhar_cards = module.exports = mongoose.model('aadhar_cards', aadhar_card_schema)
