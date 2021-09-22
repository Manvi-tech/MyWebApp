
const User = require('../models/user');

module.exports.create = async function(req,res){

    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    let user = await User.findOne({email: req.body.email});
    try{
        if(!user){
            User.create(req.body);
            return res.redirect('/user/signin');
       }else{
            console.log('user with this emailId exists already!!');
            return res.redirect('back');
       }
    }catch(err){
        console.log('ERROR!', err);
    }
   
}

module.exports.createSession = function(req,res){
    req.flash('success', 'Successfully logged In');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Successfully logged Out!');
    return res.redirect('/');
}

module.exports.update = async function(req, res){
    try{
        if(req.user.id == req.params.id){
            await User.findByIdAndUpdate(req.params.id, req.body);
            return res.redirect('back');
       }else{
            return res.status(401).send('Unaouthorised!');
       }
    }catch(err){
        console.log('ERROR!', err);
    }
}

module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
        return res.render('profile',{
            title: 'User|Profile',
            profile_user: user
        });
    }catch(err){
        console.log('ERROR!', err);
    }
}