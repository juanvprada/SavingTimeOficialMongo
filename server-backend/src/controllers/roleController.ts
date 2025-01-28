import { Response } from 'express';
import { User } from '../models/userModel';
import { AuthRequest, ApiResponse } from '../types/request.types';

export class RoleController {
  static async updateUserRole(req: AuthRequest, res: Response<ApiResponse>) {
    const user = req.user;

    if (user?.role !== 'admin') {
      return res.status(403).json({
        message: 'Acceso denegado'
      });
    }

    const { id } = req.params;
    const { role } = req.body;

    try {
      const userToUpdate = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      );

      if (!userToUpdate) {
        return res.status(404).json({
          message: 'Usuario no encontrado'
        });
      }

      return res.json({
        message: 'Rol de usuario actualizado con éxito'
      });
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      return res.status(500).json({
        message: 'Error al actualizar el rol del usuario',
        error
      });
    }
  }
}

