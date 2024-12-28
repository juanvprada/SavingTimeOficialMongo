import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Definimos una interfaz para el objeto de usuario verificado
interface UserPayload {
    userId: number;
    role: string;
}
export interface CustomRequest extends Request {
    user?: UserPayload;
}

//=======================================
// Creamos el middleware de autenticación
//=======================================
export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    console.log('Token recibido:', token);

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
        req.user = verified;
        console.log('Usuario verificado:', req.user);
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(401).json({ message: 'Token no válido.' });
    }
};

//=======================================
// Creamos el middleware para validación de roles
//=======================================
export const roleValidation = (roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        // Verificamos si el rol del usuario está en la lista de roles permitidos
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado. Rol insuficiente.' });
        }

        next();
    };
};
