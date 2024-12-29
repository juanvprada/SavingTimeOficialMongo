import fs from 'fs';
import path from 'path';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
const filename = `${timestamp}-${migrationName}.ts`;

const template = `import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  try {
    // Add your migration logic here
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  try {
    // Add your rollback logic here
  } catch (error) {
    console.error('Migration rollback failed:', error);
    throw error;
  }
};
`;

fs.writeFileSync(path.join(__dirname, filename), template);
console.log(`Created migration: ${filename}`);