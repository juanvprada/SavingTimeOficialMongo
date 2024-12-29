import multer from 'multer';
import path from 'path';
import fs from 'fs';

export class UploadMiddleware {
  private static storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Cambiamos la ruta a la raíz del proyecto
      const uploadDir = path.join(__dirname, '../../uploads');
      
      // Crear el directorio si no existe
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generar un nombre más seguro y único
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extname = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${extname}`);
    }
  });

  private static fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Validar tipos de archivo permitidos
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (jpg, png, gif, webp)'));
    }
  };

  static single(fieldName: string) {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    }).single(fieldName);
  }
}