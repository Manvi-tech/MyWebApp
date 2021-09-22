
const express = require('express');
const passport = require('passport');
const router = express.Router();
const commentController = require('../controllers/commentController');


router.post('/create', passport.checkAuthentication, commentController.createComment);
router.get('/destroy/:id',passport.checkAuthentication, commentController.destroyComment);

module.exports= router;