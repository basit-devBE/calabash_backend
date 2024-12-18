import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/usermodels";
import { uploadImage } from "../utils/cloudinary";
import { StaticItem } from "../models/staticItemmodel";

export const createStaticItem = expressAsyncHandler(async(req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(400).json({ status: 'error', message: 'User not found' });
        return;
    }
    if(user.role !== 'admin'){
        res.status(403).json({status:'error', message:'You are not authorized to perform this action'});
        return;
    }
    const {name, description, price, deliveryTime} = req.body;
    const image = req.file as Express.Multer.File;
    if(!name || !description || !price || !deliveryTime){
        res.status(400).json({status:'error', message:'All fields are required'});
        return;
    }
    if(!image.path){
        res.status(400).json({status:'error', message:'Image is required'});
        return;
    }
    try {
        const secure_url = await uploadImage(image.path);
        if(!secure_url){
            res.status(500).json({status:'error', message:'Image upload failed'});
            return;
        }
        const newStaticItem = await StaticItem.create({
            name,
            description,
            image: secure_url,
            price,
            deliveryTime
        });
        res.status(201).json({
            status:'success',
            message:'Item created successfully',
            data:newStaticItem
        });
    }    catch(error: any){
        res.status(500).json({status:'error', message:error.message});
    }
    
});


export const getallStaticItems = expressAsyncHandler(async(req:Request, res:Response)=>{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page-1) * limit;

    const total = await StaticItem.countDocuments();
    const items = await StaticItem.find().skip(skip).limit(limit);

    const pagination = {
        total,
        currentPage: page,
        totalPages: Math.ceil(total /limit),
        next: page < Math.ceil(total / limit) ? page + 1 : null,
        prev: page > 1 ? page -1 : null,
    };


    res.status(200).json({
        status: "success",
        data: items,
        pagination
    })
});

export const getStaticItem = expressAsyncHandler(async(req:Request, res:Response)=>{
    const item = await StaticItem.findOne({name: req.query.name as string});
    if(!item){
        res.status(404).json({status:'error', message:'Item not found'});
        return;
    }
    res.status(200).json({
        status:'success',
        data:item
    });
});

export const DeleteStaticItem = expressAsyncHandler(async(req:Request, res:Response)=>{
    const user = await User.findById(req.userId);
    if(!user){
        res.status(400).json({status:'error', message:'User not found'});
        return;
    }
    if(user.role !== 'admin'){
        res.status(403).json({status:'error', message:'You are not authorized to perform this action'});
        return;
    }
    const itemToDelete = await StaticItem.findOneAndDelete({name: req.query.name as string});
    if(!itemToDelete){
        res.status(404).json({status:'error', message:'Item not found'});
        return;
    }
    res.status(200).json({
        status:'success',
        message:'Item deleted successfully'
    });

});