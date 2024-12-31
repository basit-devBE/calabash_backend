import mongoose from "mongoose";

const orderModel = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    cartSnapshot:{
        type:[{
            type:{type:String,enum:['StaticItem','CustomizableItem'],required:true},
            productId:{type: mongoose.Schema.Types.ObjectId,required:true,refPath:'cartSnapshot.type'},
            toppings:[{topping:{type:String,ref:'Toppings'}}],
            totalPrice:{type:Number,required:true},
            quantity:{type:Number,default:1},
        }],
        required:true
},
})