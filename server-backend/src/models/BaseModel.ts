import { Model, InitOptions } from 'sequelize';
import { BaseModel, UUID, Timestamp } from '../types/index';

export abstract class BaseSequelizeModel<T extends BaseModel> extends Model {
  public id!: UUID;
  public created_at?: Timestamp;
  public updated_at?: Timestamp;

  // Definimos el método associate como abstracto en la clase
  public static associate(models?: any): void { }

}

export const baseModelConfig: Partial<InitOptions> = {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
};