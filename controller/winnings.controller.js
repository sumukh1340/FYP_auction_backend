var express = require('express');
var winnings = require('../models/winnings.model');
var Auction = require('../models/auction.model');
var {response, handleError, MongooseErrorHandle} = require('../utils/response.util');

var router = express.Router();

router.post('/', (req, res) => {
    winnings.findOne({
        auction_id: req.body.auction_id,
        plot_id: req.body.plot_id
    }).exec((error, found) => {
        if (error) {
            return MongooseErrorHandle(error);
        }

        if (found) {
            return handleError(404, 'Winner already announced', res);
        }
        let private_key = random_numberic(4);
        if (private_key) {
            req.body['private_key'] = private_key;
        }
        let new_resource = new winnings(req.body);
        new_resource.save((err) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }

            Auction.findOneAndUpdate({
                _id: req.body.auction_id
            }, {
                is_winner_announced: true
            }).exec((error, winner) => {
                if (error) {
                    return MongooseErrorHandle(error, res);
                }
                return response(200, {result: new_resource}, res);
            })
        })
    })
});

// Get all
router.get('/', (req, res) => {
    let query = {};
    let {user_id, auction_id, plot_id} = req.query;
    if (user_id) {
        query.user_id = user_id;
    }
    if (auction_id) {
        query.auction_id = auction_id;
    }
    if (plot_id) {
        query.plot_id = plot_id;
    }
    winnings.find(query)
        .populate('user_id')
        .populate('plot_id')
        .populate('auction_id')
        .exec((err, list) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }
            return response(200, list, res);
        })
});

router.get('/:resource_id', (req, res) => {
    winnings.findOne({
        _id: req.params.resource_id
    })
        .populate('user_id')
        .populate('plot_id')
        .populate('auction_id')
        .exec((err, doc) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }
            if (!doc) {
                return handleError(404, 'Not found', res);
            }
            return response(200, doc, res);
        })
})

function random_numberic(length = 10) {
    var result = '';
    const chars = '0123456789';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


module.exports = router;
