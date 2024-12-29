import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/usermodels";
import toppings from "../models/toppings";

export const createTopping = expressAsyncHandler(async(req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(400).json({ status: 'error', message: 'User not found' });
        return;
    }
    if(user.role !== 'admin'){
        res.status(403).json({status:'error', message:'You are not authorized to perform this action'});
        return;
    }
    const {name, price} = req.body;
    if(!name || !price){
        res.status(400).json({status:'error', message:'All fields are required'});
        return;
    }
    try { 
        const newTopping = await toppings.create({
            name,
            price
        })
        if(newTopping){
            res.status(201).json({
                status:'success',
                message:'Topping created successfully',
                data:newTopping
            });
        }
    }catch(error: any){
        res.status(500).json({status:'error', message:error.message});
    }
});
