import express from 'express';
import {} from 'dotenv/config';
import cors from 'cors';
import path from 'path';
import { authMiddleware } from './middleware/auth.middleware.js';
import { authRoutes } from './routes/auth/auth.routes.js';
import { userRoutes } from './routes/user/user.routes.js';
import fileUpload from 'express-fileupload';
import { storageRoutes } from './routes/storage/storage.routes.js';
import { connectToMongo } from './utils/connections/index.js';

const app = express();
const PORT = process.env.PORT || 5008;
const __dirname = path.resolve();

app.use(
  express.json({
    extended: true,
  }),
);

app.use(fileUpload());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/storage', storageRoutes);

app.get('/test', async (req, res) => {
  res.sendFile(path.join(__dirname, '/testConnection/index.html'));
});

async function start() {
  try {
    await connectToMongo();
    app.listen(PORT, () => {
      console.log(`Server start on ${PORT}`);
    });
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}

start();
