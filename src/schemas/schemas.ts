import * as z from 'zod';

export const userSchema = z
  .object({
    email: z.string({ required_error: 'Email is required.' }).email('Invalid email.'),
    phone: z.string(),
    password: z.string().min(8, 'Password must be 8 or more s.'),
    checkPassword: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  })
  .refine((data) => data.password === data.checkPassword, {
    path: ['checkPassword'],
    message: 'Passwords are different.',
  });
export const userLoginSchema = z.object({
  login: z.string({ required_error: 'Login is required.' }),
  password: z.string().min(8),
});
