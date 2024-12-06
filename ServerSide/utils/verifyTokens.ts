import jwt from "jsonwebtoken"
import {Response} from 'express'
import dotenv from "dotenv"
dotenv.config()

export const verifyAccessToken = (token:string,) =>{
    const valid = jwt.verify(token, process.env.JWT_SECRET as string)
    if(!valid){
        return {status:'error', message:'Invalid token'}
    };
    return valid
}
export const verifyRefreshToken = (token:string) =>{
    const valid = jwt.verify(token, process.env.REFRESH_SECRET as string)
    if(!valid){
        return {status:'error', message:'Invalid token'}
    };
    return valid
}