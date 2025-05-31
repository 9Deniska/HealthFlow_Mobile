import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: number;
  role: string;
  iat: number;
  exp: number;
}

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};
