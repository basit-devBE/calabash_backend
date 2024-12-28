
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/verifyTokens";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  // Extract token from cookies or Authorization header
  const accessToken =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  console.log("Access Token:", accessToken); // Debug log

  if (!accessToken) {
    return res.status(401).json({ status: "error", message: "Unauthorized, token is missing" });
  }

  // Verify the token
  const verified = verifyAccessToken(accessToken);
  console.log("Verified Token Payload:", verified); // Debug log

  if (!verified || typeof verified === "string") {
    return res.status(401).json({ status: "error", message: "Unauthorized, invalid token" });
  }

  // Attach userId to the request object
  req.userId = (verified as JwtPayload).userId;
  console.log("User ID added to req:", req.userId); // Debug log

  next();
};


// import { Request, Response, NextFunction } from "express";
// import { verifyAccessToken } from "../utils/verifyTokens";
// import { JwtPayload } from "jsonwebtoken";

// declare global {
//   namespace Express {
//     interface Request {
//       userId?: string;
//     }
//   }
// }

// export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
//   const accessToken =
//     req.cookies?.accessToken || req.headers.authorization?.split(" ")[1]; // Support cookies and Authorization header

//   if (!accessToken) {
//     return res.status(401).json({ status: "error", message: "Unauthorized" });
//   }

//   const verified = verifyAccessToken(accessToken);
//   if (!verified || typeof verified === "string") {
//     return res.status(401).json({ status: "error", message: "Unauthorized" });
//   }

//   req.userId = (verified as JwtPayload).userId; // Extract userId from the token payload
//   next();
// };


// import { Request, Response, NextFunction } from 'express';
// import { verifyAccessToken } from '../utils/verifyTokens';
// import { JwtPayload } from 'jsonwebtoken';
// declare global {
//     namespace Express {
//         interface Request {
//             userId?: string;
//         }
//     }
// }



// export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
//     const accessToken = req?.cookies?.accessToken;
//     if (!accessToken) {
//         return res.status(401).json({ status: 'error', message: 'Unauthorized' });
//     }
//     const verified = verifyAccessToken(accessToken);
//     if (!verified || typeof verified === 'string') {
//         return res.status(401).json({ status: 'error', message: 'Unauthorized' });
//     }

//     req.userId = verified.userId as string;
//     next();
// }