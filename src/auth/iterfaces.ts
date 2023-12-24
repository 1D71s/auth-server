import { Token } from '@prisma/client';

export interface Tokens {
  accessToken: string;
  refreshToken: Token;
}

export interface GoogleUser {
  email: string,
  firstName: string,
  accessToken: string
}

export interface ReqGoogleUser {
  user: GoogleUser
}

export interface JwtPayloadUser {
    id: string;
    email: string;
    role: string;
}