import { ZodSchema } from "zod";

// Define a type for flattened errors
export interface FlattenedError {
  fieldErrors: Record<string, string[]>;
  formErrors: string[];
}

// Custom error class that holds the flattened errors
export class ConfigurationError extends Error {
  public errors: FlattenedError;
  constructor(message: string, errors: FlattenedError) {
    super(message);
    this.name = "ConfigurationError";
    this.errors = errors;
  }
}

/**
 * Validates the configuration object against the provided Zod schema.
 *
 * @param schema - The Zod schema to validate against.
 * @param config - The configuration object to validate.
 * @returns The validated and possibly transformed configuration object.
 * @throws A ConfigurationError if validation fails, with detailed error information.
 */
export function validateConfig<T>(schema: ZodSchema<T>, config: unknown): T {
  const result = schema.safeParse(config);
  if (!result.success) {
    const flattenedErrors = result.error.flatten();
    const errorMsg = `Invalid configuration:\n${JSON.stringify(flattenedErrors, null, 2)}`;
    throw new ConfigurationError(errorMsg, flattenedErrors as FlattenedError);
  }
  return result.data;
}
