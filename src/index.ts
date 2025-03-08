import { ZodSchema } from "zod";
import { validateConfig } from "./schema-validator";
import { loadConfigFromEnv } from "./config-loader";

export interface ConfigLoaderOptions {
  /** Optional path to a JSON configuration file */
  configFilePath?: string;
  /** Optional array of keys that should be masked when logging */
  secretKeys?: string[];
}

/**
 * Loads and validates the configuration.
 *
 * @param schema - A Zod schema defining the expected configuration structure.
 * @param options - Optional loader options including a config file path.
 * @returns A fully validated and typed configuration object.
 */
export function loadConfig<T>(schema: ZodSchema<T>, options?: ConfigLoaderOptions): T {
  const config = loadConfigFromEnv(options?.configFilePath);
  const validatedConfig = validateConfig(schema, config);
  return validatedConfig;
}
