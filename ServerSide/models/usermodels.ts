import mongoose from 'mongoose';
import { PassThrough } from 'stream';

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    orders:{
        type: Array,
        default: []
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
})

const User = mongoose.model('user', userSchema);
export default User;