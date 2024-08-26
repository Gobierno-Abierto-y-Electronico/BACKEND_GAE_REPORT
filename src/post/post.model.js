import { Schema, model } from "mongoose";

const PostSchema = Schema({
    title: {
        type: String,
        required: [true, 'Title is necessary']
    },
    description: {
        type: String,
        required: [true, 'Description is necessary']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photo: {
        type: String,
        default: 'None'
    },
    status: {
        type: Boolean,
        default: true
    }
    
});

export default model('Post', PostSchema);