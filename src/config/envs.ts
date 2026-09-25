import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  RABBITMQ_URL: string;
  AUTH_QUEUE: string;
  CATALOG_QUEUE: string;
  SEARCH_QUEUE: string;
  JWT_PUBLIC_KEY: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    RABBITMQ_URL: joi.string().required(),
    AUTH_QUEUE: joi.string().required(),
    CATALOG_QUEUE: joi.string().required(),
    SEARCH_QUEUE: joi.string().required(),
    JWT_PUBLIC_KEY: joi.string().base64().required(),
  })
  .unknown(true);

const result = envsSchema.validate(process.env) as {
  error?: joi.ValidationError;
  value: EnvVars;
};

if (result.error) {
  throw new Error(`Config validation error: ${result.error.message}`);
}

const envVars = result.value;

export const envs = {
  port: envVars.PORT,
  rabbitmqUrl: envVars.RABBITMQ_URL,
  authQueue: envVars.AUTH_QUEUE,
  catalogQueue: envVars.CATALOG_QUEUE,
  searchQueue: envVars.SEARCH_QUEUE,
  jwtPublicKey: Buffer.from(envVars.JWT_PUBLIC_KEY, 'base64').toString('utf8'),
};
