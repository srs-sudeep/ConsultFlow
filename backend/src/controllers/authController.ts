import { Request, Response } from 'express';
import { AuthService } from '../auth/authService';
import { User } from '../models/User';

/**
 * Get or create AuthService instance (lazy initialization)
 */
const getAuthService = (): AuthService => {
  return new AuthService();
};

/**
 * Initiate Azure AD login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const authService = getAuthService();
    const redirectUri = process.env.AZURE_REDIRECT_URI || 'http://localhost:3001/auth/callback';
    const authUrl = await authService.getAuthCodeUrl(redirectUri);

    res.redirect(authUrl);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to initiate login' });
  }
};

/**
 * Handle OAuth callback
 */
export const callback = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.query.code as string;
    const error = req.query.error as string;

    if (error) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=${error}`);
      return;
    }

    if (!code) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_code`);
      return;
    }

    const authService = getAuthService();
    const redirectUri = process.env.AZURE_REDIRECT_URI || 'http://localhost:3001/auth/callback';
    const tokenResponse = await authService.acquireTokenByCode(code, redirectUri);
    const userInfo = authService.extractUserInfo(tokenResponse);

    // Find or create user
    let user = await User.findOne({ azureId: userInfo.azureId });

    if (user) {
      // Update tokens
      user.accessToken = userInfo.accessToken;
      user.refreshToken = userInfo.refreshToken;
      user.tokenExpiresAt = userInfo.expiresAt;
      user.email = userInfo.email;
      user.name = userInfo.name;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        azureId: userInfo.azureId,
        email: userInfo.email,
        name: userInfo.name,
        accessToken: userInfo.accessToken,
        refreshToken: userInfo.refreshToken,
        tokenExpiresAt: userInfo.expiresAt,
      });
    }

    // Set session
    req.session!.userId = user._id.toString();

    // Redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`);
  } catch (error: any) {
    console.error('Callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
  }
};

/**
 * Logout
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  req.session?.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Failed to logout' });
      return;
    }

    res.json({ message: 'Logged out successfully' });
  });
};

/**
 * Get current user info
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user._id).select('-accessToken -refreshToken');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user._id,
      azureId: user.azureId,
      email: user.email,
      name: user.name,
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
};

