import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/usermodels";
import Cart from "../models/Cart";
import { StaticItem } from "../models/staticItemmodel";
import CustomizableItem from "../models/customizableItemmodel";
import Toppings from "../models/toppings";
import exp from "constants";

export const addToCart = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(400).json({ status: 'error', message: 'User not found' });
        return;
    }
    if (user.role !== 'customer') {
        res.status(403).json({ status: 'error', message: 'You are not authorized to perform this action' });
        return;
    }

    const { type, product_name, quantity } = req.body;

    if (type === 'StaticItem') {
        const product = await StaticItem.findOne({ name: product_name });
        if (!product) {
            res.status(400).json({ status: 'error', message: 'Product not found' });
            return;
        }

        const itemQuantity = quantity || 1;
        const totalPrice = product.price * itemQuantity;

        let cart = await Cart.findOne({ userId: req.userId, status: 'active' });
        if (!cart) {
            cart = await Cart.create({
                userId: req.userId,
                items: [{ type: 'StaticItem', productId: product._id, totalPrice, quantity: itemQuantity }],
                status: 'active',
            });
        } else {
            cart.items.push({
                type: 'StaticItem',
                productId: product._id,
                totalPrice,
                quantity: itemQuantity
            });
            await cart.save();
        }

        res.status(201).json({ status: 'success', message: 'Item added to cart successfully', data: cart });
    }

    if (type === 'CustomizableItem') {
        const product = await CustomizableItem.findOne({ name: product_name });
        if (!product) {
            res.status(400).json({ status: 'error', message: 'Product not found' });
            return;
        }

        const preferred_price = req.body.preferred_price;
        if (preferred_price < product.price_range.min || preferred_price > product.price_range.max) {
            res.status(400).json({ status: 'error', message: 'Preferred price is out of range' });
            return;
        }

        const itemQuantity = quantity || 1;
        let totalToppingsPrice = 0;
        const toppings = [];

        for (const toppingItem of req.body.Toppings) {
            const topping = await Toppings.findOne({ name: toppingItem.name });
            if (!topping) {
                res.status(400).json({ status: 'error', message: `Topping ${toppingItem.name} not found` });
                return;
            }

            const toppingQuantity = toppingItem.quantity || 1;
            const toppingPrice = topping.price * toppingQuantity;

            totalToppingsPrice += toppingPrice;
            toppings.push({ topping: topping._id, quantity: toppingQuantity });
        }

        const totalPrice = (preferred_price + totalToppingsPrice) * itemQuantity;

        let cart = await Cart.findOne({ userId: req.userId, status: 'active' });
        if (!cart) {
            cart = await Cart.create({
                userId: req.userId,
                items: [{
                    type: 'CustomizableItem',
                    productId: product._id,
                    toppings,
                    totalPrice,
                    quantity: itemQuantity
                }],
                status: 'active',
            });
        } else {
            cart.items.push({
                type: 'CustomizableItem',
                productId: product._id,
                toppings,
                totalPrice,
                quantity: itemQuantity
            });
            await cart.save();
        }

        res.status(201).json({ status: 'success', message: 'Item added to cart successfully', data: cart });
    }
});

export const getUserCart = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if(!user){
        res.status(400).json({status:'error',message:'User not found'});
        return;
    }
    if(user.role !== 'customer'){
        res.status(403).json({status:'error',message:'You are not authorized to perform this action'});
        return;
    }
    const cart = await Cart.findOne({userId:req.userId,status:'active'}).populate('items.productId').populate('items.toppings.topping').populate('items.totalPrice');
    if(!cart){
        res.status(404).json({status:'error',message:'Cart not found'});
        return;
    }
    res.status(200).json({status:'success',data:cart});
});


export const deleteUserCart = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if(!user){
        res.status(400).json({status:'error',message:'User not found'});
        return;
    }
    if(user.role !== 'customer'){
        res.status(403).json({status:'error',message:'You are not authorized to perform this action'});
        return;
    }
    const cart = await Cart.findOne({userId:req.userId,status:'active'});
    if(!cart){
        res.status(404).json({status:'error',message:'Cart not found'});
        return;
    }
    cart.status = 'inactive';
    await cart.save();
    res.status(200).json({status:'success',message:'Cart deleted successfully'});
});

