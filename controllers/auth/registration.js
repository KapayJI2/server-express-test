import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import UserModel from '../../entities/user/index.js';

export async function registration(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Неверные регистрационные данные',
      });
    }
    const { email, password, userName } = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email уже существует' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await UserModel.create({
      email,
      password: hashedPassword,
      userName,
    });
    res.json({ message: 'Пользователь успешно создан' });
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так' });
    console.log(e);
  }
}
