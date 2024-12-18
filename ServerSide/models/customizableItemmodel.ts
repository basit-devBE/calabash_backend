import mongoose from "mongoose";

const toppingsSchema = new mongoose.Schema({
    topping:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
});

const customizableItemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true   
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    range:{
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
    },
    toppings:[toppingsSchema]
});

export const CustomizableItem = mongoose.model('CustomizableItem', customizableItemSchema);