import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface StorageParams {
  public_id: (req: any, file: any) => string;
  allowedFormats?: string[];
  format?: (req: any, file: any) => string | Promise<string>;
  transformation?: any[];
}

const params: StorageParams = {
  public_id: (req, file) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    return `saving-time/${uniqueSuffix}`;
  },
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
};

const storage = new CloudinaryStorage({
  cloudinary,
  params
});

export { cloudinary, storage };