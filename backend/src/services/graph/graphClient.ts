import axios, { AxiosInstance } from 'axios';

/**
 * Decode JWT token to check scopes
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
 * Check if token has required scopes
 */
function hasRequiredScopes(token: string, requiredScopes: string[]): { hasAll: boolean; missing: string[]; actualScopes: string[] } {
  const claims = decodeJWT(token);
  if (!claims) {
    return { hasAll: false, missing: requiredScopes, actualScopes: [] };
  }

  // Get scopes from token (can be in 'scp' or 'roles' field)
  const tokenScopes = (claims.scp || claims.roles || '').split(' ').filter((s: string) => s.length > 0);
  
  // Check which required scopes are missing
  const missing = requiredScopes.filter(scope => !tokenScopes.includes(scope));
  
  return {
    hasAll: missing.length === 0,
    missing,
    actualScopes: tokenScopes,
  };
}

/**
 * Microsoft Graph API Client
 * Handles all Microsoft 365 API interactions
 */
export class GraphClient {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    
    // Validate token format
    if (!accessToken || accessToken.trim().length === 0) {
      throw new Error('Access token is empty or invalid');
    }
    
    // Log token info (first/last chars only for security)
    const tokenPreview = accessToken.length > 20 
      ? `${accessToken.substring(0, 10)}...${accessToken.substring(accessToken.length - 10)}`
      : '***';
    console.log('GraphClient initialized with token:', tokenPreview, 'Length:', accessToken.length);
    
