const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

//create post
module.exports.createPost = async function(req, res){
    console.log(req.file.filename);
    try{ 
        let newpost = await Post.create({
            imageUrl: req.file.filename,
            content: req.body.content,
            user: req.user._id
        });

        let user = req.user;
        await user.posts.push(newpost._id);
        user.save();

        req.flash('success', 'Post Created');    
        return res.redirect('back');
    }catch(err){
        console.log('ERROR!', err);
    }   
}

//delete post
module.exports.destroyPost = async function(req, res){

    try{
        let post = await Post.findById(req.params.id); 
        if(post && post.user == req.user.id){
           
            //del likes on post
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            //del likes on comment of that post
            await Like.deleteMany({_id: {$in: post.comments}});
            //del comments
            await Comment.deleteMany({post: req.params.id});

            // remove post from array of posts of user
            let currUser = await User.findById(post.user._id);
            currUser.posts.pull(post._id);
            currUser.save();

            //del post
            post.remove();
            
            req.flash('success', 'Post and its Comments deleted')
            return res.redirect('back');
        }
        else{
            console.log('unable to delete post and its comments');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
    }
    
}











