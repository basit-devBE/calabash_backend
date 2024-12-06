import { User as ClerkUser } from '@clerk/clerk-sdk-node';

declare global {
  namespace Express {
    interface Request {
      user?: ClerkUser;
      auth: {
        userId: string;
      };
    }
  }
}