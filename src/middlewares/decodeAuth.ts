import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
interface CustomRequest extends Request {
  user?: any;
}
export default function (req: CustomRequest, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No access' });
    }
    if (process.env.SECRET_KEY) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      next();
    }
  } catch (error) {
    return res.status(401).json({ error: 'No access' });
  }
}
