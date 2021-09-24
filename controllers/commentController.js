
const Comment = require('../models/comment');
const Like = require('../models/like');
const Post = require('../models/post');

//post create-comment form 
module.exports.createComment = async function(req, res){
    try{
        //find post on which comment has been made
        let post = await Post.findById(req.body.post);
            
        if(!post){console.log('comment cant be posted, post doesnt exist with this id..!'); return;}
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });
                
            if(comment){
                post.comments.push(comment);
                //always save whenever update 
                post.save();

               //comment = await comment.populate('user','name email').execPopulate();

                req.flash('success', 'Comment Published');
                res.redirect('/');
            }
        }
   }catch(err){
     req.flash('error', err);
   }
}

//delete comment
module.exports.destroyComment = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        //comment.user is string, req.user is object, req.user.id is string
        if(comment && comment.user == req.user.id){
            
            let postId = comment.post;
            
            //remove likes of that comment
            Like.deleteMany({likeable: comment, onModel: 'Comment'});

            //remove comment from post array of comments
            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});

            comment.remove();

            req.flash('sucesss', 'Comment deleted');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'Comment Not deleted!!!')
            return res.redirect('back');
        }
    }catch(err){
       req.flash('error', err);
    }
}