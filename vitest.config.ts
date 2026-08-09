import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globalSetup: ["./vitest.global-setup.ts"],
    setupFiles: ["./vitest.setup.ts"],
    // SQLite 파일 잠금을 피하기 위해 테스트 파일을 순차 실행한다.
    fileParallelism: false,
    include: ["src/**/*.test.ts"],
  },
});