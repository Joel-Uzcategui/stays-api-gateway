import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  RABBITMQ_URL: string;
  AUTH_QUEUE: string;
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    RABBITMQ_URL: joi.string().required(),
    AUTH_QUEUE: joi.string().required(),
    JWT_SECRET: joi.string().min(16).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value as EnvVars;

export const envs = {
  port: envVars.PORT,
  rabbitmqUrl: envVars.RABBITMQ_URL,
  authQueue: envVars.AUTH_QUEUE,
  jwtSecret: envVars.JWT_SECRET,
};
