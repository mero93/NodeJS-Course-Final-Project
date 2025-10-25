export interface OAuthPRoviderInterface {
  authorize(): string;
  callback(code: string): Promise<OAuthUser>;
  getProviderName(): string;
}

export interface OAuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  emailVerified?: boolean;
}
