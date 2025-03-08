import { ZodSchema } from "zod";

/**
 * Validates the configuration object against the provided Zod schema.
 *
 * @param schema - The Zod schema to validate against.
 * @param config - The configuration object to validate.
 * @returns The validated and possibly transformed configuration object.
 * @throws An error if validation fails.
 */
export function validateConfig<T>(schema: ZodSchema<T>, config: unknown): T {
  const result = schema.safeParse(config);
  if (!result.success) {
    // Log errors only if not in a test environment
    if (process.env.NODE_ENV !== "test") {
      console.error("Configuration validation error:", result.error.flatten());
    }
    throw new Error("Invalid configuration");
  }
  return result.data;
}
