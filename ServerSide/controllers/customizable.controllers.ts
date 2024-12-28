import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/usermodels";
import { uploadImage } from "../utils/cloudinary";
import { CustomizableItem } from "../models/customizableItemmodel";

export const createCustomizableItem = expressAsyncHandler(
  async (req: Request, res: Response) => {
    console.log("User ID from request:", req.userId);

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(400).json({ status: "error", message: "User not found" });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({
        status: "error",
        message: "You are not authorized to perform this action",
      });
      return;
    }

    const { name, description, range, deliveryTime, toppings } = req.body;
    const image = req.file as Express.Multer.File;

    if (!image) {
      res.status(400).json({ status: "error", message: "Image is required" });
      return;
    }

    console.log("Uploaded file:", image);

    try {
      let toppingsArray = [];
      if (toppings) {
        try {
          console.log("Toppings before parsing:", toppings);
          toppingsArray = JSON.parse(toppings).map((topping: any) => ({
            topping: topping.name,
            price: Number(topping.price),
          }));
        } catch (err) {
          res
            .status(400)
            .json({ status: "error", message: "Invalid toppings format" });
          return;
        }
      }

      const secure_url = await uploadImage(image.path);
      console.log("Image URL:", secure_url);

      const newitem = await CustomizableItem.create({
        name,
        description,
        image: secure_url,
        range,
        deliveryTime,
        toppings: toppingsArray,
      });

      console.log("Customizable Item Created:", newitem);

      res.status(201).json({
        status: "success",
        message: "Customizable item created successfully",
        data: newitem,
      });
    } catch (error: any) {
      console.error("Error creating customizable item:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
);

export const getallcustomizableItems = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const items = await CustomizableItem.find();

      res.status(200).json({
        status: "success",
        data: items,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "An unknown error occurred",
        });
      }
    }
  }
);

// export const getallcustomizableItems = expressAsyncHandler(
//   async (req: Request, res: Response) => {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;

//     const total = await CustomizableItem.countDocuments();
//     const items = await CustomizableItem.find().skip(skip).limit(limit);

//     const pagination = {
//       total,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       next: page < Math.ceil(total / limit) ? page + 1 : null,
//       prev: page > 1 ? page - 1 : null,
//     };

//     res.status(200).json({
//       status: "success",
//       data: items,
//       pagination,
//     });
//   }
// );

export const getCustomizableItem = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const item = await CustomizableItem.findOne({
      name: req.query.name as string,
    });
    if (!item) {
      res.status(404).json({ status: "error", message: "Item not found" });
      return;
    }
    res.status(200).json({
      status: "success",
      data: item,
    });
  }
);

export const deleteCustomizableItem = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Step 1: Check if the user exists
      const user = await User.findById(req.userId);
      if (!user) {
        res
          .status(400)
          .json({ status: "error", message: "User not found" });
        return; // Ensure the function exits after sending the response
      }

      // Step 2: Check if the user has admin privileges
      if (user.role !== "admin") {
        res.status(403).json({
          status: "error",
          message: "You are not authorized to perform this action",
        });
        return; // Ensure the function exits after sending the response
      }

      // Step 3: Extract the item ID from request parameters
      const { id } = req.params;

      // Step 4: Find and delete the customizable item
      const deletedItem = await CustomizableItem.findByIdAndDelete(id);

      if (!deletedItem) {
        res
          .status(404)
          .json({ status: "error", message: "Item not found" });
        return; // Ensure the function exits after sending the response
      }

      // Step 5: Respond with success
      res.status(200).json({
        status: "success",
        message: "Item deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting customizable item:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to delete the item",
      });
    }
  }
);

  
// const user = await User.findById(req.userId);
    // if (!user) {
    //   res.status(400).json({ status: "error", message: "User not found" });
    //   return;
    // }
    // if (user.role !== "admin") {
    //   res.status(403).json({
    //     status: "error",
    //     message: "You are not authorized to perform this action",
    //   });
    //   return;
    // }
    // const itemtoDelete = await CustomizableItem.findOneAndDelete({
    //   name: req.query.name as string,
    // });
    // if (!itemtoDelete) {
    //   res.status(404).json({ status: "error", message: "Item not found" });
    //   return;
    // }
    // res
    //   .status(200)
    //   .json({ status: "success", message: "Item deleted successfully" });