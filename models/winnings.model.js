var mongoose = require('mongoose');

let winnings_schema = new mongoose.Schema({
    auction_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'auctions',
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
    private_key: {
        type: Number,
        required: false
    }
});

var winnings = module.exports = mongoose.model('winnings', winnings_schema)
