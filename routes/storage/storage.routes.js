import Router from 'express';
import { downloadImage, getImage } from '../../controllers/storage/index.js';

export const storageRoutes = Router();

storageRoutes.get('/:name', (req, res) => {
  getImage(req, res);
});
storageRoutes.get('/download/:name/:new_name', (req, res) => {
  downloadImage(req, res);
})