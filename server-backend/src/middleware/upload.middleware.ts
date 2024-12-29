import multer from 'multer';
import path from 'path';
import fs from 'fs';

export class UploadMiddleware {
  private static storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../../uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extname = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${extname}`);
    }
  });

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
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: maxCount
      }
    }).array(fieldName, maxCount);
  }

  // Keep the single method for backward compatibility
  static single(fieldName: string) {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024
      }
    }).single(fieldName);
  }
}