import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/usermodels";
import { uploadImage } from "../utils/cloudinary";
import Menu from "../models/menuModel";

export const createMenu = expressAsyncHandler(async (req: Request, res: Response):Promise<void> => {
  try {
    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
     res.status(404).json({ status: 'error', message: 'User not found' });
        return;
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'You are not authorized to create a menu' });
        return;
    }

    const { name, price } = req.body;
    const file = (req.file) as Express.Multer.File;
    console.log('Uploaded file:', file);

    // Validate input fields
    if (!name || !price || !file || !file.path) {
        res.status(400).json({ status: 'error', message: 'Please fill all Me' });
        return;
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
      res.status(400).json({ status: 'error', message: 'Price must be a positive number' });
        return;
    }

    // Upload image
    const secure_url = await uploadImage(file.path as string);

    // Create menu
    const menu = await Menu.create({
      name,
      price,
      image: secure_url,
    });

     res.status(201).json({
      status: 'success',
      message: 'Menu created successfully',
      data: menu,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
});


export const fetchallMenu = expressAsyncHandler(async(req:Request, res:Response)=>{
  try {
    const menu = await Menu.find();
    res.status(200).json({
      status: 'success',
      data: {menu, count: menu.length},

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
})



export const searchMenuitem = expressAsyncHandler(async (req: Request, res: Response):Promise<void> => {
  try {
    const { name } = req.query as { name?: string };

    // Validate if 'name' exists in the query
    if (!name || name.trim() === '') {
      res.status(400).json({
        status: 'error',
        message: 'Please provide a valid name to search.',
      });
      return;
    }

    // Perform the search with a case-insensitive regex
    const menu = await Menu.find({
      name: { $regex: name, $options: 'i' },
    });

    res.status(200).json({
      status: 'success',
      data: { menu, count: menu.length },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
});
