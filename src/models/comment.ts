import mongoose from 'mongoose'
import IComment from '../interfaces/commentInterface'

const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    likes: {
        type: Number,
        default: 0
    },
    post: {
        type: mongoose.Schema.Types.ObjectId
    },
    author: {
        type: mongoose.Schema.Types.ObjectId
    }
})

const Comment = mongoose.model<IComment>('comment', commentSchema)

export default Comment