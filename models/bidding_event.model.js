var mongoose = require('mongoose');

let bidding_event_schema = new mongoose.Schema({
    auction_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'auctions',
        required: true
    },
    bidding_amount: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    date: {
        type: String,
        required: true
    },
});

var bidding_event = module.exports = mongoose.model('bidding_event', bidding_event_schema)
