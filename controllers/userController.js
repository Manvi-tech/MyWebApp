
const User = require('../models/user');
const Follow = require('../models/follow');

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
        let profileUser = await User.findById(req.params.id)
        .populate('posts')
        .populate('followers')
        .populate('following');
       
        // logged in user is folllowing profile user
        let isFollowing = await Follow.findOne({
            follower: req.user._id,
            following: req.params.id
        });

        //profile user is following logged in user
        let isFollower = await Follow.findOne({
            following: req.user._id,
            follower: req.params.id
        });

        return res.render('profile',{
            title: 'User|Profile',
            profile_user: profileUser,
            isFollowing: isFollowing,
            isFollower: isFollower
        });

    }catch(err){
        req.flash('error', err);
    }
}

//follow user
module.exports.followUser = async function(req, res){
    try{

        await User.findByIdAndUpdate(req.params.id, {
            $push: {followers: req.user._id}
        },{new: true});

        await User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.params.id}
        },{new: true});
        
        await Follow.create({
            follower: req.user._id,
            following: req.params.id
        });

        return res.redirect('back');
    }catch(err){
        console.log(err);
        return;
    }
}

//unfollow user
module.exports.unFollowUser = async function(req, res){
    try{

        await User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.params.id}
        });

        await User.findByIdAndUpdate(req.params.id, {
            $pull: {followers: req.user._id}
        });

        await Follow.findOneAndDelete({
          follower: req.user._id,
          following: req.params.id
        });

        return res.redirect('back');
    }catch(err){
        console.log(err);
        return res.redirect('back');
    }
   
}