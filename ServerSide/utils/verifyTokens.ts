
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyAccessToken = (token: string) => {
  try {
    const valid = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    return valid; // Return the decoded token payload if valid
  } catch (error) {
    console.error("Access Token Verification Error:", error);
    return { status: "error", message: "Invalid or expired access token" };
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const valid = jwt.verify(token, process.env.REFRESH_SECRET as string) as JwtPayload;
    return valid; // Return the decoded token payload if valid
  } catch (error) {
    console.error("Refresh Token Verification Error:", error);
    return { status: "error", message: "Invalid or expired refresh token" };
  }
};


// import jwt from "jsonwebtoken"
// import {Response} from 'express'
// import dotenv from "dotenv"
// dotenv.config()

// export const verifyAccessToken = (token:string,) =>{
//     const valid = jwt.verify(token, process.env.JWT_SECRET as string)
//     if(!valid){
//         return {status:'error', message:'Invalid token'}
//     };
//     return valid
// }
// export const verifyRefreshToken = (token:string) =>{
//     const valid = jwt.verify(token, process.env.REFRESH_SECRET as string)
//     if(!valid){
//         return {status:'error', message:'Invalid token'}
//     };
//     return valid
// }