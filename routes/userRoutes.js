const express = require('express');
const userController = require('./../controllers/userController');
const protect = require('./../middlewares/protect');
const upload = require('./../middlewares/upload');

const router = express.Router();

router
    .route('/signup')
    .post(userController.signup);

router
    .route('/signin')
    .post(userController.signin);

router
    .route('/upload')
    .post(protect, upload.single('file'), userController.uploadImage);

router
    .route('/last-post')
    .get(protect, userController.getLastPosts);


module.exports = router;