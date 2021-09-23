
const Post = require('../models/post');
const Comment = require('../models/comment');

//create post
module.exports.createPost = async function(req, res){
    try{ 
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
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
            post.remove();
            await Comment.deleteMany({post: req.params.id});
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











