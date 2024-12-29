import mongoose from 'mongoose';


const orderModel = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    items:[
        {
            
        }
    ]
})