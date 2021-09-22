
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    //who created the post
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //comments on post
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]

},{
    timestamps:true
});

const Post = mongoose.model('Post', postSchema);
module.exports= Post;