const multer = require('multer');
const crypto = require('crypto');
const path = require('path');


const userimagestorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads/userimage')
    },
    filename: function (req, file, cb) {
        require('crypto').randomBytes(14, function(err, buffer) {
            var token = buffer.toString('hex');
            cb(null, token+path.extname(file.originalname));
          });
    }
  })
const productimagestorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads/productimage')
    },
    filename: function (req, file, cb) {
        require('crypto').randomBytes(14, function(err, buffer) {
            var token = buffer.toString('hex');
            cb(null, token+path.extname(file.originalname));
          });
    }
  })
  
module.exports = {userimagestorage,productimagestorage};


