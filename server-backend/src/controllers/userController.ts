import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

//====================
// Registro de usuario
//====================
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, role = 'user' } = req.body;

    try {
        // Verificamos si ya existe un usuario con el mismo correo electrónico
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hasheamos la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = await User.create({
            name,     // Aquí usamos "name"
            email,
            password: hashedPassword,
            role,
        });

        // Generamos un token JWT para el usuario recién creado
        const token = jwt.sign(
            { userId: newUser.id, role: newUser.role, email: newUser.email, name: newUser.name },
            process.env.JWT_SECRET || '1234',
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'Usuario registrado con éxito',
            userId: newUser.id,
            token,
            role: newUser.role,
            name: newUser.name
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

//===============
// Iniciar sesión
//===============
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('No se encontró el usuario con el correo:', email);
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        console.log('Usuario encontrado:', user);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('¿La contraseña coincide?', isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generamos un token para el usuario autenticado
        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email, name: user.name },
            '1234',
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Inicio de sesión exitoso',
            role: user.role,
            name: user.name,
            token: token,
        });
    } catch (error) {
        console.error('Error en el proceso de login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

//===========================
// Obtener todos los usuarios
//===========================
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'email', 'role'] });
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};






