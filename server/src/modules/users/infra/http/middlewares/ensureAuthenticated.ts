import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Get the token from the header
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token missing', 401);
  }

  // Destructure the token(Bearer greherh) and get only the second item
  const [, token] = authHeader.split(' ');

  // verify if the token was created using the secret key
  // if not, the function returns an error, use try/catch to catch if the error occurred and send an error with a custom message
  try {
    const decodedToken = verify(token, authConfig.jwt.secret || '');

    const { sub } = decodedToken as TokenPayload;

    // Use our custom data inside the request object
    request.user = {
      id: sub,
    };

    // if token was correct, continue the app
    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
