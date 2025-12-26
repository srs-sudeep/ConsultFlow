import { Request, Response } from 'express';
import { User } from '../models/User';
import { GraphClient } from '../services/graph/graphClient';

/**
 * Decode JWT token without verification (just to see claims)
 */
function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

/**
 * Test endpoint to verify token and permissions
 */
export const testToken = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get user with access token
    const user = await User.findById(req.user._id).select('+accessToken +refreshToken');

    if (!user || !user.accessToken) {
      res.status(401).json({ error: 'User access token not found' });
      return;
    }

    // Decode token to see actual scopes
    const tokenClaims = decodeJWT(user.accessToken);
    
    // Test Graph API access
    const graphClient = new GraphClient(user.accessToken);
    
    try {
      // Try to get user profile (basic test)
      const profile = await graphClient.getMe();
      
      res.json({
        success: true,
        message: 'Token is valid',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          tokenExpiresAt: user.tokenExpiresAt,
          tokenIsExpired: user.tokenExpiresAt ? user.tokenExpiresAt < new Date() : null,
          tokenLength: user.accessToken?.length || 0,
        },
        tokenClaims: {
          scp: tokenClaims?.scp || tokenClaims?.roles || 'Not found',
          aud: tokenClaims?.aud,
          iss: tokenClaims?.iss,
          exp: tokenClaims?.exp ? new Date(tokenClaims.exp * 1000).toISOString() : null,
          iat: tokenClaims?.iat ? new Date(tokenClaims.iat * 1000).toISOString() : null,
        },
        graphProfile: {
          id: profile.id,
          displayName: profile.displayName,
          mail: profile.mail,
          userPrincipalName: profile.userPrincipalName,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Token test failed',
        details: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      });
    }
  } catch (error: any) {
    console.error('Test token error:', error);
    res.status(500).json({ error: 'Failed to test token' });
  }
};

