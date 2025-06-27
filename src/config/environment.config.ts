import * as dotenv from 'dotenv';
import { join } from 'path';
import { existsSync } from 'fs';

export enum Environment {
  Local = 'development.local',
  Development = 'development',
  Production = 'production',
}

export function loadEnvironmentConfig() {
  // Convert the NODE_ENV to match one of the valid environments in the enum
  const ENV = Object.values(Environment).includes(
    process.env.NODE_ENV as Environment,
  )
    ? (process.env.NODE_ENV as Environment)
    : Environment.Local;

  // Note : dotenv gives higher precedence to variables defined in the FIRST file loaded.
  const envFilePath = [
    join(process.cwd(), '.env.common'),
    join(process.cwd(), `.env.${ENV}`),
  ];

  for (const file of envFilePath) {
    if (!existsSync(file)) {
      throw new Error(`Environment file not found: ${file}`);
    }
  }

  dotenv.config({ path: envFilePath });
}
