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


export default mongoose.model('Toppings', toppingsSchema);