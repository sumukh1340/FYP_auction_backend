var express = require('express');
var Users = require('../models/users.model');
var aadhar_cards = require('../models/aadhar_cards.model');
var {response, handleError, MongooseErrorHandle} = require('../utils/response.util');
var {encrypt, compare} = require('../utils/crypto/hash.util');
var {save_image, upload_image} = require('../utils/upload');

var router = express.Router();

// Register
router.post('/', (req, res) => {
    let {
        mobile_number,
        name,
        email,
        password,
        aadhar_card_number,
        profession,
        experience,
        organization_name
    } = req.body;

    aadhar_cards.findOne({
        aadhar_card_number: aadhar_card_number
    },{
        aadhar_card_number_found : true
    }).exec((err2, aadhar) => {
        if (err2) {
            return MongooseErrorHandle(err2, res);
        }
        if (!aadhar) {
            return handleError(400, 'Invalid aadhar card number', res);
        }

        Users.findOne({
            mobile_number: mobile_number
        })
            .exec((err, doc) => {
                if (err) {
                    return MongooseErrorHandle(err, res);
                }
                if (doc) {
                    return handleError(409, 'User already exists', res);
                }
                let new_user = new Users({
                    name: name,
                    mobile_number: mobile_number,
                    email: email,
                    profession: profession,
                    experience: experience,
                    aadhar_card_number: aadhar_card_number,
                    organization_name: organization_name,
                    password: encrypt(password)
                });
                new_user.save((err) => {
                    if (err) {
                        return MongooseErrorHandle(err, res);
                    }
                    return response(200, {user_id: new_user._id}, res);
                })
            })
    })
});

// update profile
router.put('/profile/:user_id', (req, res) => {
    let {user_id} = req.params;
    Users.findOneAndUpdate({
            _id: user_id
        }, req.body
    ).exec((err, doc) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }
        return response(200, 'Profile updated', res);
    })
})

router.get('/profile/:user_id', (req, res) => {
    let {user_id} = req.params;
    Users.findOne({
        _id: user_id
    }, '-password').exec((err, doc) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }
        return response(200, doc, res);
    })
});

// Get all users
router.get('/', (req, res) => {
    let query = {};
    let {user_id} = req.query;
    if (user_id) {
        query._id = user_id;
    }
    Users.find(query, '-password').exec((err, list) => {
        if (err) {
            return MongooseErrorHandle(err, res);
        }
        return response(200, list, res);
    })
});

// Login
router.post('/login', (req, res) => {
    let {email, password} = req.body;
    Users.findOne({
        email: email
    })
        .exec((err, doc) => {
            if (err) {
                return MongooseErrorHandle(err, res);
            }

            if (!doc) {
                return handleError(403, 'User not found', res);
            }

            if (!compare(doc.password.hash, doc.password.salt, password)) {
                return response(403, 'Either email or password is invalid', res)
            }
            let resp_data = {
                _id: doc._id,
                name: doc.name,
                mobile_number: doc.mobile_number,
                email: doc.email,
                profession: doc.profession,
                experience: doc.experience,
                organization: doc.organization
            };
            return response(200, resp_data, res)
        })
});

module.exports = router;
