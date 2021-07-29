var express = require('express');
var products = require('../models/products.model');
var {response, handleError, MongooseErrorHandle} = require('../utils/response.util');

var router = express.Router();

router.post('/', (req, res) => {
    let new_resource = new products(req.body);
    new_resource.save((err) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }
        return response(200, {result: new_resource}, res);
    })
});

// Get all
router.get('/', (req, res) => {
    let query = {};
    let {product_id} = req.query;
    if (product_id) {
        query.product_id = product_id;
    }
    products.find(query)
        .exec((err, list) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }
            return response(200, list, res);
        })
});

router.get('/:resource_id', (req, res) => {
    products.findOne({
        _id: req.params.resource_id
    }).exec((err, doc) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }
        if (!doc) {
            return handleError(404, 'Not found', res);
        }
        return response(200, doc, res);
    })
})


module.exports = router;
