const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const Post = require('../models/post');
const passport = require('passport');
const { post } = require('./user');


router.post('/create',passport.checkAuthentication, postController.createPost);
router.get('/destroy/:id',passport.checkAuthentication, postController.destroyPost);

module.exports = router;