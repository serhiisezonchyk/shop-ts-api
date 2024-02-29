import { compareSync, genSalt, hash } from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';

type jwtType = {
  id: string;
  lastName: string;
};
interface CustomRequest extends Request {
  user?: any;
}

const generateJwt = ({ id, lastName }: jwtType): string | null => {
  if (process.env.SECRET_KEY) {
    return jwt.sign({ id, lastName }, process.env.SECRET_KEY, { expiresIn: '12H' });
  } else {
    return null;
  }
};

export const login = async (req: Request, res: Response) => {
  const { login, password } = req.body.data;
  try {
    const user = await db.user.findFirst({
      where: {
        OR: [{ phone: login }, { email: login }],
      },
      include: { userAddress: true },
    });

    if (!user || !compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    const { password: pass, ...rest } = user;
    const token = generateJwt({ id: user.id, lastName: user.lastName });
    return res.status(200).json({ token, user: rest });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const create = async (req: Request, res: Response) => {
  const { checkPassword, ...data } = req.body.data;
  try {
    const existingUser = await db.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or login already exists' });
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(data.password, salt);

    const createdUser = await db.user.create({
      data: { ...data, password: hashedPassword },
    });

    if (createdUser) {
      return res.status(201).json({ message: 'User created successfully' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const check = async (req: CustomRequest, res: Response) => {
  const { id, lastName } = req.user;
  const token = generateJwt({ id, lastName });
  return res.status(200).json({ token });
};
