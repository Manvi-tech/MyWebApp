
const passport = require('passport');

const localStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//passport is using local strategy to see which user has signed in, and 
// then serialize the user in cookie 
passport.use(new localStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
function(req, email, password, done){
    User.findOne({email: email}, function(err, user){
        if(err){
            req.flash('error', err);
            // console.log('err in finding user in passport!');
            return done(err);
        }
        if(!user || user.password != password){
            req.flash('error', 'Invalid username or Password!');
            return done(null, false);
        }
        if(user){
            return done(null, user);
            //returning user to serializer to put it in cookie
        }
    }) 
}
));

//serialize the user to decide which key is to be put in sesssion-coookie
passport.serializeUser (function(user, done){
  return done(null, user.id);
  //stores th id of user in cookie which is encrypted using express session middleware
});

//deserialize the user from the key in cookie
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('err in finding user -> deserialize user');
            return done(err);
        }
        return done(null, user);
    });
});

passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/user/signin');
}

passport.setAuthenticatedUser = function(req, res, next){
     if(req.isAuthenticated()){
//req.user contains current signed in user, setting user in locals for views to access
         res.locals.user = req.user;
     }
     next();
}

module.exports = passport;