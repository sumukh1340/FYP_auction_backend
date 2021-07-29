var express = require('express');
var Auction = require('../models/auction.model');
var bidding_event = require('../models/bidding_event.model');
var Users = require('../models/users.model');
var {response, handleError, MongooseErrorHandle} = require('../utils/response.util');

var router = express.Router();

router.post('/', (req, res) => {
    let new_resource = new Auction(req.body);
    new_resource.save((err) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }
        return response(200, {result: new_resource}, res);
    })
});

// Get all
router.get('/', (req, res) => {
    let query = {
        is_winner_announced: false
    };
    let {product_id, plot_id, user_id} = req.query;
    if (product_id) {
        query.product_id = product_id;
    }
    if (plot_id) {
        query.plot_id = plot_id;
    }
    if (user_id) {
        query.user_id = user_id;
    }
    Auction.find(query)
        .populate('plot_id')
        .populate('product_id')
        .populate('user_id', 'name')
        .exec((err, list) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }
            return response(200, list, res);
        })
});

router.get('/:resource_id', (req, res) => {
    Auction.findOne({
        _id: req.params.resource_id
    }).exec((err, doc) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }
        if (!doc) {
            return handleError(404, 'Not found', res);
        }
        bidding_event.find({
            auction_id: req.params.resource_id
        })
            .populate('user_id')
            .populate('action_id')
            .exec((err, list) => {
                if (err) {
                    return MongooseErrorHandle(err, res);
                }

                let max = 0;
                let highest_user = [];
                if (list.length) {
                    max = list[0].bidding_amount;
                    highest_user = list[0].user_id._id;
                    for (let i = 1; i < list.length; i++) {
                        if (max < list[i].bidding_amount) {
                            max = list[i].bidding_amount;
                            highest_user = list[i].user_id;
                        }
                    }
                    if (highest_user) {
                        Users.findOne({
                            _id: highest_user
                        }, '-password').exec((error, user) => {
                            if (error) {
                                return MongooseErrorHandle(error, res);
                            }
                            if (user) {
                                return response(200, {
                                    result: doc,
                                    users: user,
                                    total_users: list.length,
                                    highest_bid: max
                                }, res);
                            }
                        })
                    } else {
                        return response(200, {result: doc, total_users: list.length, highest_bid: max}, res);
                    }
                } else {
                    return response(200, {result: doc, total_users: 0, highest_bid: 0}, res);
                }
            })
    })
})


module.exports = router;