    this.client = axios.create({
      baseURL: 'https://graph.microsoft.com/v1.0',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    // Add request interceptor for debugging
    this.client.interceptors.request.use(
      (config) => {
        const authHeader = config.headers?.Authorization;
        const authHeaderStr = typeof authHeader === 'string' ? authHeader : String(authHeader || '');
        
        console.log('Graph API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          hasAuth: !!authHeader,
          authHeader: authHeaderStr ? `${authHeaderStr.substring(0, 20)}...` : 'none',
          contentType: config.headers?.['Content-Type'],
          dataPreview: config.data ? JSON.stringify(config.data).substring(0, 200) : 'no data',
        });
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Add response interceptor for better error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          console.error('Graph API Error Response:', {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            data: error.response.data,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Send an Outlook email
   */
  async sendEmail(to: string, subject: string, body: string, isHtml: boolean = true): Promise<void> {
    // Check if token has required scopes
    const scopeCheck = hasRequiredScopes(this.accessToken, ['Mail.Send']);
    if (!scopeCheck.hasAll) {
      throw new Error(
        `Missing required permissions: ${scopeCheck.missing.join(', ')}. ` +
        `Token has scopes: ${scopeCheck.actualScopes.join(', ') || 'none'}. ` +
        `Please log out and log back in to grant the required permissions.`
      );
    }

    try {
      const message = {
        message: {
          subject,
          body: {
            contentType: isHtml ? 'HTML' : 'Text',
            content: body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: to,
              },
            },
          ],
        },
        saveToSentItems: true, // Save copy to sent items
      };

      // Log the exact request we're making
      console.log('Sending email request:', JSON.stringify(message, null, 2));
      console.log('Request URL:', 'https://graph.microsoft.com/v1.0/me/sendMail');
      console.log('Request method:', 'POST');

      const response = await this.client.post('/me/sendMail', message);
      console.log('Email sent successfully:', response.status);
      return response.data;
    } catch (error: any) {
      const errorDetails = error.response?.data || {};
      const status = error.response?.status;
      const responseHeaders = error.response?.headers || {};
      
      console.error('Error sending email:', {
        status,
        statusText: error.response?.statusText,
        error: errorDetails,
        headers: {
          'www-authenticate': responseHeaders['www-authenticate'],
          'request-id': responseHeaders['request-id'],
        },
        fullError: JSON.stringify(errorDetails, null, 2),
      });
      
      if (status === 401) {
        // Check if it's a guest/external account issue
        const wwwAuthenticate = responseHeaders['www-authenticate'] || '';
        let errorMessage = 'Unauthorized';
        let additionalInfo = '';
        
        if (wwwAuthenticate.includes('invalid_token')) {
          errorMessage = 'Invalid token. Please login again.';
        } else if (wwwAuthenticate.includes('insufficient_claims')) {
          errorMessage = 'Token missing required claims. Please login again.';
        } else if (errorDetails.error?.code === 'MailboxNotEnabledForRESTAPI') {
          errorMessage = 'Mailbox not enabled for REST API.';
          additionalInfo = 'This account may be a guest account without a mailbox. Guest accounts often cannot send emails via Graph API.';
        } else if (!wwwAuthenticate && Object.keys(errorDetails).length === 0) {
          // Empty response with no www-authenticate header often indicates guest account restrictions
          errorMessage = 'Authentication failed - possible guest account restriction.';
          additionalInfo = 'Guest/external accounts may have limited Graph API access even with correct permissions. Try using a native Azure AD account, or contact your tenant administrator to enable guest account API access.';
        } else {
          errorMessage = errorDetails.error?.message || errorDetails.message || 'Unauthorized';
        }
        
        const fullMessage = additionalInfo 
          ? `Authentication failed (401): ${errorMessage}. ${additionalInfo} Token has correct scopes but may be restricted.`
          : `Authentication failed (401): ${errorMessage}. Token may be expired or missing required permissions (Mail.Send). Please login again.`;
        
        throw new Error(fullMessage);
      }
      
      if (status === 403) {
        const errorMessage = errorDetails.error?.message || errorDetails.message || 'Forbidden';
        throw new Error(`Permission denied (403): ${errorMessage}. Make sure Mail.Send permission is granted and admin consent is provided.`);
      }
      
      throw new Error(`Failed to send email: ${errorDetails.error?.message || errorDetails.message || error.message}`);
    }
  }

  /**
   * Create a calendar event
   */
  async createCalendarEvent(
    subject: string,
    body: string,
    startDateTime: string,
    endDateTime: string,
    attendees?: string[]
  ): Promise<any> {
    // Check if token has required scopes
    const scopeCheck = hasRequiredScopes(this.accessToken, ['Calendars.ReadWrite']);
    if (!scopeCheck.hasAll) {
      throw new Error(
        `Missing required permissions: ${scopeCheck.missing.join(', ')}. ` +
        `Token has scopes: ${scopeCheck.actualScopes.join(', ') || 'none'}. ` +
        `Please log out and log back in to grant the required permissions.`
      );
    }

    try {
      const event = {
        subject,
        body: {
          contentType: 'HTML',
          content: body,
        },
        start: {
          dateTime: startDateTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'UTC',
        },
        attendees: attendees?.map(email => ({
          emailAddress: {
            address: email,
            name: email,
          },
          type: 'required',
        })) || [],
      };

      const response = await this.client.post('/me/events', event);
      return response.data;
    } catch (error: any) {
      const errorDetails = error.response?.data || {};
      const status = error.response?.status;
      const responseHeaders = error.response?.headers || {};
      
      console.error('Error creating calendar event:', {
        status,
        statusText: error.response?.statusText,
        error: errorDetails,
        headers: {
          'www-authenticate': responseHeaders['www-authenticate'],
          'request-id': responseHeaders['request-id'],
        },
        fullError: JSON.stringify(errorDetails, null, 2),
      });
      
      if (status === 401) {
        // Check if it's a guest/external account issue
        const wwwAuthenticate = responseHeaders['www-authenticate'] || '';
        let errorMessage = 'Unauthorized';
        let additionalInfo = '';
        
        if (wwwAuthenticate.includes('invalid_token')) {
          errorMessage = 'Invalid token. Please login again.';
        } else if (wwwAuthenticate.includes('insufficient_claims')) {
          errorMessage = 'Token missing required claims. Please login again.';
        } else if (!wwwAuthenticate && Object.keys(errorDetails).length === 0) {
          // Empty response with no www-authenticate header often indicates guest account restrictions
          errorMessage = 'Authentication failed - possible guest account restriction.';
          additionalInfo = 'Guest/external accounts may have limited Graph API access even with correct permissions. Try using a native Azure AD account, or contact your tenant administrator to enable guest account API access.';
        } else {
          errorMessage = errorDetails.error?.message || errorDetails.message || 'Unauthorized';
        }
        
        const fullMessage = additionalInfo 
          ? `Authentication failed (401): ${errorMessage}. ${additionalInfo} Token has correct scopes but may be restricted.`
          : `Authentication failed (401): ${errorMessage}. Token may be expired or missing required permissions (Calendars.ReadWrite). Please login again.`;
        
        throw new Error(fullMessage);
      }
      
      if (status === 403) {
        const errorMessage = errorDetails.error?.message || errorDetails.message || 'Forbidden';
        throw new Error(`Permission denied (403): ${errorMessage}. Make sure Calendars.ReadWrite permission is granted and admin consent is provided.`);
      }
      
      throw new Error(`Failed to create calendar event: ${errorDetails.error?.message || errorDetails.message || error.message}`);
    }
  }

  /**
   * Post a message to a Microsoft Teams channel
   */
  async postTeamsMessage(teamId: string, channelId: string, message: string): Promise<any> {
    // Check if token has required scopes
    const scopeCheck = hasRequiredScopes(this.accessToken, ['ChannelMessage.Send']);
    if (!scopeCheck.hasAll) {
      throw new Error(
        `Missing required permissions: ${scopeCheck.missing.join(', ')}. ` +
        `Token has scopes: ${scopeCheck.actualScopes.join(', ') || 'none'}. ` +
        `Please log out and log back in to grant the required permissions.`
      );
    }

    try {
      const chatMessage = {
        body: {
          contentType: 'html',
          content: message,
        },
      };

      const response = await this.client.post(
        `/teams/${teamId}/channels/${channelId}/messages`,
        chatMessage
      );
      return response.data;
    } catch (error: any) {
      console.error('Error posting Teams message:', error.response?.data || error.message);
      throw new Error(`Failed to post Teams message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get current user profile
   */
  async getMe(): Promise<any> {
    // Check if token has required scopes
    const scopeCheck = hasRequiredScopes(this.accessToken, ['User.Read']);
    if (!scopeCheck.hasAll) {
      throw new Error(
        `Missing required permissions: ${scopeCheck.missing.join(', ')}. ` +
        `Token has scopes: ${scopeCheck.actualScopes.join(', ') || 'none'}. ` +
        `Please log out and log back in to grant the required permissions.`
      );
    }

    try {
      const response = await this.client.get('/me');
      return response.data;
    } catch (error: any) {
      const errorDetails = error.response?.data || {};
      const status = error.response?.status;
      
      console.error('Error getting user profile:', {
        status,
        statusText: error.response?.statusText,
        error: errorDetails,
        fullError: JSON.stringify(errorDetails, null, 2),
      });
      
      if (status === 401) {
        const errorMessage = errorDetails.error?.message || errorDetails.message || 'Unauthorized';
        throw new Error(`Authentication failed (401): ${errorMessage}. Token may be expired or invalid.`);
      }
      
      throw new Error(`Failed to get user profile: ${errorDetails.error?.message || errorDetails.message || error.message}`);
    }
  }
  
  /**
   * Test if token is valid by making a simple API call
   */
  async testToken(): Promise<{ valid: boolean; scopes?: string[]; error?: string }> {
    try {
      const profile = await this.getMe();
      return {
        valid: true,
        scopes: [], // Scopes aren't returned in the response
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }
}

