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
- [API Reference](#api-reference)
  - [loadConfig](#loadconfig)
  - [validateConfig](#validateconfig)
  - [loadConfigFromEnv](#loadconfigfromenv)
  - [maskSecrets](#masksecrets)
- [Testing](#testing)
- [Best Practices](#best-practices)
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
