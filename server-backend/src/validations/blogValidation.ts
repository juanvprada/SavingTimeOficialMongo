import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

/* ====================
   Middleware para manejo de errores de validación generados en las solicitudes
   ==================== */
export const validationHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/* ====================
   Validación de Roles
   ==================== */
   export const roleValidation = (requiredRoles: string[]) => {
    return (req: Request & { user?: { role: string } }, res: Response, next: NextFunction) => {
      const userRole = req.user?.role;
  
      // Si el usuario no está en los roles permitidos
      if (!userRole || !requiredRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes el rol adecuado.' });
      }
  
      // Si es adecuado, continuamos con solicitud
      next();
    };
  };

/* ====================
   Registro de Usuarios
   ==================== */
export const registerValidation = [
    body('name')
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),

    body('email')
      .isEmail().withMessage('Debe ser un correo electrónico válido')
      .normalizeEmail()
      .custom(async (value) => {
        const userExists = false; // << Consulta si el correo ya existe en la base de datos
        if (userExists) {
          throw new Error('Este correo electrónico ya está registrado');
        }
        return true;
      }),

    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
      .matches(/[a-zA-Z]/).withMessage('La contraseña debe contener al menos una letra')
      .not().matches(/\s/).withMessage('La contraseña no puede contener espacios'), // Asegura que no haya espacios
];

/* ====================
   Inicio de Sesión
   ==================== */
export const loginValidation = [
    body('email')
      .isEmail().withMessage('Debe ser un correo electrónico válido')
      .normalizeEmail(),

    body('password')
      .exists().withMessage('La contraseña es obligatoria')
      .not().matches(/\s/).withMessage('La contraseña no puede contener espacios'), // Asegura que no haya espacios
];

/* ====================
   Creación de Publicaciones
   ==================== */
export const createPostValidation = [
    body('name')
      .notEmpty().withMessage('El título es obligatorio')
      .isLength({ max: 100 }).withMessage('El título no debe exceder los 100 caracteres'),

      body('description')
      .notEmpty().withMessage('El contenido es obligatorio')
      .isLength({ min: 100 }).withMessage('El contenido debe tener al menos 100 caracteres'),  

    body('image')
      .optional()
      .isURL().withMessage('Debe ser una URL válida de una imagen')
      .isLength({ max: 200 }).withMessage('La URL de la imagen no debe exceder los 200 caracteres'),
];

/* ====================
   Dar "Like" a una Publicación
   ==================== */
export const likePostValidation = [
    body('postId')
      .isMongoId().withMessage('ID de publicación inválido')
      .notEmpty().withMessage('El ID de la publicación es obligatorio')
      .custom(async (value) => {
        const postExists = false; // << Verifica si el postId existe en la base de datos
        if (!postExists) {
          throw new Error('No existe ninguna publicación con este ID');
        }
        return true;
      }),
];
