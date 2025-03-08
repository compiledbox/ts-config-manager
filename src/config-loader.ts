import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load .env file if present
dotenv.config();

/**
 * Loads configuration values from environment variables, .env file, and an optional JSON file.
 *
 * @param configFilePath - Optional path to a JSON configuration file.
 * @returns An object containing merged configuration values.
 */
export function loadConfigFromEnv(configFilePath?: string): Record<string, any> {
  let fileConfig: Record<string, any> = {};

  if (configFilePath) {
    const resolvedPath = path.resolve(configFilePath);
    if (fs.existsSync(resolvedPath)) {
      try {
        const fileContent = fs.readFileSync(resolvedPath, "utf-8");
        fileConfig = JSON.parse(fileContent);
      } catch (error) {
        console.warn(`Warning: Could not parse config file at ${resolvedPath}.`, error);
      }
    }
  }

  // Merge file config with process.env, giving precedence to process.env variables.
  return { ...fileConfig, ...process.env };
}
