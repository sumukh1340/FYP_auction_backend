var express = require('express');
var aadhar_cards = require('../models/aadhar_cards.model');
var {response, handleError, MongooseErrorHandle} = require('../utils/response.util');

var router = express.Router();

router.post('/', (req, res) => {
    
    let {aadhar_card_number} = req.body;

    if (aadhar_card_number.length !== 12) {
        return handleError(400, 'Invalid aadhar card', res);
    }
    aadhar_cards.findOne({
        aadhar_card_number: req.body.aadhar_card_number,
        aadhar_card_number_found : false
    }).exec((error, found) => {
        if (error) {
            return MongooseErrorHandle(error);
        }
        if (found) {
            return handleError(404, 'Aadhar Card already exists', res);
        }

        let new_resource = new aadhar_cards(req.body);
        new_resource.save((err) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }
            return response(200, {result: new_resource}, res);
        })
    })
});

// Get all
router.get('/', (req, res) => {
    let query = {
        aadhar_card_number_found : false
    };
   
    aadhar_cards.find(query,{})
        .exec((err, list) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }
            return response(200, list, res);
        })
});

module.exports = router;
