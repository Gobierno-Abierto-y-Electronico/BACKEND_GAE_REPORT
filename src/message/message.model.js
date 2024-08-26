import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
    receptor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Enter a valid idUser of receptor"]
    },
    emisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Enter a valid idUser of emisor"]
    },
    content: {
        type: String,
        required: true
    },
    status: { //Estado para ver despues si ya se envio
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    SendAt: { //Fecha de envio del mensaje
        type: Date,
        default: Date.now
    },
    chatId: { //Es para vincular cada mensaje a un chat
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: [true, "Enter a valid chatId"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

MessageSchema.methods.toJSON = function () {
    const { __v, _id, ...message } = this.toObject();
    message.messageId = _id;
    return message;
};

export default mongoose.model('Message', MessageSchema);
