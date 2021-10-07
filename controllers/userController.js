
const User = require('../models/user');

// post signup form 
module.exports.create = async function(req,res){

    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    let user = await User.findOne({email: req.body.email});
    try{
        if(!user){
            User.create(req.body);
            req.flash('success', 'User created successfully');
            return res.redirect('/user/signin');
       }else{
            req.flash('error', 'User with this emailid already exists!!');
            return res.redirect('back');
       }
    }catch(err){
        req.flash('error', err);
    }
   
}

//post signin form
module.exports.createSession = function(req,res){
    req.flash('success', 'Successfully logged In');
    return res.redirect('/');
}

//log out
module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Successfully logged Out!');
    return res.redirect('/');
}

//profile info changes
module.exports.update = async function(req, res){
    try{
        if(req.user.id == req.params.id){
            await User.findByIdAndUpdate(req.params.id, req.body);
            req.flash('success', 'Profile updated');
            return res.redirect('back');
       }else{
           req.flash('error', 'Not authorised to update!!!');
            return res.status(401).send('Unaouthorised!');
       }
    }catch(err){
        req.flash('error', err);
    }
}

//rendering profile page
module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id)
        .populate('posts');
     
        // console.log(user.posts);
        
        return res.render('profile',{
            title: 'User|Profile',
            profile_user: user
        });
    }catch(err){
        req.flash('error', err);
    }
}