import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AuthService } from '../auth/authService';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        azureId: string;
        email: string;
        name: string;
        accessToken?: string;
      };
    }
  }
}

/**
 * Middleware to check if user is authenticated
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized. Please login.' });
      return;
    }

    // Fetch user from database
    const user = await User.findById(userId).select('+accessToken +refreshToken');

    if (!user) {
      req.session?.destroy(() => {});
      res.status(401).json({ error: 'User not found. Please login again.' });
      return;
    }

    // Check if token is expired and refresh if needed
    if (user.tokenExpiresAt && user.tokenExpiresAt < new Date() && user.refreshToken) {
      const authService = new AuthService();
      const newTokenResponse = await authService.acquireTokenByRefreshToken(user.refreshToken);

      if (newTokenResponse) {
        user.accessToken = newTokenResponse.accessToken;
        user.refreshToken = newTokenResponse.refreshToken || user.refreshToken;
        user.tokenExpiresAt = newTokenResponse.expiresOn || undefined;
        await user.save();
      } else {
        // Refresh failed, require re-login
        req.session?.destroy(() => {});
        res.status(401).json({ error: 'Session expired. Please login again.' });
        return;
      }
    }

    // Attach user to request
    req.user = {
      _id: user._id.toString(),
      azureId: user.azureId,
      email: user.email,
      name: user.name,
      accessToken: user.accessToken,
    };

    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

