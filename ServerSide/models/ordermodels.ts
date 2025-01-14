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
    deliveryAddress:{
        type:String,
        required:true
    },
    deliveryStatus:{
        type:String,
        enum:['pending','delivered','cancelled'],
        default:'pending'
    },
    paymentMethod:{
        type:String,
        enum:['momo','cash'],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['pending','paid'],
        default:'pending'
    },
    totalAmount:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

},{timestamps:true}
)

const Order = mongoose.model('Order',orderModel);
export default Order