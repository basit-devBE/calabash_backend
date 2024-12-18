import express from 'express';
import { isLoggedIn } from '../middlewares/authmiddleware';
import upload from '../utils/multer';
import { createCustomizableItem, deleteCustomizableItem, getallcustomizableItems, getCustomizableItem } from '../controllers/customizable.controllers';
import { createStaticItem, DeleteStaticItem, getallStaticItems, getStaticItem } from '../controllers/staticItem.controllers';


const itemrouter = express.Router();
itemrouter.post('/item/custom/create', isLoggedIn as any, upload.single('image'), createCustomizableItem);
itemrouter.get('/item/custom/getall', getallcustomizableItems)
itemrouter.get('/item/custom/getone', getCustomizableItem)
itemrouter.delete('/item/custom/delete',isLoggedIn as any, deleteCustomizableItem)

itemrouter.post('/item/static/create', isLoggedIn as any, upload.single('image'), createStaticItem);
itemrouter.get('/item/static/getall', getallStaticItems);
itemrouter.get('item/static/getone', getStaticItem);
itemrouter.delete('item/static/delete', isLoggedIn as any, DeleteStaticItem)
export default itemrouter;