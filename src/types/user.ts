export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  level: number;
  experience: number;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
}
