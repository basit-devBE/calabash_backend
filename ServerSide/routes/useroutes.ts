import express from 'express'
import { Login, Logout, refreshToken, registerUser, updateUser } from '../controllers/usercontrollers'
import { User } from '@clerk/clerk-sdk-node'
import { isLoggedIn } from '../middlewares/authmiddleware'

const Userrouter = express.Router()

Userrouter.post('/register',registerUser)
Userrouter.post('/login',Login)
Userrouter.post('/refreshtoken', refreshToken)
Userrouter.post('/logout', Logout)
Userrouter.post("/update", isLoggedIn as any, updateUser)
export default Userrouter