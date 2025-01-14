import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/usermodels";
import Cart from "../models/Cart";
import axios from 'axios';
import Order from "../models/ordermodels";

export const makeOrder = expressAsyncHandler(async(req:Request,res:Response)=>{
    const user = await User.findById(req.userId);
    if(!user){
        res.status(404).json({message:'User not found'});
        return;
    }
    const cart = await Cart.findOne({userId:req.userId,status:'active'});
    if(!cart){
        res.status(404).json({message:'No Cart available for Orders'});
        return;
    }
    const totalAmount = Array.isArray(cart.items) 
    ? cart.items.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
    : 0;
    if(totalAmount === 0 || totalAmount < 0){
        res.status(400).json({message:'Cart is empty'});
        return;
    }
    const {deliveryAddress,paymentMethod} = req.body;
    const order = await Order.create({
        userId: user._id,
        cartSnapshot: cart.items,
        deliveryAddress,
        paymentMethod,
        totalAmount
    })



})