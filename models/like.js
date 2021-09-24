
const mongoose = require('mongoose');

// onModel stores string : Post or Comment
// likeable store id of Post or Comment on which like has been made

const likeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // like can be on post or comment, ref is dynamic(Post or Commment),
    // dynamic ref is shown by reFPath: 'onModel'
    // it will store id of Post or Comment
    likeable:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    // onModel depicting type of likeable: i.e Post or Comment
    onModel:{
        type: String,
        enum: ['Post', 'Comment'],
        required: true
    }
},{
    timestamps: true
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;