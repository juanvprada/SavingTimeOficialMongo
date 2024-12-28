import express from 'express';
import { getPosts, createPost, deletePost, getPostById, updatePost } from '../controllers/postController';
import { upload } from '../middleware/multer';

const router = express.Router();

// Rutas
router.get('/', getPosts); 
router.get('/:id', getPostById); 
router.post('/', upload.single('image'), createPost);
router.put('/:id', upload.single('image'), updatePost); 
router.delete('/:id', deletePost); 


export default router;




