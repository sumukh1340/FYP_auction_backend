var mongoose = require('mongoose');

let aadhar_card_schema = new mongoose.Schema({
    aadhar_card_number: {
        type: String,
        required: true
    },
});

var aadhar_cards = module.exports = mongoose.model('aadhar_cards', aadhar_card_schema)
