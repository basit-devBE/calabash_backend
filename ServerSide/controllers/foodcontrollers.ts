import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/usermodels";
import Food from "../models/foodmodels";

export const createFood = expressAsyncHandler(async(req: Request, res: Response) => {
    const user = await User.findById(req.userId);
    if(!user){
        res.status(401);
        throw new Error("You must be logged in to create a food item");
    }
    if(user.role !== "admin"){
        res.status(401);
        throw new Error("You must be an admin to create a food item");
    }
   
    const {name,description,price,image,extras=[]}= req.body;


    if(!name || !description || !price || !image){
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const processedextras = extras.map((extras: { name: string, price: number }) =>{
        if(!extras.name || !extras.price){
              res.status(400);
            throw new Error("Please fill all the fields");
        }
        return {
            name: extras.name.trim(),
            price: extras.price
        }
    })

    const food = await Food.create({
        name: name.trim(),
        description,
        price,
        image,
        extras: processedextras
    });
    if(food){
        res.status(201).json({
            status: 'success',
            message: 'Food created successfully',
            data: {
                id: food._id,
                name: food.name,
                description: food.description,
                price: food.price,
                image: food.image,
                extras: food.extras
            }
        });
    }
    else{
        res.status(400);
        throw new Error("Failed to create food item");
    }

});
