import multer from 'multer';
import { storage } from '../config/cloudinary';

export class UploadMiddleware {
  private static fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (jpg, png, gif, webp)'));
    }
  };

  static array(fieldName: string, maxCount: number = 10) {
    return multer({
      storage: storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: maxCount
      }
    }).array(fieldName, maxCount);
  }

  static single(fieldName: string) {
    return multer({
      storage: storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024
      }
    }).single(fieldName);
  }
}