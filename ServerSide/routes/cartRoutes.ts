import express from 'express'
import { addToCart, deleteUserCart, getUserCart } from '../controllers/cart.controllers';
import { isLoggedIn } from '../middlewares/authmiddleware';

const cartRouter = express.Router();

cartRouter.post('/cart/add', isLoggedIn as any,addToCart);
cartRouter.get('/cart', isLoggedIn as any,getUserCart);
cartRouter.delete('/cart/delete', isLoggedIn as any,deleteUserCart);

export default cartRouter;