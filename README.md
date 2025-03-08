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
- [Testing](#testing)
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
npm install ts-config-manager
```

## Usage 

Defining a Configuration Schema
Define your configuration schema using Zod. For example:

```bash
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

```bash
import { loadConfig } from "ts-config-manager";

// Load configuration from environment variables (.env file loaded automatically)
// or merge with a config.json file if specified.
const config = loadConfig(configSchema, { configFilePath: "./config.json" });

console.log("Loaded configuration:", config);

```
## Usage Examples

Example 1: Environment Variables Only

```bash
import { z } from "zod";
import { loadConfig } from "ts-config-manager";

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

```bash
import { z } from "zod";
import { loadConfig } from "ts-config-manager";

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

## Testing

The library uses Jest for testing. To run tests:

- Install development dependencies:
```bash
npm install --save-dev jest ts-jest @types/jest
```

- Initialize Jest configuration (if not already done):
```bash
npx ts-jest config:init
```

- Run tests:
```bash
npm run test
```

## Contributing
Contributions are welcome! Please:

- Fork the repository.
- Create a branch for your changes.
- Write tests for any new features.
- Submit a pull request with detailed changes.

## License

This project is licensed under the MIT License
