import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/usermodels";
import { comparePassword, hashPassword } from "../utils/password";
import { generateacessToken,generateRefreshToken } from "../utils/Tokens";
import RefreshToken from "../models/refreshToken";
import { verifyRefreshToken } from "../utils/verifyTokens";
import jwt  from 'jsonwebtoken';
import { decode } from '../node_modules/@types/jsonwebtoken/index.d';

export const registerUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const { fullname, email, password,mobile,role } = req.body;

  // Input validation
  if (!fullname || !email || !password || !mobile) {
    res.status(400).json({ status: 'error', message: 'Please fill all fields' });
    return;
  }

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  const mobileNumberRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,10}[-\s.]?[0-9]{1,10}$/;
  if (!email.match(emailRegex)) {
    res.status(400).json({ status: 'error', message: 'Please enter a valid email' });
    return;
  }

  if (!password.match(passwordRegex)) {
    res.status(400).json({
      status: 'error',
      message: 'Password must be at least 6 characters long, contain a number, an uppercase, and a lowercase letter',
    });
    return;
  }
  if(!mobile.match(mobileNumberRegex)){
    res.status(400).json({ status: 'error', message: 'Please enter a valid mobile number' });
    return;
  }

  // Check if the user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ status: 'error', message: 'User already exists' });
    return;
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Save the user to the database
  try {
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    if (user) {
      res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          role:user.role,
        },
      });
    } else {
      res.status(400).json({ status: 'error', message: 'Failed to create user' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal Server Error', error: (error as Error).message });
  }
});



export const Login = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password,role } = req.body;

 
  if (!email || !password) {
    res.status(400).json({ status: "error", message: "Please fill all fields" });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ status: "error", message: "User does not exist" });
    return;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ status: "error", message: "Invalid credentials" });
    return;
  }

  try {
    const accessToken = generateacessToken(user._id.toString());
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET!, { expiresIn: "30d" });

    // Save refresh token to DB
    const newRefreshToken = new RefreshToken({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
    await newRefreshToken.save();

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, 
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          role:user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
});


export const refreshToken = expressAsyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ status: "error", message: "Please login to continue" });
    return;
  }

  try {
  
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      res.status(403).json({ status: "error", message: "Invalid refresh token" });
      return;
    }


    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as { userId: string };

    
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const newAccessToken = generateacessToken(user._id.toString());

    
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Token refreshed",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid or expired refresh token",
      error: (error as Error).message,
    });
  }
});


export const Logout = expressAsyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ status: "success", message: "Logged out successfully" });
});


// export const Login = expressAsyncHandler(async (req:Request, res:Response) =>{
//     const {email,password} = req.body;
//     if(!email || !password){
//         res.status(400).json({status:'error', message:'Please fill all fields'});
//         return;
//     }

//     const user = await User.findOne({email});
//     if(!user){
//         res.status(400).json({status:'error', message:'User does not exist'});
//         return;
//     }
//     const matchPassword = await comparePassword(password, user?.password as string);
//     if(!matchPassword){
//         res.status(400).json({status:'error', message:'Invalid credentials'});
//         return;
//     }

//     try{
//     const accessToken = await  generateacessToken(user._id.toString());
//     const refreshToken = await jwt.sign({userId:user._id}, process.env.REFRESH_SECRET as string);
//     const newRefreshToken = new RefreshToken({
//         token: refreshToken,
//         expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
//     });
//     await newRefreshToken.save();
//     res.cookie('accessToken', accessToken, {httpOnly:true});
//     res.cookie('refreshToken', newRefreshToken, {httpOnly:true});
//     res.status(200).json({status:'success', message:'Login successful'});
//     }
//     catch(error){
//         res.status(500).json({status:'500', message:"Internal Server Error", error:(error as Error).message});
//     }
    
// })

// export const refreshToken = expressAsyncHandler(async(req:Request,res:Response)=>{
//     const token = req.cookies.refreshToken;
//     if(!token){
//         res.status(400).json({status:'error', message:'Please login to continue'});
//         return;
//     }
//     const validToken = await RefreshToken.findById(token.id)
//     if(!validToken){
//         res.status(400).json({status:'error', message:'Invalid JSON token'});
//         return;
//     }
//     interface DecodedToken {
//         userId: string;
//     }
//     const decoded = jwt.verify(validToken.token, process.env.REFRESH_SECRET as string) as DecodedToken;
//     if(!decoded){
//         res.status(400).json({status:'error', message:'Invalid token'});
//         return;
//     }
//     const user = await User.findById(decoded.userId);
//     if(!user){
//         res.status(400).json({status:'error', message:'User does not exist'});
//         return;
//     }
//     const accessToken = generateacessToken(user._id.toString());
//     res.cookie('accessToken', accessToken, {httpOnly:true});
//     res.status(200).json({status:'success', message:'Token refreshed'});
// })


// export const Logout = expressAsyncHandler(async(req:Request, res:Response)=>{
//     res.clearCookie('accessToken');
//     res.clearCookie('refreshToken');
//     res.status(200).json({status:'success', message:'Logged out successfully'});
// })

export const updateUser = expressAsyncHandler(async(req:Request, res:Response)=>{
    const user = await User.findById(req.userId);
    if(!user){
        res.status(400).json({status:'error', message:'User not found'});
        return;
    }
    const {fullname, email, mobile} = req.body;
    if(fullname){
        user.fullname = fullname;
    }
    if(email){
        user.email = email;
    }
    if(mobile){
        user.mobile = mobile;
    }
    await user.save();
    res.status(200).json({status:'success', message:'User updated successfully'});

})

export const deleteUser = expressAsyncHandler(async(req:Request, res:Response)=>{
    const user = await User.findById(req.userId);
    if(!user){
        res.status(400).json({status:'error', message:'User not found'});
        return;
    }
    await user.deleteOne();
    res.status(200).json({status:'success', message:'User deleted successfully'});
})




