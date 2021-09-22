
const Comment = require('../models/comment')
const Post = require('../models/post');

module.exports.createComment = async function(req, res){
    try{
        //find post on which comment has been made
        let post = await Post.findById(req.body.post);
            
        if(!post){console.log('comment cant be posted, post doesnt exist with this id..!'); return;}
        if(post){
            let comment = await Comment.create({
                content: req.body. content,
                user: req.user._id,
                post: req.body.post
            });
                
            if(comment){
            post.comments.push(comment);
            //always save whenever update 
            post.save();
            res.redirect('/');
            }
        }
   }catch(err){
       console.log('ERROR!', err);
   }
}


module.exports.destroyComment = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        //comment.user is string, req.user is object, req.user.id is string
        if(comment && comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            //remove comment from post array of comments
            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('ERROR!', err);
    }
}