import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("📂 Subiendo archivo a Cloudinary:", file.originalname);
    return {
      folder: 'saving-time', // Asegurar que la carpeta es la correcta
      format: 'jpg',
      public_id: `saving-time/${Date.now()}-${file.originalname.split('.')[0]}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    };
  }
});

export class UploadMiddleware {
  private static fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    console.log("📂 Archivo recibido en `multer`:", file.originalname);
    
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.warn("⚠️ Tipo de archivo no permitido:", file.mimetype);
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (jpg, png, gif, webp)'));
    }
  };

  static array(fieldName: string, maxCount: number = 10) {
    return multer({
      storage: storage,
      fileFilter: this.fileFilter,
      limits: { fileSize: 5 * 1024 * 1024, files: maxCount }
    }).array(fieldName, maxCount);
  }
}
