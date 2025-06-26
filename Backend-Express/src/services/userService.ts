import crypto from 'crypto';
import prisma from '../config/prismaClient';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

export const registerUserService = async (email: string, password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.createHash('sha512').update(password + salt).digest('hex');

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      salt,
    },
  });

  return user;
};

export const loginUserService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const hashedPassword = crypto.createHash('sha512').update(password + user.salt).digest('hex');
  if (hashedPassword !== user.password) return null;

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { userId: user.id, token };
};
