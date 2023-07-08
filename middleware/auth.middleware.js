import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res
      .status(400)
      .json({ message: 'Срок сеанса истёк, необходимо перезайти' });
  }
}
