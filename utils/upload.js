const fs = require('fs');
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'navaneethv100',
    api_key: '728874147137347',
    api_secret: 'M8I-bLVBwKaLRlgHtTyXLfU6-YI'
});

let img_path = __dirname + '/images/';

function upload_image(img_path, callback) {
    cloudinary.uploader.upload(img_path, function (result) {
        // console.log('Cloudinary Result', result);
        callback(result);
    });
}

 function save_image(img_data, callback) {
    let image_file = img_data.split(',');
    fs.writeFile(img_path + 'sample', image_file[1], 'base64', function (err) {
        if (err) {
            //console.log('Cloudinary Save Image Error:', err);
            callback(err, null);
        } else {
            //console.log('Image Successfully Saved at: ' + (img_path + imgName));
            callback(null, {
                success: true,
                savedPath: img_path + 'sample'
            });
        }
    });
}

module.exports ={
    save_image,
    upload_image
}
