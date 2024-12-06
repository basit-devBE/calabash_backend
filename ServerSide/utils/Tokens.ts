import jwt from "jsonwebtoken";
import {v4 as uuid} from 'uuid';
import RefreshToken from "../models/refreshToken";
import dotenv from "dotenv";
dotenv.config();
export const generateacessToken = (userId:string) => {
    return jwt.sign({userId}, process.env.JWT_SECRET as string, {expiresIn: '15m'})
};

export const generateRefreshToken = async(userId:string) => {
    const token = jwt.sign({userId, id: uuid()}, process.env.REFRESH_SECRET as string)
    const refreshToken = new RefreshToken({
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    await refreshToken.save();
    return token;    
}