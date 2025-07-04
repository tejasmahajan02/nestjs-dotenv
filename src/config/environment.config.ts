import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { join } from 'path';
import { existsSync } from 'fs';
import * as Joi from 'joi';

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

  dotenvExpand.expand(dotenv.config({ path: envFilePath }));
}

const validationSchema = Joi.object({
  NODE_PORT: Joi.number().port().default(3000),
});

export function validateEnv() {
  const { error, value: envVars } = validationSchema.validate(process.env, {
    abortEarly: false, // show all errors
    allowUnknown: true, // allow variables not in schema
    stripUnknown: true, // remove unknowns
  });

  if (error) {
    throw new Error(error.message);
  }

  process.env = { ...process.env, ...envVars };
}
