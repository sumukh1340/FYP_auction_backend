var jwt = require('jsonwebtoken');

module.exports.sign = function(ObjectID) {
    return new Promise((resolve, reject) => {
        let secret = '5Q{C`9m#$>d#y,3e';
        let payload = {
            user_id: ObjectID
        }

        let token = jwt.sign(payload, secret, {
            expiresIn: 30 * 24 * 60 * 60 // JWT expires in 30 days
        })
        resolve(token)
    })
};

module.exports.decode = function(token) {
    return new Promise((resolve, reject) => {
        let secret = process.env.JWT_SECRET

        jwt.verify(token, secret, (err, decoded) => {
            if (err)
                reject('Invalid token')
            else
                resolve(decoded)
        })
    })
};
