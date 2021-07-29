var crypto = require('crypto')
var randomstring = require('randomstring')

let generate_salt = () => {
    return randomstring.generate(11)
}

 module.exports.encrypt = function(password) {

    if (!password) {
        throw new Error('Password cannot be blank or null')
    }

    let salt = generate_salt();
    let HmacMethod = 'sha512';

    let hash = crypto.createHmac(HmacMethod, salt);
    hash.update(password);

    return {
        hash: hash.digest('hex'),
        salt: salt
    }
};


module.exports.compare = function(p_hash, salt, password) {
    let HmacMethod = 'sha512';

    let hash = crypto.createHmac(HmacMethod, salt)
    hash.update(password)

    if (hash.digest('hex') === p_hash)
        return true
    else
        return false
}

