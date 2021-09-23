
const Post = require('../models/post');
const User = require('../models/user');

//render home page
module.exports.home = async function(req,res){
  try{
    let posts = await Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });

    let users = await User.find({});
    
    return res.render('home', {
        title: 'Home Page',
        posts: posts,
        all_users: users
    });
    
  }catch(err){
     req.flash('error', err);
  }

}