import mongoose from "mongoose";

const staticItemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    deliveryTime:{
        type:String,
        required:true
    }
});

export const StaticItem = mongoose.model('StaticItem', staticItemSchema);