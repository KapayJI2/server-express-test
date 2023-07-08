import Router from 'express';
import {
  getUserGallery,
  removeFromUserGallery,
  setUserGallery,
} from '../../controllers/user/index.js';

export const userRoutes = Router();

userRoutes.get('/:name', (req, res) => {
  getImage(req, res);
});
userRoutes.get('/:user/gallery', (req, res) => {
  getUserGallery(req, res);
});
userRoutes.post('/:user/upload', (req, res) => {
  setUserGallery(req, res);
});
userRoutes.post('/:user/remove', (req, res) => {
  removeFromUserGallery(req, res);
});
