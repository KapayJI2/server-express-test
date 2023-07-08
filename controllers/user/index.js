import UserModel from '../../entities/user/index.js';
import mongoose from 'mongoose';
import md5 from 'md5';
import * as fs from 'fs';
import { bucket, chunks, files } from '../../utils/connections/index.js';

export async function getUserGallery(req, res) {
  try {
    const { email } = req.user;
    if (email !== req.params.user) {
      return res
        .status(401)
        .json({ message: 'Неверная пара user-token, залогиньтесь заново' });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }
    const images = await files
      .find({ 'metadata.owner_email': email })
      .toArray();
    if (!images.length > 0) {
      return res.status(200).json({ message: 'Галерея пользователя пуста' });
    }
    return res.status(200).json(images);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return res
      .status(500)
      .json({ message: 'Не возможно получить  данные пользователя' });
  }
}
export async function setUserGallery(req, res) {
  try {
    const { email } = req.user;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }
    if (!req.files) {
      return res.status(400).json({ message: 'Нет ни одного файла' });
    }
    const { name, data, mimetype } = req.files.attachedFile;
    const file_name = md5(new Date().getTime().toString());
    const _metadata = {
      md5: file_name,
      uploadTime: Math.ceil(Date.now() / 1000),
      owner_email: email,
      mimetype,
      name,
    };
    try {
      fs.writeFileSync(`${file_name}.${name.split('.').pop()}`, data);
      fs.createReadStream(`${file_name}.${name.split('.').pop()}`)
        .pipe(
          bucket.openUploadStream(`${file_name}.${name.split('.').pop()}`, {
            metadata: _metadata,
          }),
        )
        .on('close', () => {
          fs.unlinkSync(`${file_name}.${name.split('.').pop()}`);
        })
        .on('finish', async () => {
          return res.status(200).json({
            message: 'Файл загружен',
            file: await files.findOne({ 'metadata.md5': file_name }),
          });
        })
        .on('error', () => {
          throw Error('Не удалось загрузить файл');
        });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
      return res.status(500).json({ message: e.message });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
}
export async function removeFromUserGallery(req, res) {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res
        .status(400)
        .json({ message: 'Не указано имя файла для удаления' });
    }
    const image = await files.findOne({ filename });
    if (!image) {
      return res.status(400).json({ message: 'Файл не найден в БД' });
    }
    try {
      await chunks.deleteMany({
        files_id: new mongoose.Types.ObjectId(image._id),
      });
      await files.deleteOne({
        _id: new mongoose.Types.ObjectId(image._id),
      });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
      return res.status(500).json({ message: 'Ошибка удаления файла' });
    }
    return res.status(200).json({ message: 'Картинка удалена' });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
}
