# ts-config-manager

**ts-config-manager** is a lightweight, open source TypeScript library designed to simplify managing, validating, and transforming application configuration values. It provides a unified, type-safe configuration object by merging values from multiple sources—environment variables (including those loaded from a `.env` file) and optional configuration files (e.g., `config.json`).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Defining a Configuration Schema](#defining-a-configuration-schema)
  - [Loading Configuration](#loading-configuration)
  - [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## Overview

Managing application configuration—especially when merging multiple sources like environment variables and configuration files—can be error-prone and cumbersome. **ts-config-manager** addresses these challenges by:

- Loading configuration values from various sources.
- Validating and transforming these values using a predefined schema powered by [Zod](https://github.com/colinhacks/zod).
- Providing a fully type-safe configuration object at runtime.
- Supporting nested configurations, default values, and secure handling of sensitive information.

## Features

- **Multi-Source Loading:**  
  Merge configuration values from environment variables, `.env` files, and JSON configuration files (`config.json`).

- **Schema Validation & Transformation:**  
  Use [Zod](https://github.com/colinhacks/zod) to define schemas that validate and transform incoming configuration values.

- **Type Safety:**  
  Receive a fully typed configuration object at runtime, reducing runtime errors due to misconfigured settings.

- **Nested Configurations:**  
  Support for nested configuration objects with their own validation and default values.

- **Secret Handling:**  
  Easily mask sensitive data in your configuration for secure logging or debugging.

## Installation

Install the library along with its required dependencies using npm:

```bash
npm install @compiledbox/ts-config-manager
```

## Usage 

Defining a Configuration Schema
Define your configuration schema using Zod. For example:

```typescript
import { z } from "zod";

const configSchema = z.object({
  PORT: z.preprocess(
    (val) => (typeof val === "string" && val.trim() !== "" ? val : "3000"),
    z.string()
  ).transform((val) => Number(val)),
  DB_HOST: z.string(),
  DB_PORT: z.preprocess(
    (val) => (typeof val === "string" && val.trim() !== "" ? val : "5432"),
    z.string()
  ).transform((val) => Number(val)),
  NESTED: z.object({
    FEATURE_FLAG: z.preprocess(
      (val) => (typeof val === "string" && val.trim() !== "" ? val : "false"),
      z.string()
    ).transform((val) => val === "true")
  }).optional()
});

```

## Loading Configuration

Use the `loadConfig` function to load and validate your configuration:

```typescript
import { loadConfig } from "@compiledbox/ts-config-manager";

// Load configuration from environment variables (.env file loaded automatically)
// or merge with a config.json file if specified.
const config = loadConfig(configSchema, { configFilePath: "./config.json" });

console.log("Loaded configuration:", config);

```
## Usage Examples

Example 1: Environment Variables Only

```typescript
import { z } from "zod";
import { loadConfig } from "@compiledbox/ts-config-manager";

const configSchema = z.object({
  PORT: z.preprocess(
    (val) => (typeof val === "string" && val.trim() !== "" ? val : "3000"),
    z.string()
  ).transform((val) => Number(val)),
  DB_HOST: z.string(),
  DB_PORT: z.preprocess(
    (val) => (typeof val === "string" && val.trim() !== "" ? val : "5432"),
    z.string()
  ).transform((val) => Number(val))
});

const config = loadConfig(configSchema);
console.log("Loaded configuration (env only):", config);

```

Example 2: Environment Variables and config.json

```typescript
import { z } from "zod";
import { loadConfig } from "@compiledbox/ts-config-manager";

const configSchema = z.object({
  PORT: z.preprocess(
    (val) => (typeof val === "string" && val.trim() !== "" ? val : "3000"),
    z.string()
  ).transform((val) => Number(val)),
  DB_HOST: z.string(),
  DB_PORT: z.preprocess(
    (val) => (typeof val === "string" && val.trim() !== "" ? val : "5432"),
    z.string()
  ).transform((val) => Number(val))
});

const config = loadConfig(configSchema, { configFilePath: "./config.json" });
console.log("Loaded configuration (env and config.json):", config);

```
## Error Handling

When loading and validating your configuration with ts-config-manager, any issues in your configuration will cause the library to throw a custom error called ConfigurationError. This error extends the standard Error object and provides detailed information about the validation issues.

### ConfigurationError

ConfigurationError includes an errors property that contains two key pieces of information:
- fieldErrors:
An object mapping each configuration field to an array of error messages. For example:

```json
{
  "PORT": [ "Enter Valid Port" ],
  "DB_HOST": [ "Enter Valid Host" ]
}
```
- formErrors:
An array of general error messages that are not tied to a specific field.

### Handling Errors in Your Application

You can import the ConfigurationError class from the library and wrap your configuration loading in a try/catch block. This allows you to inspect the detailed error messages and provide a clear response to the user.

```typescript
import { loadConfig } from "@compiledbox/ts-config-manager";
import { ConfigurationError } from "@compiledbox/ts-config-manager/dist/schema-validator";
import { z } from "zod";

// Define your configuration schema using Zod with custom error messages
const configSchema = z.object({
  PORT: z.preprocess(
    (val) => (typeof val === "string" && val.trim() !== "" ? val : undefined),
    z.string({ required_error: "Enter Valid Port" }).nonempty({ message: "Enter Valid Port" })
  ).transform((val) => Number(val)),
  DB_HOST: z.string({ required_error: "Enter Valid Host" }).nonempty({ message: "Enter Valid Host" }),
});

try {
  // Attempt to load configuration (from environment variables and an optional config.json)
  const config = loadConfig(configSchema, { configFilePath: "./config.json" });
  console.log("Loaded configuration:", config);
} catch (error) {
  if (error instanceof ConfigurationError) {
    // Extract detailed error messages
    const { fieldErrors, formErrors } = error.errors;
    
    // Iterate over field errors and display them
    Object.entries(fieldErrors).forEach(([field, messages]) => {
      console.error(`Error in ${field}: ${messages.join(", ")}`);
    });
    
    // Display general form errors, if any
    if (formErrors && formErrors.length > 0) {
      console.error(`General configuration errors: ${formErrors.join(", ")}`);
    }
  } else {
    console.error("An unexpected error occurred:", error);
  }
}

```


## Contributing
Contributions are welcome! Please:

- Fork the repository.
- Create a branch for your changes.
- Write tests for any new features.
- Submit a pull request with detailed changes.

## License

This project is licensed under the MIT License
