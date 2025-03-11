import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth =
  (...status: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenWithBearer = req.headers.authorization;
      if (!tokenWithBearer) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
      }

      if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
        const token = tokenWithBearer.split(' ')[1];

        //verify token
        const verifyAdmin = jwt.verify(
          token,
          config.jwt.jwt_secret as Secret
        ) as JwtPayload;
        //set user to header
        req.user = verifyAdmin;

        //guard user
        if (status.length && !status.includes(verifyAdmin.admin_status)) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Error faced while retrieving status!"
          );
        }

        next();
      }
    } catch (error) {
      next(error);
    }
  };

export default auth;
