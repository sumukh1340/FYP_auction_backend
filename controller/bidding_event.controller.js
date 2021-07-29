var express = require('express');
var bidding_event = require('../models/bidding_event.model');
var {response, handleError, MongooseErrorHandle} = require('../utils/response.util');
var request = require('request');
var router = express.Router();

router.post('/', (req, res) => {
    let {user_id, auction_id, bidding_amount} = req.body;
    bidding_event.findOne({
        user_id: user_id,
        auction_id: auction_id
    }).exec((error, found) => {
        if (error) {
            return MongooseErrorHandle(error, res);
        }
        if (found) {
            return handleError(400, 'Already participated to this bidding', res);
        }
        let new_resource = new bidding_event(req.body);
        new_resource.save((err) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }
            return response(200, {result: new_resource}, res);
        })
    })
});

router.get('/', (req, res) => {
        let query = {};
        let {action_id, user_id} = req.query;
        if (action_id) {
            query.action_id = action_id;
        }
        if (user_id) {
            query.user_id = user_id;
        }
        bidding_event.find(query)
            .populate('user_id')
            .populate('action_id')
            .exec((err, list) => {
                if (err) {
                    return MongooseErrorHandle(err, res);
                }
                return response(200, list, res);
            })
    }
)

module.exports = router;
