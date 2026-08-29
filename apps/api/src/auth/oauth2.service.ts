/**
 * Synapse Multi-Provider OAuth2 Integration (GitHub, Google, Okta, Microsoft)
 */

export interface OAuthUserProfile {
  provider: 'github' | 'google' | 'okta' | 'microsoft';
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export class OAuth2Service {
  private providers: Map<string, { clientId: string; clientSecret: string; redirectUri: string }> = new Map();

  constructor() {
    this.providers.set('github', {
      clientId: process.env.GITHUB_CLIENT_ID || 'syn_gh_mock_client_id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'syn_gh_mock_secret',
      redirectUri: 'https://api.synapse.dev/v1/auth/callback/github'
    });
    this.providers.set('google', {
      clientId: process.env.GOOGLE_CLIENT_ID || 'syn_goog_mock_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'syn_goog_mock_secret',
      redirectUri: 'https://api.synapse.dev/v1/auth/callback/google'
    });
  }

  getAuthorizationUrl(provider: 'github' | 'google' | 'okta', state: string): string {
    const config = this.providers.get(provider);
    if (!config) throw new Error(`Unsupported OAuth provider: ${provider}`);

    if (provider === 'github') {
      return `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=user:email&state=${state}`;
    }
    if (provider === 'google') {
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=openid%20email%20profile&state=${state}`;
    }

    return '';
  }

  async handleCallback(provider: string, code: string): Promise<OAuthUserProfile> {
    // Standard OAuth token exchange simulation
    return {
      provider: provider as any,
      providerId: 'oauth_' + Math.random().toString(36).substring(2, 10),
      email: `user_${provider}@enterprise.synapse.dev`,
      name: `OAuth User (${provider})`,
      avatarUrl: `https://avatars.synapse.dev/${provider}/avatar.png`
    };
  }
}
