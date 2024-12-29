import express from 'express'
import { addToCart } from '../controllers/cart.controllers';
import { isLoggedIn } from '../middlewares/authmiddleware';

const cartRouter = express.Router();

cartRouter.post('/cart/add', isLoggedIn as any,addToCart);

export default cartRouter;