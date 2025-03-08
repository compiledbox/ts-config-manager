import { z } from "zod";
import { loadConfig } from "../src/index";
import fs from "fs";
import path from "path";

describe("@compiledbox/ts-config-manager", () => {
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

  afterEach(() => {
    delete process.env.PORT;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
  });

  test("loads configuration from environment variables", () => {
    process.env.PORT = "4000";
    process.env.DB_HOST = "envhost";
    process.env.DB_PORT = "1234";

    const config = loadConfig(configSchema);
    expect(config.PORT).toBe(4000);
    expect(config.DB_HOST).toBe("envhost");
    expect(config.DB_PORT).toBe(1234);
  });

  test("loads configuration from config.json file", () => {
    const tempConfig = {
      PORT: "5000",
      DB_HOST: "filehost",
      DB_PORT: "5678",
      NESTED: { FEATURE_FLAG: "true" }
    };
    const tempFilePath = path.resolve(__dirname, "temp-config.json");
    fs.writeFileSync(tempFilePath, JSON.stringify(tempConfig), "utf-8");

    delete process.env.PORT;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;

    const config = loadConfig(configSchema, { configFilePath: tempFilePath });
    expect(config.PORT).toBe(5000);
    expect(config.DB_HOST).toBe("filehost");
    expect(config.DB_PORT).toBe(5678);
    expect(config.NESTED?.FEATURE_FLAG).toBe(true);

    fs.unlinkSync(tempFilePath);
  });

  test("environment variables override config.json file", () => {
    const tempConfig = {
      PORT: "6000",
      DB_HOST: "filehost",
      DB_PORT: "9012"
    };
    const tempFilePath = path.resolve(__dirname, "temp-config.json");
    fs.writeFileSync(tempFilePath, JSON.stringify(tempConfig), "utf-8");

    process.env.PORT = "7000";
    process.env.DB_HOST = "envhost";
    process.env.DB_PORT = "3456";

    const config = loadConfig(configSchema, { configFilePath: tempFilePath });
    expect(config.PORT).toBe(7000);
    expect(config.DB_HOST).toBe("envhost");
    expect(config.DB_PORT).toBe(3456);

    fs.unlinkSync(tempFilePath);
  });
});
