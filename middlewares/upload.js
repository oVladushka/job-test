const multer = require('multer');

module.exports = upload = multer({
    //dest: 'images',
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, callback){
        if(!['.png', '.jpg', '.jpeg'].some((item) => file.originalname.endsWith(item))){
            return callback(new Error('unacceptable image extension'))
        }
        callback(undefined, true)
    },
    onError(err, next) {
        next(err);
    }
});