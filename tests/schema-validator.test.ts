import { z } from "zod";
import { validateConfig } from "../src/schema-validator";

describe("validateConfig", () => {
  const schema = z.object({
    PORT: z.preprocess(
      (val) => (typeof val === "string" && val.trim() !== "" ? val : "3000"),
      z.string()
    ).transform((val) => Number(val))
  });

  test("should validate a valid configuration", () => {
    const config = { PORT: "8080" };
    const validated = validateConfig(schema, config);
    expect(validated.PORT).toBe(8080);
  });

  test("should throw an error for an invalid configuration", () => {
    const strictSchema = z.object({
      DB_HOST: z.string()
    });
    expect(() => validateConfig(strictSchema, {})).toThrow();
  });
});
