import Router from 'express';
import { check } from 'express-validator';
import { login } from '../../controllers/auth/login.js';
import { registration } from '../../controllers/auth/registration.js';

export const authRoutes = Router();

authRoutes.post(
  '/registration',
  [
    check('email', 'Input correct email').normalizeEmail().isEmail(),
    check('password', 'Incorrect password').isLength({ min: 6 }),
    check('userName', 'Incorrect name').isLength({ min: 6 }),
  ],
  async (req, res) => {
    registration(req, res);
  },
);
authRoutes.post(
  '/login',
  [
    check('email', 'Input correct email').normalizeEmail().isEmail(),
    check('password', 'Input password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    login(req, res);
  },
);
