// validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export class ValidationMiddleware {
  static validate(validations: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Execute all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // Format errors in a more user-friendly way
          const formattedErrors = errors.array().map(err => ({

            message: err.msg
          }));

          // Return the first error message as the main message
          return res.status(400).json({
            message: formattedErrors[0].message,
            errors: formattedErrors
          });
        }

        return next();
      } catch (error) {
        console.error('Validation error:', error);
        return res.status(500).json({
          message: 'Error en la validación de datos',
          error: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    };
  }
}