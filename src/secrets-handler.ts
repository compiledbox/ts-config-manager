/**
 * Masks secret values in a configuration object for safe logging.
 *
 * @param config - The configuration object.
 * @param secretKeys - Array of keys that contain sensitive data.
 * @returns A new configuration object with secret values masked.
 */
export function maskSecrets(config: Record<string, any>, secretKeys: string[]): Record<string, any> {
    const masked = { ...config };
    secretKeys.forEach((key) => {
      if (masked[key]) {
        masked[key] = "****";
      }
    });
    return masked;
  }
  