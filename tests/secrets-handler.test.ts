import { maskSecrets } from "../src/secrets-handler";

describe("maskSecrets", () => {
  test("should mask specified secret keys", () => {
    const config = {
      DB_HOST: "localhost",
      DB_PASSWORD: "supersecret",
      API_KEY: "123456"
    };

    const maskedConfig = maskSecrets(config, ["DB_PASSWORD", "API_KEY"]);
    expect(maskedConfig.DB_HOST).toBe("localhost");
    expect(maskedConfig.DB_PASSWORD).toBe("****");
    expect(maskedConfig.API_KEY).toBe("****");
  });

  test("should not modify keys that are not specified", () => {
    const config = {
      DB_HOST: "localhost",
      DB_PORT: "5432"
    };

    const maskedConfig = maskSecrets(config, ["NON_EXISTENT_KEY"]);
    expect(maskedConfig.DB_HOST).toBe("localhost");
    expect(maskedConfig.DB_PORT).toBe("5432");
  });
});
