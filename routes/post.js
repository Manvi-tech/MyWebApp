const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const passport = require('passport');
const { post } = require('./user');
const multer = require('multer');
const path = require('path');

var Storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'assets/images/post-images/');
    },
    filename: function(req, file, cb){
       const filePath = Date.now() + '-' + file.originalname + path.extname(file.originalname);
       cb(null, filePath);
    }
});

var upload = multer({
    storage: Storage,
    limits: {
        fileSize: 1024*1024*3
    }
});


router.post('/create',passport.checkAuthentication,upload.single('post-image'),postController.createPost);

router.get('/destroy/:id',passport.checkAuthentication, postController.destroyPost);

module.exports = router;