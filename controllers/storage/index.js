import { bucket, files } from '../../utils/connections/index.js';
import * as fs from "fs"

export async function getImage(req, res) {
  try {
    const { name } = req.params;
    return bucket
      .openDownloadStreamByName(name)
      .on('error', () => {
        return res.json({ message: 'CDN: Not found' });
      })
      .pipe(res);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return res.status(500).json({ message: 'Ошибка получения данных' });
  }
}

export async function downloadImage(req, res) {
  try {
    const { name, new_name } = req.params;
    return bucket
      .openDownloadStreamByName(name)
      .on('error', () => {
        return res.json({ message: 'CDN: Not found' });
      })
      .pipe(fs.createWriteStream(`./${new_name}`)).on('finish', () => {
        return res.download(`./${new_name}`);
      });
    
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return res.status(500).json({ message: 'Ошибка получения данных' });
  }
}