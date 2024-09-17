import mongoose, { Schema, model } from 'mongoose';

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is necessary']
    },
    username: {
        type: String,
        required: [true, 'Username is necessary'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is necessary'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is necessary']
    },
    description: {
        type: String,
        default: "None"
    },
    photo: {
        type: String,
        default: "None"
    },
    progress: {
        type: String,
        default: "acceptance"
    },
    vices: {
        type: [String],
        default: []
    },
    role: {
        type: String,
        enum: ["USER_ROLE", "ADMIN_ROLE"],
        default: "USER_ROLE"
    },
    unidadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unidad',
        required: [true, "Enter a valid unidadId"]
    },
    
    status: {
        type: Boolean,
        default: true
    }


});

export default model('User', UserSchema);
