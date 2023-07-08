import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import UserModel from '../../entities/user/index.js';

export async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные для входа',
      });
    }
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email не найден' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return res.status(200).json({
      token,
      user,
      message: 'Вы успешно вошли в систему',
    });
  } catch (e) {
    res.status(500).json({ message: 'Error' });
    console.log(e);
  }
}
