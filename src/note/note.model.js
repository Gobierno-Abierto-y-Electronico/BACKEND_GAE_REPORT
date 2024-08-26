import { Schema, model } from "mongoose";

const NoteSchema = new Schema({

    creatorUserId: {

        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {

        type: String,
        required: [true, 'Title is necessary']
    },
    notedUserId: {

        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {

        type: String,
        required: [true, 'Body is necessary']
    },
    createdAt: {

        type: Date,
        default: Date.now
    },
    status:{
        
        type: Boolean,
        default: true
    }
});

export default model('Note', NoteSchema);