
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/user');
const passport = require('passport');

router.get('/signup',function(req,res){
    //when user is already signedin, sign in page should b hidden
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }

    return res.render('signup', {
        title: 'User|SignUp'
    });
});

router.get('/signin', function(req,res){
    //when user is already signedin, sign in page should b hidden
     if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    return res.render('signin',{
        title: 'User|SignIn'
    });
});

router.post('/create', userController.create);

router.post('/createSession', passport.authenticate(
   'local',
   {
       failureRedirect: '/user/signin'
   }
), userController.createSession);

router.get('/signout',userController.destroySession);

router.get('/profile/:id',passport.checkAuthentication, userController.profile);
router.post('/update/:id',passport.checkAuthentication, userController.update);

module.exports = router;