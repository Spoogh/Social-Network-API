const {Schema, model, Types}= require('mongoose');
const moment = require('moment');

const ReactionSchema = new Schema(
    {
        reactionId:{
            type: Schema.Types.ObjectId()
        },
        reactionBody:{
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        username:{
            type: String,
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now,
            get: (createdAtVal)=> moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        }
    }
)

const ThoughtSchema = new Schema(
    {
        thoughtText:{
            type: String,
            required: true,
            minlength: 1,
            maxlength: 120
        },
        createdAt:{
            type: Date,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        },
        username:{
            type: String,
            required: true
        },
        userId:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON:{
            virtuals: true,
            getters: true
        },
    }
)

ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
})

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;