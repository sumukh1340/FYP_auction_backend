var express = require('express');
var Plots = require('../models/plots.model');
var {response, handleError, MongooseErrorHandle} = require('../utils/response.util');
var {save_image, upload_image} = require('../utils/upload');

var router = express.Router();

router.post('/', (req, res) => {
    let {title, product_id, description,address, image, document_image, user_id} = req.body;
    let image_url_1 = '';
    let image_url_2 = '';
    let public_key = random_numberic(4);
    if (image) {
        save_image(image, function (err, result) {
            if (err) {
                console.log('Error saving image');
            } else if (result && result.success) {
                upload_image(result.savedPath, function (image_result) {
                    image_url_1 = image_result.secure_url
                    if (document_image) {
                        save_image(document_image, function (err, result) {
                            if (err) {
                                console.log('Error saving image');
                            } else if (result && result.success) {
                                upload_image(result.savedPath, function (image_result) {
                                    image_url_2 = image_result.secure_url;
                                    let new_resource = new Plots({
                                        title: title,
                                        product_id: product_id,
                                        description: description,
                                        address: address,
                                        user_id: user_id,
                                        image: image_url_1,
                                        document_image: image_url_2,
                                        public_key: public_key
                                    });
                                    new_resource.save((err) => {
                                        if (err) {
                                            return MongooseErrorHandle(err, res);
                                        }
                                        return response(200, new_resource, res);
                                    })
                                })
                            }
                        })
                    } else {
                        let new_resource = new Plots({
                            title: title,
                            product_id: product_id,
                            description: description,
                            address: address,
                            user_id: user_id,
                            image: image_url_1,
                            document_image: image_url_2,
                            public_key: public_key
                        });
                        new_resource.save((err) => {
                            if (err) {
                                return MongooseErrorHandle(err, res);
                            }
                            return response(200, new_resource, res);
                        })
                    }
                })
            }
        })
    } else {
        let new_resource = new Plots({
            title: title,
            product_id: product_id,
            description: description,
            address: address,
            user_id: user_id,
            image: image_url_1,
            document_image: image_url_2,
            public_key: public_key
        });
        new_resource.save((err) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }
            return response(200, new_resource, res);
        })
    }
});

// Get all
router.get('/', (req, res) => {
    let query = {};
    let {product_id} = req.query;
    if (product_id) {
        query.product_id = product_id;
    }

    Plots.find(query)
        .populate('user_id', 'name')
        .populate('product_id', 'name')
        .exec((err, list) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }
            return response(200, list, res);
        })
});

function random_numberic(length = 10) {
    var result = '';
    const chars = '0123456789';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


module.exports = router;
