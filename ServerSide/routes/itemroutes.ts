import express from 'express';
import { isLoggedIn } from '../middlewares/authmiddleware';
import upload from '../utils/multer';
import { createCustomizableItem, deleteCustomizableItem, getallcustomizableItems, getCustomizableItem } from '../controllers/customizable.controllers';


const itemrouter = express.Router();
itemrouter.post('/item/custom/create', isLoggedIn as any, upload.single('image'), createCustomizableItem);
itemrouter.get('/item/custom/getall', getallcustomizableItems)
itemrouter.get('/item/custom/getone', getCustomizableItem)
itemrouter.delete('/item/custom/delete',isLoggedIn as any, deleteCustomizableItem)
export default itemrouter;