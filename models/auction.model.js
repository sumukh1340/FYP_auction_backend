var mongoose = require('mongoose');

let auction_schema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'products',
        required: true
    },
    plot_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'plots',
        required: true
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    base_price: {
        type: Number,
        required: true
    },
    is_winner_announced: {
        type: Boolean,
        required: false,
        default: false
    }
});

var Auction = module.exports = mongoose.model('auctions', auction_schema)
