import mongoose, { Schema } from 'mongoose';

const ChatSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Enter a valid idUser"]
    },
    receptor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Enter a valid idUser"]
    },
    status: { 
        type: Boolean,
        default: 'true'
    },
});

ChatSchema.methods.toJSON = function () {
    const { __v, _id, ...chat } = this.toObject();
    chat.chatId = _id;
    return chat;
};

export default mongoose.model('Chat', ChatSchema);
