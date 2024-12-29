import mongoose from 'mongoose';

const cartModel = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    items:[
        {
            type:{type:String,enum:['StaticItem','CustomizableItem'],required:true},
            productId:{type: mongoose.Schema.Types.ObjectId,required:true,refPath:'items.type'},
            toppings:[{topping:{type:String,ref:'Toppings'}}],
        }
        
    ],
    quantity:{type:Number,default:1},
    totalPrice:{type:Number,required:true},
    status:{type:String,enum:['active','inactive'],default:'active'}
})
const Cart = mongoose.model('Cart',cartModel);
export default Cart