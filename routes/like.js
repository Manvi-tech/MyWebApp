
const express = require('express');
const router = express.Router();

const likeController = require('../controllers/likeController');
//const postController = require('../controllers/postController');

const Like = require('../models/like');
// const Post = require('../models/post');
const passport = require('passport');

router.get('/toggle', passport.checkAuthentication, likeController.toggleLike);

module.exports = router;