import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/usermodels";
import { uploadImage } from "../utils/cloudinary";
import  CustomizableItem  from '../models/customizableItemmodel';

export const createCustomizableItem = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(400).json({ status: 'error', message: 'User not found' });
        return;
    }
    if (user.role !== 'admin') {
        res.status(403).json({ status: 'error', message: 'You are not authorized to perform this action' });
        return;
    }

    const { name, description, price_range, deliveryTime } = req.body;
    const image = req.file as Express.Multer.File;

    if (!image) {
        res.status(400).json({ status: 'error', message: 'Image is required' });
        return;
    }

    if (!price_range || !price_range.min || !price_range.max) {
        res.status(400).json({ status: 'error', message: 'Price range (min and max) is required' });
        return;
    }

    // Upload image to Cloudinary
    const secure_url = await uploadImage(image.path);

    try {
        // Create the customizable item
        const newitem = await CustomizableItem.create({
            name,
            description,
            image: secure_url,
            price_range: {
                min: price_range.min,
                max: price_range.max
            },
            deliveryTime,
        });

        res.status(201).json({
            status: 'success',
            message: 'Customizable item created successfully',
            data: newitem,
        });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


export const getallcustomizableItems = expressAsyncHandler(async (req: Request, res: Response) => {
    // Extract query parameters for pagination
    const page = parseInt(req.query.page as string) || 1; // Current page, default to 1
    const limit = parseInt(req.query.limit as string) || 10; // Items per page, default to 10
    const skip = (page - 1) * limit;

    // Fetch items with pagination
    const total = await CustomizableItem.countDocuments(); // Total items
    const items = await CustomizableItem.find().skip(skip).limit(limit);

    // Pagination info
    const pagination = {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        next: page < Math.ceil(total / limit) ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
    };

    // Response
    res.status(200).json({
        status: 'success',
        data: items,
        pagination,
    });
});


export const getCustomizableItem = expressAsyncHandler(async (req: Request, res: Response) => {
    const item = await CustomizableItem.findOne({ name: req.query.name as string });
    if (!item) {
        res.status(404).json({ status: 'error', message: 'Item not found' });
        return;
    }
    res.status(200).json({
        status: 'success',
        data: item,
    });
})

export const deleteCustomizableItem = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(400).json({ status: 'error', message: 'User not found' });
        return;
    }
    if (user.role !== 'admin') {
        res.status(403).json({ status: 'error', message: 'You are not authorized to perform this action' });
        return;
    }
    const itemtoDelete = await CustomizableItem.findOneAndDelete({ name: req.query.name as string });
    if (!itemtoDelete) {
        res.status(404).json({ status: 'error', message: 'Item not found' });
        return;
    }
    res.status(200).json({ status: 'success', message: 'Item deleted successfully' });

});
