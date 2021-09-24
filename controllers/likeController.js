
const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

//create like or remove like
module.exports.toggleLike = async function(req, res){
   try{
      // url : /like/toggle/?type='Post/Comment'&id='an63vh376'
      let likeable, deleted = false;

      if(req.query.type=='Post'){
         likeable = await Post.findById(req.query.id).populate('likes');

      }else{
         likeable = await Comment.findById(req.query.id).populate('likes');
      }
      
      //check if like exists or not
      let existingLike = await Like.findOne({
          likeable: req.query.id,
          onModel: req.query.type,
          user: req.user._id
      });

      //delete like
      if(existingLike){
           likeable.likes.pull(existingLike._id);
           likeable.save();

           existingLike.remove();
           deleted = true;
      }
      //create like
      else{
        const newLike = await Like.create({
             likeable: req.query.id,
             onModel: req.query.type,
             user: req.user._id
        });

        await likeable.likes.push(newLike._id);
        likeable.save();
      }

        if(req.xhr){
            
            return res.status(200).json({
                message: 'Like toggled!',
                data: {
                    deleted: deleted
                }
            })
        }
        else{
            return res.redirect('/');
        }
   }
   catch(err){
       console.log(err);
       return res.json(500,{
           message: 'Internal Server Error!'
       });
   }   
}