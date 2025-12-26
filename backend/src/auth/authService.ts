import { ConfidentialClientApplication, AuthenticationResult } from '@azure/msal-node';
import { IUser } from '../models/User';

/**
 * Azure AD Authentication Service
 * Handles OAuth2 flow with Microsoft Identity Platform
 */
export class AuthService {
  private msalConfig: {
    auth: {
      clientId: string;
      authority: string;
      clientSecret: string;
    };
  };

  private pca: ConfidentialClientApplication;

  constructor() {
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;
    const tenantId = process.env.AZURE_TENANT_ID;

    if (!clientId || !clientSecret || !tenantId) {
      throw new Error('Azure AD configuration is missing. Check environment variables.');
    }

    this.msalConfig = {
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        clientSecret,
      },
    };

    this.pca = new ConfidentialClientApplication(this.msalConfig);
  }

  /**
   * Get authorization URL for login
   */
  getAuthCodeUrl(redirectUri: string, scopes: string[] = ['User.Read', 'Mail.Send', 'Calendars.ReadWrite', 'ChannelMessage.Send', 'offline_access']): Promise<string> {
    return this.pca.getAuthCodeUrl({
      scopes,
      redirectUri,
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async acquireTokenByCode(code: string, redirectUri: string): Promise<AuthenticationResult> {
    try {
      const scopes = ['User.Read', 'Mail.Send', 'Calendars.ReadWrite', 'ChannelMessage.Send', 'offline_access'];
      const response = await this.pca.acquireTokenByCode({
        code,
        scopes,
        redirectUri,
      });
      
      // Log token info for debugging (without exposing the actual token)
      if (response) {
        console.log('Token acquired successfully. Scopes:', response.scopes || 'Not available');
        console.log('Token expires at:', response.expiresOn);
      }

      if (!response) {
        throw new Error('Failed to acquire token');
      }

      return response;
    } catch (error: any) {
      console.error('Error acquiring token:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async acquireTokenByRefreshToken(refreshToken: string): Promise<AuthenticationResult | null> {
    try {
      const scopes = ['User.Read', 'Mail.Send', 'Calendars.ReadWrite', 'ChannelMessage.Send', 'offline_access'];
      const response = await this.pca.acquireTokenByRefreshToken({
        refreshToken,
        scopes,
      });
      
      if (response) {
        console.log('Token refreshed successfully. Scopes:', response.scopes || 'Not available');
      }

      return response || null;
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  /**
   * Extract user info from token response
   */
  extractUserInfo(tokenResponse: AuthenticationResult): {
    azureId: string;
    email: string;
    name: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  } {
    const account = tokenResponse.account;
    if (!account) {
      throw new Error('No account information in token response');
    }

    return {
      azureId: account.homeAccountId || account.localAccountId || '',
      email: account.username || '',
      name: account.name || account.username || '',
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresAt: tokenResponse.expiresOn || undefined,
    };
  }
}

